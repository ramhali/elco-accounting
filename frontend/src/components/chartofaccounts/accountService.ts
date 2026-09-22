import { api } from "../../api/axios";
import { ChartOfAccounts, ChartOfAccountsFormData} from "./types";

export const getChartOfAccounts = async () => {
  const response = await api.get<ChartOfAccounts[]>(
    "/api/masterdata/chart-of-accounts/"
  );

  return response.data;
};

export const createChartOfAccounts = async (data: ChartOfAccountsFormData) => {
  const response = await api.post<ChartOfAccounts>(
    "/api/masterdata/chart-of-accounts/",
    data
  );

  return response.data;
};