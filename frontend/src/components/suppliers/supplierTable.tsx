import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";

import Badge from "../ui/badge/Badge";
import { Plus } from "lucide-react";

import { useEffect, useState } from "react";
import { createSupplier, getSuppliers } from "./supplierService";
import type { Supplier, SupplierFormData } from "./types";

import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import axios from "axios";

export default function SupplierTable() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { isOpen, openModal, closeModal } = useModal();

  const emptyFormData: SupplierFormData = {
    supplier_name: "",
    contact_number: "",
    barangay: "",
    municipality: "",
    supplier_tin: "",
  };

  const [formData, setFormData] = useState(emptyFormData);

  const resetFormData = () => {
    setFormData(emptyFormData);
  };
  
  const handleCloseModal = () => {
    resetFormData();
    closeModal();
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setFormError(null);
    setIsSaving(true);

    try {
      const newSupplier = await createSupplier(formData);

      setSuppliers((prev) => [...prev, newSupplier]);
      handleCloseModal();

    } catch (error) {
      console.error("Failed to create supplier:", error);

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

  useEffect(() => {
    async function fetchSuppliers() {
      try {
        const data = await getSuppliers();
        setSuppliers(data);
      } catch {
        setError("Unable to load suppliers.");
      } finally {
        setIsLoading(false);
      }
    }

    void fetchSuppliers();
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
              Create Supplier
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Fill in the information below to create a new supplier.
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
                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                  Supplier Information
                </h5>

                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div className="col-span-2 lg:col-span-1">
                    <Label>Supplier Name</Label>
                    <Input
                      type="text"
                      name="supplier_name"
                      value={formData.supplier_name}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>Contact Number</Label>
                    <Input
                      type="text"
                      name="contact_number"
                      value={formData.contact_number}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>Barangay</Label>
                    <Input
                      type="text"
                      name="barangay"
                      value={formData.barangay}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>City/Municipality</Label>
                    <Input
                      type="text"
                      name="municipality"
                      value={formData.municipality}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="col-span-2">
                    <Label>Supplier TIN</Label>
                    <Input
                      type="text"
                      name="supplier_tin"
                      value={formData.supplier_tin}
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
                Supplier Name
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                TIN
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Contact Number
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Status
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Total Outstanding Payable
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
            {!isLoading && !error && suppliers.map((supplier) => (
              <TableRow key={supplier.supplier_id}>
                <TableCell className="px-5 py-4 sm:px-6 text-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 overflow-hidden rounded-full">
                      <img
                        width={40}
                        height={40}
                        alt={supplier.supplier_name}
                      />
                    </div>
                    <div>
                      <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {supplier.supplier_name}
                      </span>
                      <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                        {supplier.barangay}, {supplier.municipality}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {supplier.supplier_tin}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {supplier.contact_number}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  <Badge
                    size="sm"
                    color={
                      supplier.is_active === true
                        ? "success"
                        : supplier.is_active === false
                        ? "warning"
                        : "error"
                    }
                  >
                    {supplier.is_active === true ? "Active" : supplier.is_active === false ? "Inactive" : "Error"}
                  </Badge>
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  -
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  (edit, delete, view(trans))
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
