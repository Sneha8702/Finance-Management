# chelav/urls.py
from django.urls import path
from chelav.views.login.views import SignupView, LoginView, LogoutView
from chelav.views.expense.views import AddExpenseView , UserExpensesView
from chelav.views.listing.category_list import CategoryListView

urlpatterns = [
    path('signup/', SignupView.as_view(), name='signup'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
      # Add a new expense
    path('add-expense/', AddExpenseView.as_view(), name='add-expense'),

    # Show all expenses for the logged-in user
    path('show-expenses/', UserExpensesView.as_view(), name='show-expenses'),
    path('categories/', CategoryListView.as_view(), name='categories-list'),
]