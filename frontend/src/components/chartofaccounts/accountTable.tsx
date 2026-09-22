import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";

import { Plus } from "lucide-react";

import { useEffect, useState } from "react";
import { createChartOfAccounts, getChartOfAccounts } from "./accountService";
import type { ChartOfAccounts, ChartOfAccountsFormData } from "./types";

import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import axios from "axios";
import Checkbox from "../form/input/Checkbox";
import Select from "../form/Select";
import AccountTreeRows from "./AccountTreeRows";

export default function ChartOfAccountsTable() {
  const [chartOfAccounts, setChartOfAccounts] = useState<ChartOfAccounts[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCheckedTwo, setIsCheckedTwo] = useState(false);
  const [isPostingAccount, setIsPostingAccount] = useState(true);
  const [parentAccountValue, setParentAccountValue] = useState("");
  const [accountTypeValue, setAccountTypeValue] = useState("");
  const [expandedAccounts, setExpandedAccounts] = useState<Set<number>>(new Set());

  const { isOpen, openModal, closeModal } = useModal();

  const options = [
    { value: "Asset", label: "Asset" },
    { value: "Liability", label: "Liability" },
    { value: "Equity", label: "Equity" },
    { value: "Expense", label: "Expense" },
    { value: "Revenue", label: "Revenue" }
  ];

  const emptyFormData: ChartOfAccountsFormData = {
    coa_code: "",
    coa_name: "",
    parent_coa: null,
    account_type: "",
    is_posting_account: true,
    note: null,
  };

  const [formData, setFormData] = useState(emptyFormData);

  const resetFormData = () => {
    setFormData(emptyFormData);
  };
  
  const handleCloseModal = () => {
    resetFormData();
    setIsCheckedTwo(false);
    setIsPostingAccount(true);
    setParentAccountValue("");
    setAccountTypeValue("");
    closeModal();
  };

  const handleSubaccountChange = (checked: boolean) => {
    setIsCheckedTwo(checked);

    if (!checked) {
      setParentAccountValue("");
      setFormData((prev) => ({ ...prev, parent_coa: null}));
    }
    else {
      setAccountTypeValue("");
      setFormData((prev) => ({ ...prev, account_type: "" }));
    }
  };

  const handlePostingAccountChange = (checked: boolean) => {
    setIsPostingAccount(checked);
    setFormData((prev) => ({ ...prev, is_posting_account: checked }));
  };

  const handleParentAccountChange = (value: string) => {
    setParentAccountValue(value);
    setFormData((prev) => ({
      ...prev,
      parent_coa: value ? Number(value) : null,
    }));
  };

  const handleAccountTypeChange = (value: string) => {
    setAccountTypeValue(value);
    setFormData((prev) => ({ ...prev, account_type: value }));
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setFormError(null);
    setIsSaving(true);

    try {
      const newChartOfAccounts = await createChartOfAccounts(formData);

      setChartOfAccounts((prev) => [...prev, newChartOfAccounts]);
      handleCloseModal();

    } catch (error) {
      console.error("Failed to create account:", error);

      if (axios.isAxiosError(error)) {
        console.log("Backend response:", error.response?.data);

        const data = error.response?.data;

        if (typeof data === "string") {
          setFormError(data);
        } else if (data?.detail) {
          setFormError(data.detail);
        } else {
          setFormError("Please check the form for errors.");
        }
      } else {
        setFormError("Something went wrong. Please try again.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const accountOptions = chartOfAccounts.map((accounts) => ({
    value: String(accounts.coa_id),
    label: `${accounts.coa_code} - ${accounts.coa_name}`,
  }));

  const toggleAccount = (accountId: number) => {
    setExpandedAccounts((current) => {
      const next = new Set(current);

      if (next.has(accountId)) {
        next.delete(accountId);
      } else {
        next.add(accountId);
      }

      return next;
    });
  };

  const rootAccounts = chartOfAccounts.filter((account) => !account.parent_coa);

  useEffect(() => {
    setExpandedAccounts((current) => {
      const next = new Set(current);
      const accountIds = new Set(chartOfAccounts.map((account) => account.coa_id));

      chartOfAccounts.forEach((account) => {
        const hasChildren = chartOfAccounts.some(
          (child) => child.parent_coa?.coa_id === account.coa_id,
        );

        if (hasChildren && !current.has(account.coa_id)) {
          next.add(account.coa_id);
        }
      });

      next.forEach((accountId) => {
        if (!accountIds.has(accountId)) {
          next.delete(accountId);
        }
      });

      return next;
    });
  }, [chartOfAccounts]);

  useEffect(() => {
    async function fetchChartOfAccounts() {
      try {
        const data = await getChartOfAccounts();
        setChartOfAccounts(data);
      } catch {
        setError("Unable to load accounts.");
      } finally {
        setIsLoading(false);
      }
    }

    void fetchChartOfAccounts();
  }, []);

  return (
  
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-end">
          <button
            onClick={openModal}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
          >
            <Plus />
            Create
          </button>
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={handleCloseModal} className="max-w-[700px] m-4">
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Create Account
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Fill in the information below to create a new account.
            </p>
          </div>

          {formError && (
            <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-400">
              {formError}
            </div>
          )}

          <form className="flex flex-col" onSubmit={handleSave}>
            <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
              <div className="mt-7">
                <div className="flex items-center justify-between">
                  <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                    Account Information
                  </h5>
                  <div className="lg:justify-self-end">
                    <Checkbox
                      checked={isPostingAccount}
                      onChange={handlePostingAccountChange}
                      label="Posting Account"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-[auto_1fr]">
                  <div className="col-span-2 lg:col-span-1">
                    <Label>Account Code</Label>
                    <Input
                      type="text"
                      name="coa_code"
                      value={formData.coa_code}
                      onChange={handleInputChange}
                      className="w-40"
                    />
                  </div>

                  <div className="col-span-1">
                    <Label>Account Name</Label>
                    <Input
                      type="text"
                      name="coa_name"
                      value={formData.coa_name}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={isCheckedTwo}
                      onChange={handleSubaccountChange}
                      label="Subaccount of:"
                    />
                  </div>

                  <div>
                    <Select
                      options={accountOptions}
                      placeholder="Select Parent Account"
                      value={parentAccountValue}
                      onChange={handleParentAccountChange}
                      disabled={!isCheckedTwo}
                      className="dark:bg-dark-900"
                    />
                  </div>
                  
                  <div className="col-span-2">
                    <Label>Account Type</Label>
                    <Select
                      options={options}
                      placeholder="Select Account Type"
                      value={accountTypeValue}
                      onChange={handleAccountTypeChange}
                      disabled={isCheckedTwo}
                      className="dark:bg-dark-900"
                    />
                  </div>

                  <div className="col-span-2">
                    <Label>Note</Label>
                    <Input
                      type="text"
                      name="note"
                      value={formData.note ?? ""}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={handleCloseModal}>
                Close
              </Button>
              <Button
                type="submit"
                size="sm"
              >
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </Modal>
      
      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* Table Header */}
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Account Code
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Account Name
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Account Type
              </TableCell>
              <TableCell
                isHeader
                className="px-2 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {!isLoading && !error && (
              <AccountTreeRows
                accounts={rootAccounts}
                allAccounts={chartOfAccounts}
                expandedAccounts={expandedAccounts}
                onToggle={toggleAccount}
              />
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
