from django.urls import path

from .views import ChartOfAccountAPIView, DepartmentAPIView, EmployeeAPIView, SupplierAPIView

urlpatterns = [
    path('suppliers/', SupplierAPIView.as_view(), name='supplier'),
    path('departments/', DepartmentAPIView.as_view(), name='department'),
    path('employees/', EmployeeAPIView.as_view(), name='employee'),
    path('chart-of-accounts/', ChartOfAccountAPIView.as_view(), name='chart-of-account'),
]