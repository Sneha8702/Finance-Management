# chelav/urls.py
from django.urls import path
from chelav.views.login.views import SignupView, LoginView, LogoutView
from chelav.views.expense.views import AddExpenseView , UserExpensesView
from chelav.views.listing.category_list import CategoryListView
from chelav.views.user_details.views import CurrentUserView
from chelav.views.home.views import ExpenseOverView
from chelav.views.add_income.views import AddIncomeView

urlpatterns = [
    path('signup/', SignupView.as_view(), name='signup'),
    # path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('user-details/', CurrentUserView.as_view(), name='current-user'),

      # Add a new expense
    path('add-expense/', AddExpenseView.as_view(), name='add-expense'),

    # Show all expenses for the logged-in user
    path('show-expenses/', UserExpensesView.as_view(), name='show-expenses'),
    path('categories/', CategoryListView.as_view(), name='categories-list'),
    path('expense-overview/', ExpenseOverView.as_view(), name='expense-overview'),
    path('add-income/', AddIncomeView.as_view(), name='add-income'),
]