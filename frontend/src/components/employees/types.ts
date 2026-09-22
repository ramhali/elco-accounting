import { Department } from "../departments/types";

export interface Employee {
  employee_id: number;
  designation: string;
  title: string | null;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  extension: string | null;
  contact_number: string | null;
  email: string | null;
  is_active: boolean;
  has_account: boolean | null;
  dept: Department | null;
}

export interface EmployeeFormData {
  designation: string;
  title: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  extension: string;
  contact_number: string;
  email: string;
  is_active: boolean;
  dept: number | null;
}