import { api } from "../../api/axios";
import { Employee, EmployeeFormData} from "./types";

export const getEmployees = async () => {
  const response = await api.get<Employee[]>(
    "/api/masterdata/employees/"
  );

  return response.data;
};

export const createEmployee = async (data: EmployeeFormData) => {
  const response = await api.post<Employee>(
    "/api/masterdata/employees/",
    data
  );

  return response.data;
};