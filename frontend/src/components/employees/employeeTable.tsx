import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";

import { Plus } from "lucide-react";
import Badge from "../ui/badge/Badge";

import { useEffect, useState } from "react";
import { createEmployee, getEmployees } from "./employeeService";
import type { Employee, EmployeeFormData } from "./types";

import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Select from "../form/Select";
import axios from "axios";
import { Department } from "../departments/types";
import { getDepartments } from "../departments/departmentService";

export default function EmployeeTable() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { isOpen, openModal, closeModal } = useModal();

  const emptyFormData: EmployeeFormData = {
    designation: "",
    title: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    extension: "",
    contact_number: "",
    email: "",
    is_active: true,
    dept: null,
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
      const newEmployee = await createEmployee(formData);

      setEmployees((prev) => [...prev, newEmployee]);
      handleCloseModal();

    } catch (error) {
      console.error("Failed to create employee:", error);

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

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      dept: value ? Number(value) : null,
    }));
  };

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const data = await getDepartments();
        setDepartments(data);
      } catch (error) {
        console.error("Failed to fetch departments:", error);
      }
    };

    fetchDepartments();
  }, []);

  const departmentOptions = departments.map((dept) => ({
    value: String(dept.dept_id),
    label: `${dept.dept_code} - ${dept.dept_name}`,
  }));

  useEffect(() => {
    async function fetchEmployees() {
      try {
        const data = await getEmployees();
        setEmployees(data);
      } catch {
        setError("Unable to load employees.");
      } finally {
        setIsLoading(false);
      }
    }

    void fetchEmployees();
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
              Create Employee
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Fill in the information below to add a new employee.
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
                  Employee Information
                </h5>

                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div>
                    <Label>Designation</Label>
                    <Input
                      type="text"
                      name="designation"
                      value={formData.designation}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label>Department</Label>
                    <Select
                      options={departmentOptions}
                      placeholder="Select Department"
                      onChange={handleSelectChange}
                      className="dark:bg-dark-900"
                    />
                  </div>
                </div>

                <div className="mt-7">
                  <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                    Personal Information
                  </h5>
                  {/* Name fields */}
                  <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-[1fr_3fr_3fr_1fr]">
                    <div>
                      <Label>Title</Label>
                      <Input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <Label>First Name</Label>
                      <Input
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div>
                      <Label>Last Name</Label>
                      <Input
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div>
                      <Label>Extension</Label>
                      <Input
                        type="text"
                        name="extension"
                        value={formData.extension}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                    <div>
                      <Label>Email</Label>
                      <Input
                        type="text"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div>
                      <Label>Contact Number</Label>
                      <Input
                        type="text"
                        name="contact_number"
                        value={formData.contact_number}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button type="button" size="sm" variant="outline" onClick={handleCloseModal}>
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
                Employee Name
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Department
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Email
              </TableCell>
              <TableCell
                isHeader
                className="px-2 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Employment Status
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
            {!isLoading && !error && employees.map((employee) => (
              <TableRow key={employee.employee_id}>
                <TableCell className="px-5 py-4 sm:px-6 text-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 overflow-hidden rounded-full">
                      <img
                        width={40}
                        height={40}
                        alt={employee.first_name}
                      />
                    </div>
                    <div>
                      <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {employee.title} {employee.first_name} {employee.middle_name} {employee.last_name}
                        {employee.extension && `, ${employee.extension}`}
                      </span>
                      <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                        {employee.designation}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {employee.dept?.dept_name ?? "-"}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {employee.email}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  <Badge
                    size="sm"
                    color={
                      employee.is_active === true
                        ? "success"
                        : employee.is_active === false
                        ? "warning"
                        : "error"
                    }
                  >
                    {employee.is_active === true ? "Active" : employee.is_active === false ? "Inactive" : "Error"}
                  </Badge>
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  (3 dots for a more detailed view)
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
