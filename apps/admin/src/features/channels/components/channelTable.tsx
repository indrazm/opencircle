import type { Channel } from "@opencircle/core";
import { Button } from "@opencircle/ui";
import {
	type ColumnDef,
	flexRender,
	getCoreRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { Edit, Trash2 } from "lucide-react";
import { useState } from "react";

interface ChannelTableProps {
	channels: Channel[];
	isLoading?: boolean;
}

export const ChannelTable = ({ channels, isLoading }: ChannelTableProps) => {
	const [rowSelection, setRowSelection] = useState({});

	const columns: ColumnDef<Channel>[] = [
		{
			id: "select",
			header: ({ table }) => (
				<input
					type="checkbox"
					checked={table.getIsAllPageRowsSelected()}
					onChange={(e) => table.toggleAllPageRowsSelected(!!e.target.checked)}
					aria-label="Select all"
					className="rounded border-gray-300"
				/>
			),
			cell: ({ row }) => (
				<input
					type="checkbox"
					checked={row.getIsSelected()}
					onChange={(e) => row.toggleSelected(!!e.target.checked)}
					aria-label="Select row"
					className="rounded border-gray-300"
				/>
			),
			enableSorting: false,
			enableHiding: false,
		},
		{
			accessorKey: "emoji",
			header: "Emoji",
			cell: ({ row }) => <div className="text-lg">{row.getValue("emoji")}</div>,
		},
		{
			accessorKey: "name",
			header: "Name",
			cell: ({ row }) => (
				<div className="font-medium">{row.getValue("name")}</div>
			),
		},
		{
			accessorKey: "slug",
			header: "Slug",
			cell: ({ row }) => <div className="text-sm">{row.getValue("slug")}</div>,
		},
		{
			accessorKey: "description",
			header: "Description",
			cell: ({ row }) => (
				<div className="text-sm">{row.getValue("description") || "-"}</div>
			),
		},
		{
			accessorKey: "type",
			header: "Type",
			cell: ({ row }) => (
				<div className="text-sm capitalize">{row.getValue("type")}</div>
			),
		},
		{
			accessorKey: "created_at",
			header: "Created",
			cell: ({ row }) => {
				const date = new Date(row.getValue("created_at"));
				return <div className="text-sm">{date.toLocaleDateString()}</div>;
			},
		},
		{
			id: "actions",
			header: "Actions",
			cell: ({ row }) => {
				const channel = row.original;
				return (
					<div className="flex items-center gap-2">
						<Button
							size="sm"
							onClick={() => {
								console.log("Edit channel:", channel);
							}}
						>
							<Edit size={14} />
							Edit
						</Button>
						<Button
							size="sm"
							variant="secondary"
							onClick={() => {
								console.log("Delete channel:", channel);
							}}
						>
							<Trash2 size={14} />
							Delete
						</Button>
					</div>
				);
			},
			enableSorting: false,
		},
	];

	const table = useReactTable({
		data: channels,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		onRowSelectionChange: setRowSelection,
		state: {
			rowSelection,
		},
	});

	if (isLoading) {
		return (
			<div className="rounded-lg border border-border bg-background shadow-sm">
				<div className="p-6">
					<div className="space-y-3">
						{[...Array(5)].map((_, i) => (
							<div
								key={`skeleton-channel-row-${i}`}
								className="animate-pulse border-border border-b pb-4 last:border-0"
							>
								<div className="flex items-center gap-4">
									<div className="flex-1 space-y-2">
										<div className="h-4 w-48 rounded bg-background-secondary"></div>
										<div className="h-3 w-32 rounded bg-background-secondary"></div>
									</div>
									<div className="h-6 w-20 rounded-full bg-background-secondary"></div>
									<div className="h-4 w-24 rounded bg-background-secondary"></div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="rounded-lg border border-border bg-background shadow-sm">
			<div className="overflow-x-auto">
				<table className="min-w-full divide-y divide-border">
					<thead className="bg-background-secondary/50">
						{table.getHeaderGroups().map((headerGroup) => (
							<tr key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<th
										key={header.id}
										className="px-6 py-3 text-left font-semibold text-foreground text-xs uppercase tracking-wider"
									>
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef.header,
													header.getContext(),
												)}
									</th>
								))}
							</tr>
						))}
					</thead>
					<tbody className="divide-y divide-border bg-background">
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<tr
									key={row.id}
									className="transition-colors hover:bg-background-secondary/50"
								>
									{row.getVisibleCells().map((cell) => (
										<td key={cell.id} className="px-6 py-4">
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext(),
											)}
										</td>
									))}
								</tr>
							))
						) : (
							<tr>
								<td
									colSpan={columns.length}
									className="px-6 py-12 text-center text-foreground/60 text-sm"
								>
									No channels found.
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
};
