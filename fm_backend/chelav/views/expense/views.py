from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from datetime import date
from chelav.models import Expense, Category


class AddExpenseView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            # Get data from request
            amount = request.data.get('amount')
            category_id = request.data.get('category_id')
            description = request.data.get('description')
            expense_date = request.data.get('date') or date.today()

            # ✅ Get logged-in user (no need to pass user_id anymore)
            user = request.user

            # Validate category
            category = Category.objects.get(id=category_id)

            # Create expense
            expense = Expense.objects.create(
                user=user,
                amount=amount,
                category=category,
                description=description,
                date=expense_date
            )

            return Response({
                "status": "success",
                "message": "Expense added successfully",
                "expense_id": expense.id
            }, status=status.HTTP_201_CREATED)

        except Category.DoesNotExist:
            return Response({
                "error": "Invalid category"
            }, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({
                "error": str(e)
            }, status=status.HTTP_400_BAD_REQUEST)



class UserExpensesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            user = request.user

            # 🔽 Get query params
            category_id = request.query_params.get('category_id')
            start_date = request.query_params.get('start_date')
            end_date = request.query_params.get('end_date')

            # 🔥 Base queryset
            expenses = Expense.objects.filter(user=user)

            # ---------------- FILTER: CATEGORY ----------------
            if category_id:
                expenses = expenses.filter(category_id=category_id)

            # ---------------- FILTER: DATE RANGE ----------------
            if start_date and end_date:
                expenses = expenses.filter(date__range=[start_date, end_date])

            # ---------------- FILTER: SINGLE DATE ----------------
            elif start_date:
                expenses = expenses.filter(date=start_date)

            # ---------------- ORDER ----------------
            expenses = expenses.order_by('-date')

            # ---------------- SERIALIZE ----------------
            data = [
                {
                    "id": exp.id,
                    "amount": exp.amount,
                    "category": exp.category.name if exp.category else None,
                    "description": exp.description,
                    "date": exp.date
                }
                for exp in expenses
            ]

            return Response({
                "status": "success",
                "count": len(data),
                "expenses": data
            })

        except Exception as e:
            return Response({
                "error": str(e)
            }, status=400)