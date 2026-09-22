from .models import ChartOfAccount, Department, Employee, Supplier

class SupplierAlreadyExistsError(Exception):
    pass

def create_supplier(user, data):
    if Supplier.objects.filter(
        supplier_tin=data.get('supplier_tin'),
    ).exists():
        raise SupplierAlreadyExistsError("Supplier already exists")

    supplier = Supplier.objects.create(
        supplier_name=data.get('supplier_name'),
        contact_number=data.get('contact_number'),
        barangay=data.get('barangay'),
        municipality=data.get('municipality'),
        supplier_tin=data.get('supplier_tin'),
        is_active=data.get('is_active', True),

        created_by=user,
    )

    return supplier

def create_department(data):
    if Department.objects.filter(
        dept_code=data.get('dept_code'),
        dept_name=data.get('dept_name')
    ).exists():
        raise Exception("Department already exists")

    department = Department.objects.create(
        dept_code=data.get('dept_code'),
        dept_name=data.get('dept_name')
    )

    return department

def create_employee(data):
    if Employee.objects.filter(
        first_name=data.get('first_name'),
        last_name=data.get('last_name'),
        dept=data.get('dept')
    ).exists():
        raise Exception("Employee already exists")

    employee = Employee.objects.create(
        designation=data.get('designation'),
        title=data.get('title'),
        first_name=data.get('first_name'),
        last_name=data.get('last_name'),
        extension=data.get('extension'),
        contact_number=data.get('contact_number'),
        email=data.get('email'),
        dept=data.get('dept')
    )

    return employee

def create_chart_of_account(user, data):
    if ChartOfAccount.objects.filter(
        coa_code=data.get('coa_code'),
        coa_name=data.get('coa_name')
    ).exists():
        raise Exception("Chart of Account already exists")

    account_type = ""

    parent_coa = data.get('parent_coa')

    if parent_coa:
        account_type = parent_coa.account_type
    else:
        account_type = data.get('account_type')

    account = ChartOfAccount.objects.create(
        coa_code=data.get('coa_code'),
        coa_name=data.get('coa_name'),
        account_type=account_type,
        parent_coa=data.get('parent_coa'),
        is_posting_account=data.get('is_posting_account', True),
        is_active=data.get('is_active', True),
        note=data.get('note'),

        created_by=user
    )

    return account