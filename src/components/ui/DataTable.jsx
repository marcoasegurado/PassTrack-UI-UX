import { cn } from "../../lib/cn";

export function DataTable({
  columns,
  rows,
  getRowKey = (row, index) => index,
  onRowClick,
  emptyMessage = "No records found.",
  className,
}) {
  return (
    <div className={cn("w-full overflow-x-auto", className)}>
      <table className="w-full min-w-[720px] border-collapse">
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className={cn(
                  "whitespace-nowrap border-b border-line-soft bg-[#fbfcff] px-5 py-3 text-left text-[11px] font-bold uppercase tracking-[0.5px] text-muted",
                  column.headerClassName,
                )}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-5 py-12 text-center text-sm text-muted">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row, index) => (
              <tr
                key={getRowKey(row, index)}
                onClick={onRowClick ? () => onRowClick(row, index) : undefined}
                className={cn(
                  "last:[&>td]:border-b-0",
                  onRowClick && "cursor-pointer hover:bg-[#fafcff]",
                )}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={cn(
                      "h-[68px] border-b border-line-soft px-5 text-sm text-ink",
                      column.className,
                    )}
                  >
                    {column.render ? column.render(row, index) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
