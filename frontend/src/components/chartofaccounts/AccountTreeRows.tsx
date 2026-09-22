import type React from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import type { ChartOfAccounts } from "./types";
import Badge from "../ui/badge/Badge";
import { TableCell, TableRow } from "../ui/table";

interface AccountTreeRowsProps {
  accounts: ChartOfAccounts[];
  allAccounts: ChartOfAccounts[];
  expandedAccounts: Set<number>;
  onToggle: (accountId: number) => void;
  depth?: number;
}

const AccountTreeRows = ({
  accounts,
  allAccounts,
  expandedAccounts,
  onToggle,
  depth = 0,
}: AccountTreeRowsProps): React.ReactNode[] =>
  accounts.flatMap((account) => {
    const childAccounts = allAccounts.filter(
      (child) => child.parent_coa?.coa_id === account.coa_id,
    );
    const hasChildren = childAccounts.length > 0;
    const isExpanded = expandedAccounts.has(account.coa_id);
    const toggleRow = () => {
      if (hasChildren) {
        onToggle(account.coa_id);
      }
    };
    const handleKeyDown = (event: React.KeyboardEvent<HTMLTableRowElement>) => {
      if (hasChildren && (event.key === "Enter" || event.key === " ")) {
        event.preventDefault();
        toggleRow();
      }
    };

    return [
      <TableRow
        key={account.coa_id}
        className={hasChildren ? "cursor-pointer hover:bg-gray-50 dark:hover:bg-white/[0.03]" : ""}
        onClick={toggleRow}
        onKeyDown={handleKeyDown}
        role={hasChildren ? "button" : undefined}
        tabIndex={hasChildren ? 0 : undefined}
        aria-expanded={hasChildren ? isExpanded : undefined}
        aria-label={hasChildren ? `${isExpanded ? "Collapse" : "Expand"} ${account.coa_name}` : undefined}
      >
        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
          <span
            className="flex items-center"
            style={{ paddingLeft: `${depth * 1.5}rem` }}
          >
            {hasChildren ? (
              isExpanded ? <ChevronDown size={16} className="mr-1" /> : <ChevronRight size={16} className="mr-1" />
            ) : (
              <span className="mr-1 inline-block h-4 w-4" />
            )}
            {account.coa_code}
          </span>
        </TableCell>
        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
          <span style={{ paddingLeft: `${depth * 1.5}rem` }}>
            {account.coa_name}
          </span>
        </TableCell>
        <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
          <Badge
            size="sm"
            variant="liquid"
            color={
              account.account_type === "Asset"
                ? "success"
                : account.account_type === "Liability"
                ? "warning"
                : account.account_type === "Equity"
                ? "primary"
                : account.account_type === "Revenue"
                ? "info"
                : account.account_type === "Expense"
                ? "error"
                : "light"
            }
          >
            {account.account_type}
          </Badge>
        </TableCell>
        <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
          (edit, deact, viewledger)
        </TableCell>
      </TableRow>,
      ...(isExpanded
        ? AccountTreeRows({
            accounts: childAccounts,
            allAccounts,
            expandedAccounts,
            onToggle,
            depth: depth + 1,
          })
        : []),
    ];
  });

export default AccountTreeRows;
