from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from datetime import date
from decimal import Decimal, InvalidOperation
from django.db.models import Sum
from chelav.models import Expense, Category, Income  
from django.core.paginator import Paginator, EmptyPage


class AddExpenseView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            # ---------------- GET DATA ----------------
            amount = request.data.get('amount')
            category_id = request.data.get('category_id')
            description = request.data.get('description')
            expense_date = request.data.get('date') or date.today()

            user = request.user

            # ---------------- VALIDATE AMOUNT ----------------
            if amount is None:
                return Response({"error": "Amount is required"}, status=400)

            try:
                amount = Decimal(amount)
            except InvalidOperation:
                return Response({"error": "Invalid amount format"}, status=400)

            #  Reject zero or negative
            if amount <= 0:
                return Response({"error": "Amount must be greater than 0"}, status=400)

            #  Reject very small values like 0.1
            if amount < Decimal("1"):
                return Response({"error": "Minimum amount is ₹1"}, status=400)

            #  Reject very large values
            if amount > Decimal("1000000"):  # 10 lakh limit
                return Response({"error": "Amount too large"}, status=400)

            # ---------------- VALIDATE CATEGORY ----------------
            try:
                category = Category.objects.get(id=category_id)
            except Category.DoesNotExist:
                return Response({"error": "Invalid category"}, status=400)

            # ---------------- CALCULATE BALANCE ----------------
            total_income = Income.objects.filter(user=user).aggregate(
            total=Sum('amount')
            )['total'] or Decimal("0")

            total_expense = Expense.objects.filter(user=user).aggregate(
                total=Sum('amount')
            )['total'] or Decimal("0")

            # ✅ FORCE Decimal (fixes your error)
            total_income = Decimal(total_income)
            total_expense = Decimal(total_expense)

            current_balance = total_income - total_expense

            # ---------------- CHECK OVERSPENDING ----------------
            warning = None

            if amount > current_balance:
                deficit = amount - current_balance
                warning = f"⚠️ You are exceeding your balance by ₹{deficit}"

            # ---------------- CREATE EXPENSE ----------------
            expense = Expense.objects.create(
                user=user,
                amount=amount,
                category=category,
                description=description,
                date=expense_date
            )

            # ---------------- RESPONSE ----------------
            response_data = {
                "status": "success",
                "message": "Expense added successfully",
                "expense_id": expense.id,
                "current_balance": str(current_balance - amount)  # updated balance
            }

            if warning:
                response_data["warning"] = warning

            return Response(response_data, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({
                "error": str(e)
            }, status=status.HTTP_400_BAD_REQUEST)



class UserExpensesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            user = request.user

            # 🔽 Query params
            page = int(request.GET.get('page', 1))
            page_size = int(request.GET.get('page_size', 10))

            category_id = request.GET.get('category_id')
            start_date = request.GET.get('start_date')
            end_date = request.GET.get('end_date')

            # 🔥 Base queryset
            expenses = Expense.objects.filter(user=user)

            # -------- FILTER: CATEGORY --------
            if category_id:
                expenses = expenses.filter(category_id=category_id)

            # -------- FILTER: DATE --------
            if start_date and end_date:
                expenses = expenses.filter(date__range=[start_date, end_date])
            elif start_date:
                expenses = expenses.filter(date=start_date)

            # -------- ORDER --------
            expenses = expenses.order_by('-date')

            # -------- TOTAL COUNT --------
            total_count = expenses.count()

            # -------- PAGINATION --------
            paginator = Paginator(expenses, page_size)

            try:
                page_obj = paginator.page(page)
            except EmptyPage:
                return Response({
                    'results': [],
                    'count': total_count,
                    'total_pages': paginator.num_pages,
                    'current_page': page,
                    'page_size': page_size,
                })

            # -------- SERIALIZE --------
            results = [
                {
                    "id": exp.id,
                    "amount": exp.amount,
                    "category": exp.category.name if exp.category else None,
                    "description": exp.description,
                    "date": exp.date,
                }
                for exp in page_obj
            ]

            # -------- RESPONSE --------
            return Response({
                'results': results,
                'count': total_count,
                'total_pages': paginator.num_pages,
                'current_page': page,
                'page_size': page_size,
            })

        except Exception as e:
            return Response({
                "error": str(e)
            }, status=400)