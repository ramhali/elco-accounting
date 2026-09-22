from rest_framework.views import APIView
from rest_framework.response import Response

from .models import ChartOfAccount, Department, Employee, Supplier
from .serializers import CreateChartOfAccountSerializer, CreateDepartmentSerializer, CreateEmployeeSerializer, CreateSupplierSerializer, ListChartOfAccountSerializer, ListDepartmentSerializer, ListEmployeeSerializer, ListSupplierSerializer
from .services import SupplierAlreadyExistsError, create_chart_of_account, create_department, create_employee, create_supplier

# Create your views here.
class SupplierAPIView(APIView):
    def get(self, request):
        suppliers = Supplier.objects.all().order_by("-created_at")
        serializer = ListSupplierSerializer(suppliers, many=True)

        return Response(serializer.data)

    def post(self, request):
        serializer = CreateSupplierSerializer(data=request.data)
        
        serializer.is_valid(raise_exception=True)

        try:
            supplier = create_supplier(user=request.user, data=serializer.validated_data)

            return Response(ListSupplierSerializer(supplier).data, status=201)
        
        except SupplierAlreadyExistsError as e:
            return Response({"detail": str(e)}, status=400)

class DepartmentAPIView(APIView):
    def get(self, request):
        departments = Department.objects.all().order_by("dept_code")
        serializer = ListDepartmentSerializer(departments, many=True)

        return Response(serializer.data)

    def post(self, request):
        serializer = CreateDepartmentSerializer(data=request.data)
        
        serializer.is_valid(raise_exception=True)

        try:
            department = create_department(data=serializer.validated_data)

            return Response(ListDepartmentSerializer(department).data, status=201)
        
        except Exception as e:
            return Response({"detail": str(e)}, status=400)

class EmployeeAPIView(APIView):
    def get(self, request):
        employees = Employee.objects.all().order_by("last_name")
        serializer = ListEmployeeSerializer(employees, many=True)

        return Response(serializer.data)

    def post(self, request):
        serializer = CreateEmployeeSerializer(data=request.data)
        
        serializer.is_valid(raise_exception=True)

        try:
            employee = create_employee(data=serializer.validated_data)

            return Response(ListEmployeeSerializer(employee).data, status=201)
        
        except Exception as e:
            return Response({"detail": str(e)}, status=400)
        
class ChartOfAccountAPIView(APIView):
    def get(self, request):
        chart_of_accounts = ChartOfAccount.objects.all().order_by("coa_code")
        serializer = ListChartOfAccountSerializer(chart_of_accounts, many=True)

        return Response(serializer.data)

    def post(self, request):
        serializer = CreateChartOfAccountSerializer(data=request.data)
        
        serializer.is_valid(raise_exception=True)

        try:
            chart_of_account = create_chart_of_account(user=request.user, data=serializer.validated_data)

            return Response(ListChartOfAccountSerializer(chart_of_account).data, status=201)
        
        except Exception as e:
            return Response({"detail": str(e)}, status=400)