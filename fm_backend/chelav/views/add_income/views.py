from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from chelav.models import Income
from datetime import datetime



class AddIncomeView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            user = request.user
            print("Received data:", request.data)

            amount = request.data.get('amount')
            source = request.data.get('source')
            date = request.data.get('date')

            # ✅ BOOLEAN HANDLING (safe)
            is_recurring = str(request.data.get('is_recurring', False)).lower() == 'true'
            frequency = request.data.get('frequency', None)

            # =========================
            # 🔹 AMOUNT VALIDATION
            # =========================
            if amount is None:
                return Response({"error": "Amount is required"}, status=400)

            try:
                amount = float(amount)
            except ValueError:
                return Response({"error": "Amount must be a number"}, status=400)

            if amount < 1:
                return Response({"error": "Amount must be at least 1"}, status=400)

            if amount > 10000000:
                return Response({"error": "Amount too large"}, status=400)

            # =========================
            # 🔹 SOURCE VALIDATION
            # =========================
            if not source or not source.strip():
                return Response({"error": "Source required"}, status=400)

            source = source.strip()

            if len(source) > 100:
                return Response({"error": "Source too long"}, status=400)

            # =========================
            # 🔹 DATE VALIDATION
            # =========================
            if not date:
                return Response({"error": "Date is required"}, status=400)

            date_str = str(date).strip()
            print("DATE RECEIVED:", repr(date_str))

            try:
                # ✅ Format: YYYY-MM-DD
                parsed_date = datetime.strptime(date_str, "%Y-%m-%d").date()
                print("Parsed as YYYY-MM-DD")

            except ValueError:
                try:
                    # ✅ Format: DD/MM/YYYY
                    parsed_date = datetime.strptime(date_str, "%d/%m/%Y").date()
                    print("Parsed as DD/MM/YYYY")

                except ValueError:
                    return Response(
                        {"error": f"Invalid date format. Received: {date_str}"},
                        status=400
                    )

            # =========================
            # 🔹 RECURRING VALIDATION
            # =========================
            if is_recurring and not frequency:
                return Response(
                    {"error": "Frequency required for recurring income"},
                    status=400
                )

            # =========================
            # 🔹 CREATE INCOME
            # =========================
            income = Income.objects.create(
                user=user,
                amount=amount,
                source=source,
                date=parsed_date,
                is_recurring=is_recurring,
                frequency=frequency
            )

            return Response({
                "message": "Income added successfully",
                "data": {
                    "id": income.id,
                    "amount": income.amount,
                    "source": income.source,
                    "date": income.date,
                    "is_recurring": income.is_recurring
                }
            })

        except Exception as e:
            print("ERROR:", str(e))
            return Response({"error": str(e)}, status=500)