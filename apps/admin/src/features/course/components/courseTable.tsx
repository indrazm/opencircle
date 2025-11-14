import type { Course } from "@opencircle/core";
import {
	Button,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@opencircle/ui";
import { useRouter } from "@tanstack/react-router";
import {
	type ColumnDef,
	flexRender,
	getCoreRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { Edit, Trash } from "lucide-react";
import { useState } from "react";
import { useCourseDelete } from "../hooks/useCourseDelete";

interface CourseTableProps {
	courses: Course[];
	isLoading?: boolean;
}

export const CourseTable = ({ courses, isLoading }: CourseTableProps) => {
	const [rowSelection, setRowSelection] = useState({});
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);
	const router = useRouter();

	const handleDeleteClick = (course: Course) => {
		setCourseToDelete(course);
		setDeleteDialogOpen(true);
	};

	const { deleteCourse, isDeleting } = useCourseDelete();

	const handleDeleteConfirm = () => {
		if (courseToDelete) {
			deleteCourse(courseToDelete.id, {
				onSuccess: () => {
					setDeleteDialogOpen(false);
					setCourseToDelete(null);
				},
				onError: (error) => {
					console.error("Failed to delete course:", error);
					// Keep dialog open on error so user can try again
				},
			});
		}
	};

	const handleDeleteCancel = () => {
		setDeleteDialogOpen(false);
		setCourseToDelete(null);
	};

	const columns: ColumnDef<Course>[] = [
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
			accessorKey: "title",
			header: "Title",
			cell: ({ row }) => (
				<div className="font-medium">{row.getValue("title")}</div>
			),
		},
		{
			accessorKey: "instructor",
			header: "Instructor",
			cell: ({ row }) => {
				const instructor = row.getValue("instructor") as Course["instructor"];
				return (
					<div className="text-sm">
						{instructor?.name || instructor?.username || "-"}
					</div>
				);
			},
		},
		{
			accessorKey: "status",
			header: "Status",
			cell: ({ row }) => (
				<div className="text-sm capitalize">
					<span
						className={`inline-flex items-center rounded-full px-2.5 py-0.5 font-medium text-xs ${
							row.getValue("status") === "published"
								? "bg-green-100 text-green-800"
								: row.getValue("status") === "draft"
									? "bg-yellow-100 text-yellow-800"
									: "bg-gray-100 text-gray-800"
						}`}
					>
						{row.getValue("status")}
					</span>
				</div>
			),
		},
		{
			accessorKey: "price",
			header: "Price",
			cell: ({ row }) => {
				const price = row.getValue("price") as number;
				return (
					<div className="text-sm">
						{price !== null && price !== undefined ? `$${price}` : "Free"}
					</div>
				);
			},
		},
		{
			accessorKey: "sections",
			header: "Sections",
			cell: ({ row }) => {
				const sections = row.getValue("sections") as Course["sections"];
				return (
					<div className="text-center text-sm">{sections?.length || 0}</div>
				);
			},
		},
		{
			accessorKey: "enrollments",
			header: "Enrollments",
			cell: ({ row }) => {
				const enrollments = row.getValue(
					"enrollments",
				) as Course["enrollments"];
				return (
					<div className="text-center text-sm">{enrollments?.length || 0}</div>
				);
			},
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
			cell: ({ row }) => (
				<div className="flex items-center gap-2">
					<Button
						size="sm"
						onClick={() => {
							router.navigate({ to: `/courses/edit/${row.original.id}` });
						}}
					>
						<Edit size={14} />
						Edit
					</Button>
					<Button
						size="sm"
						variant="secondary"
						onClick={() => handleDeleteClick(row.original)}
					>
						<Trash size={14} />
						Delete
					</Button>
				</div>
			),
			enableSorting: false,
		},
	];

	const table = useReactTable({
		data: courses,
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
								key={`skeleton-course-row-${i}`}
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
		<>
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
										No courses found.
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>
			<Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Delete Course</DialogTitle>
						<DialogDescription>
							Are you sure you want to delete "{courseToDelete?.title}"? This
							action cannot be undone.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button variant="secondary" onClick={handleDeleteCancel}>
							Cancel
						</Button>
						<Button
							onClick={handleDeleteConfirm}
							disabled={isDeleting}
							variant="primary"
						>
							{isDeleting ? "Deleting..." : "Delete"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
};
