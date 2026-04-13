from django.utils import timezone
from django.db.models import Sum
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from chelav.models import Expense, Category, Income

today = timezone.now().date()

start_of_month = today.replace(day=1)
class ExpenseOverView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        today = timezone.now().date()
        start_of_month = today.replace(day=1)

        # 🔹 Total Income (This Month)
        total_income = Income.objects.filter(
            user=user,
            date__gte=start_of_month,
            date__lte=today
        ).aggregate(total=Sum('amount'))['total'] or 0

        # 🔹 Total Expenses (Till Now)
        total_expenses = Expense.objects.filter(
            user=user
        ).aggregate(total=Sum('amount'))['total'] or 0

        # 🔹 Balance
        balance = total_income - total_expenses
        if balance < 0:
            due = abs(balance)
            balance = 0
        else:
            due = 0

        return Response({
            "total_income_this_month": total_income,
            "total_expenses": total_expenses,
            "balance": balance,
            "due": due
        })