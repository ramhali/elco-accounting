export interface Supplier {
  supplier_id: number;
  supplier_name: string;
  contact_number: string | null;
  barangay: string | null;
  municipality: string | null;
  supplier_tin: string | null;
  is_active: boolean;
}

export interface SupplierFormData {
  supplier_name: string;
  contact_number: string;
  barangay: string;
  municipality: string;
  supplier_tin: string;
}