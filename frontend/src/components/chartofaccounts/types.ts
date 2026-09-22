export interface ChartOfAccounts {
  coa_id: number;
  coa_code: string;
  coa_name: string;
  parent_coa: ChartOfAccounts | null;
  account_type: string;
  is_posting_account: boolean;
  is_active: boolean;
  note: string | null;
}

export interface ChartOfAccountsFormData {
  coa_code: string;
  coa_name: string;
  parent_coa: number | null;
  account_type: string;
  is_posting_account: boolean;
  note: string | null;
}