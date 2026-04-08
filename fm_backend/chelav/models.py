# Create your models here.
from django.db import models
from django.contrib.auth.models import User


# 🔹 Category Model (Better than using plain text)
class Category(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


# 🔹 Expense Model
class Expense(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    amount = models.FloatField()
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True)
    description = models.TextField(blank=True)
    date = models.DateField()

    def __str__(self):
        return f"{self.user.username} - {self.category} - {self.amount}"


# 🔹 Income Model
class Income(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    amount = models.FloatField()
    source = models.CharField(max_length=100)
    date = models.DateField()

    def __str__(self):
        return f"{self.user.username} - {self.source} - {self.amount}"


# 🔹 (Optional - Future Use) Family Model
class Family(models.Model):
    name = models.CharField(max_length=100)
    members = models.ManyToManyField(User)

    def __str__(self):
        return self.name