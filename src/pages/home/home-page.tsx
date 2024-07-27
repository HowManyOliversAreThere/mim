import { LoadingSpinner } from "@/components/ui/loading";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { H1, Lead } from "@/components/ui/typography";
import { Manifest, Package } from "@/lib/manifest";
import { useReactTable, getCoreRowModel, flexRender, ColumnDef } from "@tanstack/react-table";
import { useState, useEffect } from "react";
  
  const columns: ColumnDef<Package>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "author",
      header: "Author",
      cell: ({ row }) => <div>{row.getValue("author") || "-"}</div>,
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

export function HomePage() {
    const [manifest, setManifest] = useState<Manifest | null>(null);
  
    // Retrieve mip package manifest from https://micropython.org/pi/v2/index.json
    useEffect(() => {
      fetch("https://micropython.org/pi/v2/index.json")
        .then((res) => res.json())
        .then(setManifest);
    }, []);
    const table = useReactTable({
      data: manifest?.packages ?? [],
      columns,
      getCoreRowModel: getCoreRowModel(),
    });
  
    return (
      <div className="">
        <H1>
          <code>
            <a
              href="https://docs.micropython.org/en/latest/reference/packages.html"
              className="underline text-blue-400"
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
          {manifest === null ? (
            <div className="m-auto">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="rounded-md border">
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
          )}
        </div>
      </div>
    );
  }