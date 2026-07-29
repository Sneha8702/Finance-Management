from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum
from django.db.models.functions import TruncDay, TruncMonth
from datetime import datetime, timedelta
from calendar import monthrange
from chelav.models import Expense


class UserExpenseAnalyticsView(APIView):
    """
User Expense Analytics API

Purpose:
--------
This API provides graphical/analytical data of user expenses
for dashboards and charts.

It aggregates expense data based on different time modes
(daily, monthly, yearly) and supports flexible date filtering.

Features:
---------
1. Daily Analysis
   - Single date or custom date range
   - Default: today's expenses

2. Monthly Analysis
   - Day-wise expense data for the current month
   - Includes all dates (missing days filled with 0)

3. Yearly Analysis
   - Month-wise total expenses for the current year
   - Includes all months (missing months filled with 0)

4. Zero-Fill Support
   - Ensures continuous graph data even when no expenses exist

5. Date Filtering
   - Single date filter
   - Date range filter (start_date & end_date)

6. Structured Response
   - Returns data in `{date/month, amount}` format
   - Optimized for frontend chart libraries (Recharts, Chart.js)

Query Parameters:
-----------------
mode: string (optional)
    - daily
    - monthly (default)
    - yearly

date: string (YYYY-MM-DD) (optional)
    - Used for single day analysis

start_date: string (YYYY-MM-DD) (optional)
end_date: string (YYYY-MM-DD) (optional)
    - Used for date range filtering (daily mode)

Authentication:
---------------
- Requires authenticated user (JWT Token)

Response Format:
----------------
{
    "mode": "monthly",
    "data": [
        { "date": "2026-04-01", "amount": 500 },
        { "date": "2026-04-02", "amount": 0 }
    ]
}

Yearly Example:
---------------
{
    "mode": "yearly",
    "data": [
        { "month": 1, "amount": 5000 },
        { "month": 2, "amount": 3000 }
    ]
}

Example URLs:
-------------
/analytics/
/analytics/?mode=daily
/analytics/?mode=daily&date=2026-04-20
/analytics/?mode=daily&start_date=2026-04-01&end_date=2026-04-10
/analytics/?mode=monthly
/analytics/?mode=yearly
"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        mode = request.GET.get('mode', 'monthly')

        date = request.GET.get('date')
        start_date = request.GET.get('start_date')
        end_date = request.GET.get('end_date')

        expenses = Expense.objects.filter(user=user)

        results = []

        # ---------------- DAILY (single or range) ----------------
        if mode == 'daily':

            if date:
                start = end = datetime.strptime(date, "%Y-%m-%d").date()
            elif start_date and end_date:
                start = datetime.strptime(start_date, "%Y-%m-%d").date()
                end = datetime.strptime(end_date, "%Y-%m-%d").date()
            else:
                today = datetime.today().date()
                start = end = today

            data = expenses.filter(date__range=[start, end]) \
                .annotate(day=TruncDay('date')) \
                .values('day') \
                .annotate(total=Sum('amount'))

            data_dict = {item['day']: item['total'] for item in data}

            current = start
            while current <= end:
                results.append({
                    "date": current.strftime("%Y-%m-%d"),
                    "amount": data_dict.get(current, 0)
                })
                current += timedelta(days=1)

        # ---------------- MONTHLY ----------------
        elif mode == 'monthly':

            today = datetime.today()
            year = today.year
            month = today.month

            start = datetime(year, month, 1).date()
            end = datetime(year, month, monthrange(year, month)[1]).date()

            data = expenses.filter(date__range=[start, end]) \
                .annotate(day=TruncDay('date')) \
                .values('day') \
                .annotate(total=Sum('amount'))

            data_dict = {item['day']: item['total'] for item in data}

            current = start
            while current <= end:
                results.append({
                    "date": current.strftime("%Y-%m-%d"),
                    "amount": data_dict.get(current, 0)
                })
                current += timedelta(days=1)

        # ---------------- YEARLY ----------------
        elif mode == 'yearly':

            year = datetime.today().year

            data = expenses.filter(date__year=year) \
                .annotate(month=TruncMonth('date')) \
                .values('month') \
                .annotate(total=Sum('amount'))

            data_dict = {item['month'].month: item['total'] for item in data}

            for i in range(1, 13):
                results.append({
                    "month": i,
                    "amount": data_dict.get(i, 0)
                })

        return Response({
            "mode": mode,
            "data": results
        })