from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from chelav.models import Category


class CategoryListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        categories = Category.objects.all()

        # ✅ If no categories exist
        if not categories.exists():
            return Response({
                "status": "success",
                "categories": [],
                "message": "No categories found"
            })

        # ✅ If categories exist
        data = [
            {
                "id": cat.id,
                "name": cat.name
            }
            for cat in categories
        ]

        return Response({
            "status": "success",
            "categories": data
        })