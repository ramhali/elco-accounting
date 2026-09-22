import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import EmployeeTable from "../../components/employees/employeeTable";

export default function EmployeeSetup() {
  return (
    <>
      <PageMeta
        title="React.js Employee Setup Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Employee Setup Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Employees" />
      <div className="space-y-6">
        <ComponentCard title="">
          <EmployeeTable />
        </ComponentCard>
      </div>
    </>
  );
}
