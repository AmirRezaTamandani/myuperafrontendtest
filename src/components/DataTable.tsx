"use client";
import { BiSortAlt2 } from "react-icons/bi";
import React from "react";
import {
  useReactTable,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getPaginationRowModel,
  getSortedRowModel,
  FilterFn,
  ColumnDef,
  flexRender,
} from "@tanstack/react-table";
import {
  RankingInfo,
  rankItem,
  compareItems,
} from "@tanstack/match-sorter-utils";

import useFetchData from "@/hooks/useFetchData";
import DebounceSearchInput from "./DebounceSearchInput";
import {
  EditIcon,
  SearchIcon,
  SortAltIcon,
  TrashIcon,
} from "@/utils/IconMaker";
import { UserData } from "@/types/Index";

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
        header: "Code",
        footer: (props) => props.column.id,
        accessorKey: "code",
        cell: (info) => info.getValue(),
      },
      {
        header: "Company",
        footer: (props) => props.column.id,
        accessorKey: "company",
        cell: (info) => info.getValue(),
      },
      {
        header: "Status",
        footer: (props) => props.column.id,
        accessorKey: "status",
      },
      {
        header: "Action",
        footer: (props) => props.column.id,
        cell: (info) => (
          <div className="flex cursor-pointer gap-4">
            <TrashIcon />
            <EditIcon />
          </div>
        ),
      },
      // not sure what to do with this!
      // {
      //   header: "access",
      //   footer: (props) => props.column.id,
      //   accessorKey: "access",
      //   cell: (info) => info.getValue(),
      // },
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
      globalFilter,
    },

    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
  });

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
            placeholder="Search..."
          />
        </div>
      </div>
      <div className="h-2" />
      <table className="w-full text-center">
        <thead className="">
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
                              ? "cursor-pointer select-none "
                              : "",
                            onClick: header.column.getToggleSortingHandler(),
                          }}
                        >
                          <div className="flex justify-center items-center ">
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            <SortAltIcon />
                          </div>
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
            const status = row.original.status;
            return (
              <tr
                key={row.id}
                className={`${
                  i % 2 === 0 ? "bg-customBg" : "bg-customBgAssent"
                } w-[1110px] h-[64px] p-4 gap-4`}
              >
                {row.getVisibleCells().map((cell) => {
                  const columnName = cell.column.id;
                  return (
                    <td key={cell.id} className="p-4">
                      {columnName === "status" ? (
                        <>
                          {status ? (
                            <span className="w-[83px] h-[31px] px-2 py-3 gap-3 bg-deliveredBtn text-deliveredBtnText rounded-3xl">
                              delivered
                            </span>
                          ) : (
                            <span className="w-[83px] h-[31px] px-2 py-3 gap-3 bg-cancelledBtn text-cancelledBtnText rounded-3xl">
                              cancelled
                            </span>
                          )}
                        </>
                      ) : (
                        flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="flex min-h-screen flex-col items-center justify-between ">
        <div className="flex items-center gap-3 mt-4">
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
