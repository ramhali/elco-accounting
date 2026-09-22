from django.db import models

# Create your models here.
class Department(models.Model):
    dept_id = models.AutoField(primary_key=True)
    dept_code = models.CharField(max_length=10, unique=True)
    dept_name = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.dept_name
    
class Employee(models.Model):
    employee_id = models.AutoField(primary_key=True)
    designation = models.CharField(max_length=255)
    title = models.CharField(max_length=255, null=True, blank=True)
    first_name = models.CharField(max_length=255)
    middle_name = models.CharField(max_length=255, null=True, blank=True)
    last_name = models.CharField(max_length=255)
    extension = models.CharField(max_length=10, null=True, blank=True)
    contact_number = models.CharField(max_length=20, null=True, blank=True)
    email = models.EmailField(max_length=255, null=True, blank=True)
    is_active = models.BooleanField(default=True)

    dept = models.ForeignKey(Department,
                                   on_delete=models.SET_NULL,
                                   related_name="employees",
                                   null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["last_name"]

    def __str__(self):
        parts = [self.title, self.first_name, self.last_name]
        name = " ".join(filter(None, parts))

        if self.extension:
            return f"{name}, {self.extension}"
        
        return name

class Supplier(models.Model):
    supplier_id = models.AutoField(primary_key=True)
    supplier_name = models.CharField(max_length=255)
    contact_number = models.CharField(max_length=20, null=True, blank=True)
    barangay = models.CharField(max_length=255, null=True, blank=True)
    municipality = models.CharField(max_length=255, null=True, blank=True)
    supplier_tin = models.CharField(max_length=20, null=True, blank=True, unique=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True, related_name='suppliers_created')
    updated_at = models.DateTimeField(auto_now=True)
    updated_by = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True, related_name='suppliers_updated')

    def __str__(self):
        return self.supplier_name

class ChartOfAccount(models.Model):
    ACCOUNT_TYPE_CHOICES = [
        ('Asset', 'Asset'),
        ('Liability', 'Liability'),
        ('Equity', 'Equity'),
        ('Revenue', 'Revenue'),
        ('Expense', 'Expense'),
    ]

    coa_id = models.AutoField(primary_key=True)
    coa_code = models.CharField(max_length=20, unique=True)
    coa_name = models.CharField(max_length=255, unique=True)
    parent_coa = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='sub_coas')
    account_type = models.CharField(max_length=50, choices=ACCOUNT_TYPE_CHOICES)
    is_posting_account = models.BooleanField(default=True)
    is_active = models.BooleanField(default=True)
    note = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True, related_name='coas_created')
    updated_at = models.DateTimeField(auto_now=True)
    updated_by = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True, related_name='coas_updated')

    def __str__(self):
        return self.coa_name