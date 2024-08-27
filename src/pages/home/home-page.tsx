import { DataContext } from "@/components/compositions/data-retrieval";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/loading";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { H1, Lead } from "@/components/ui/typography";
import { Package } from "@/lib/manifest";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

export function HomePage() {
  const dataContext = useContext(DataContext);
  const navigate = useNavigate();

  const columns: ColumnDef<Package>[] = [
    {
      id: "name",
      accessorKey: "name",
      header: "Name",
      enableColumnFilter: true,
      filterFn: "includesString",
    },
    {
      accessorKey: "author",
      header: "Author",
      cell: ({ row }) => <div>{row.getValue("author") || "-"}</div>,
    },
    {
      accessorKey: "tags",
      header: "Tags",
      cell: ({ row }) => (
        <div className="flex flex-row gap-2">
          {(row.getValue("tags") as string[]).map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>
      ),
    },
    {
      accessorKey: "license",
      header: "License",
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => <div>{row.getValue("description") || "-"}</div>,
    },
  ];

  const table = useReactTable({
    data: dataContext.data?.packages ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    enableColumnFilters: true,
    enableFilters: true,
  });

  const handleNavigate = (pkg: Package) => {
    navigate(`/packages/${pkg.name}`);
  };

  return (
    <div className="flex flex-col gap-1">
      <H1>
        <code>
          <a
            href="https://docs.micropython.org/en/latest/reference/packages.html"
            className="underline text-blue-400"
            target="_blank"
            rel="noopener noreferrer"
          >
            mip
          </a>
        </code>{" "}
        package list
      </H1>
      <Lead>
        why write it when you can <code>mip</code> it?
      </Lead>
      <div className="w-full flex-grow">
        {dataContext.data === null ? (
          <div className="w-full flex justify-center items-center h-72">
            <LoadingSpinner />
          </div>
        ) : (
          <>
            <div className="flex flex-row">
              <Input
                type="search"
                placeholder="🔎 Search"
                onChange={(e) =>
                  table.getColumn("name")?.setFilterValue(() => e.target.value)
                }
                className="w-96"
              />
            </div>
            <div className="rounded-md border mt-4">
              <Table>
                <TableHeader className="bg-slate-100">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                        onClick={() => handleNavigate(row.original as Package)}
                        className="cursor-pointer"
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                        No results.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
