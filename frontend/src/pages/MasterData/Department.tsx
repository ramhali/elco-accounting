import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import DepartmentTable from "../../components/departments/departmentTable";

export default function DepartmentSetup() {
  return (
    <>
      <PageMeta
        title="React.js Department Setup Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Department Setup Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Departments" />
      <div className="space-y-6">
        <ComponentCard title="">
          <DepartmentTable />
        </ComponentCard>
      </div>
    </>
  );
}
