from rest_framework import serializers

from .models import ChartOfAccount, Department, Employee, Supplier

class CreateSupplierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supplier
        fields = ['supplier_name', 'contact_number', 'barangay', 'municipality', 'supplier_tin', 'is_active']

class ListSupplierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supplier
        fields = ['supplier_id', 'supplier_name', 'contact_number', 'barangay', 'municipality', 'supplier_tin', 'is_active']

class CreateDepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ['dept_code', 'dept_name']

class ListDepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ['dept_id', 'dept_code', 'dept_name']

class CreateEmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = ['designation', 'title', 'first_name', 'last_name', 'extension', 'contact_number', 'email', 'dept']

class ListEmployeeSerializer(serializers.ModelSerializer):
    has_account = serializers.SerializerMethodField()
    dept = ListDepartmentSerializer(read_only=True)

    class Meta:
        model = Employee
        fields = ['employee_id', 'designation', 'title', 'first_name', 'last_name', 'extension', 'contact_number', 'email', 'dept', 'is_active', 'has_account']


    def get_has_account(self, obj):
        return hasattr(obj, 'user') and obj.user is not None

class CreateChartOfAccountSerializer(serializers.ModelSerializer):
    account_type = serializers.ChoiceField(
        choices=ChartOfAccount.ACCOUNT_TYPE_CHOICES,
        required=False,
        allow_blank=True,
    )

    class Meta:
        model = ChartOfAccount
        fields = ['coa_code', 'coa_name', 'account_type', 'parent_coa', 'is_posting_account', 'is_active', 'note']

class ListChartOfAccountSerializer(serializers.ModelSerializer):
    parent_coa = serializers.SerializerMethodField()

    class Meta:
        model = ChartOfAccount
        fields = ['coa_id', 'coa_code', 'coa_name', 'account_type', 'parent_coa', 'is_posting_account', 'is_active', 'note']

    def get_parent_coa(self, obj):
        if obj.parent_coa:
            return {
                "coa_id": obj.parent_coa.coa_id,
                "coa_code": obj.parent_coa.coa_code,
                "coa_name": obj.parent_coa.coa_name,
            }
        return None