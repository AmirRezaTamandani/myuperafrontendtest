"use client";
import React from "react";
import {
  Column,
  Table,
  useReactTable,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getPaginationRowModel,
  sortingFns,
  getSortedRowModel,
  FilterFn,
  SortingFn,
  ColumnDef,
  flexRender,
  FilterFns,
} from "@tanstack/react-table";
import {
  RankingInfo,
  rankItem,
  compareItems,
} from "@tanstack/match-sorter-utils";
import { UserData } from "@/types";
import useFetchData from "@/hooks/useFetchData";
import DebounceSearchInput from "./DebounceSearchInput";

declare module "@tanstack/table-core" {
  interface FilterFns {
    fuzzy: FilterFn<unknown>;
  }
  interface FilterMeta {
    itemRank: RankingInfo;
  }
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value);

  // Store the itemRank info
  addMeta({
    itemRank,
  });

  // Return if the item should be filtered in/out
  return itemRank.passed;
};

export default function DataTable() {
  const { data: fetchedData, isLoading, isError } = useFetchData();

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [globalFilter, setGlobalFilter] = React.useState("");

  const columns = React.useMemo<ColumnDef<UserData, any>[]>(
    () => [
      {
        header: "id",
        footer: (props) => props.column.id,
        accessorKey: "id",
        cell: (info) => info.getValue(),
      },
      {
        header: "First Name",
        footer: (props) => props.column.id,
        accessorKey: "first_name",
        cell: (info) => info.getValue(),
      },
      {
        header: "Last Name",
        footer: (props) => props.column.id,
        accessorKey: "last_name",
        cell: (info) => info.getValue(),
      },
      {
        header: "code",
        footer: (props) => props.column.id,
        accessorKey: "code",
        cell: (info) => info.getValue(),
      },
      {
        header: "company",
        footer: (props) => props.column.id,
        accessorKey: "company",
        cell: (info) => info.getValue(),
      },
      {
        header: "status",
        footer: (props) => props.column.id,
        accessorKey: "status",
      },
      {
        header: "access",
        footer: (props) => props.column.id,
        accessorKey: "access",
        cell: (info) => info.getValue(),
      },
    ],
    []
  );

  const [data, setData] = React.useState<UserData[]>([]);
  React.useEffect(() => {
    if (fetchedData) {
      setData(fetchedData);
    }
  }, [fetchedData]);

  const table = useReactTable({
    data,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      columnFilters,
      globalFilter,
    },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    debugTable: true,
    debugHeaders: true,
    debugColumns: false,
  });

  React.useEffect(() => {
    if (table.getState().columnFilters[0]?.id === "fullName") {
      if (table.getState().sorting[0]?.id !== "fullName") {
        table.setSorting([{ id: "fullName", desc: false }]);
      }
    }
  }, [table.getState().columnFilters[0]?.id]);

  return (
    <div className="p-4">
      <div className="flex flex-row items-center gap-5">
        <div className="flex gap-3 items-center">
          {" "}
          <span>Show</span>
          <select
            className="bg-customPagination rounded-lg px-[9px] py-2"
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
          <span> entries</span>
        </div>

        <div>
          <DebounceSearchInput
            value={globalFilter ?? ""}
            onChange={(value) => setGlobalFilter(String(value))}
            className="border rounded-lg gap-8 bg-customBg "
            placeholder="Search..."
          />
        </div>
      </div>
      <div className="h-2" />
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup, i) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <th key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : (
                      <>
                        <div
                          {...{
                            className: header.column.getCanSort()
                              ? "cursor-pointer select-none flex flex-col  gap-3 p-"
                              : "",
                            onClick: header.column.getToggleSortingHandler(),
                          }}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: " 🔼",
                            desc: " 🔽",
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                      </>
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row, i) => {
            return (
              <tr
                key={row.id}
                className={`${
                  i % 2 === 0 ? "bg-customBg" : "bg-customBgAssent"
                }`}
              >
                {row.getVisibleCells().map((cell) => {
                  return (
                    <td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="h-2" />
      <div className="flex min-h-screen flex-col items-center justify-between p-4 ">
        <div className="flex items-center gap-3">
          <button
            className=" rounded p-1"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {"Previous"}
          </button>
          {Array.from({ length: table.getPageCount() }, (_, index) => (
            <button
              key={index}
              className={`w-[31px] h-[31px] rounded-lg px-[9px] py-2 gap-1 ${
                table.getState().pagination.pageIndex === index
                  ? "bg-customBtn"
                  : "bg-customPagination"
              }`}
              onClick={() => table.setPageIndex(index)}
            >
              {index + 1}
            </button>
          ))}

          <button
            className=" rounded p-1"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {"Next"}
          </button>
        </div>
      </div>
    </div>
  );
}