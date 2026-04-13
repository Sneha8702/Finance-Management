from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from chelav.models import Income
from chelav.views.add_income.serializer import IncomeSerializer


class AddIncomeView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = IncomeSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(user=request.user)  # 🔥 attach logged-in user
            return Response({
                "message": "Income added successfully",
                "data": serializer.data
            }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)