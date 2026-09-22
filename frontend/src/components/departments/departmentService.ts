import { api } from "../../api/axios";
import { Department, DepartmentFormData} from "./types";

export const getDepartments = async () => {
  const response = await api.get<Department[]>(
    "/api/masterdata/departments/"
  );

  return response.data;
};

export const createDepartment = async (data: DepartmentFormData) => {
  const response = await api.post<Department>(
    "/api/masterdata/departments/",
    data
  );

  return response.data;
};