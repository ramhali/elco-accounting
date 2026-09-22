import { api } from "../../api/axios";
import { Supplier, SupplierFormData} from "./types";

export const getSuppliers = async () => {
  const response = await api.get<Supplier[]>(
    "/api/masterdata/suppliers/"
  );

  return response.data;
};

export const createSupplier = async (data: SupplierFormData) => {
  const response = await api.post<Supplier>(
    "/api/masterdata/suppliers/",
    data
  );

  return response.data;
};