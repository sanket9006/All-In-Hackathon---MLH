from django.urls import path
from . import views

urlpatterns = [
    path('create/', views.create_poll, name='create_poll'),
    path('join/', views.view_poll, name='join_poll'),
]
