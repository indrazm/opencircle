import type { SectionCreate, SectionUpdate } from "@opencircle/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useCourse } from "../../../../../features/course/hooks/useCourse";
import { SectionEditor } from "../../../../../features/section/components/sectionEditor";
import { useSection } from "../../../../../features/section/hooks/useSection";
import { api } from "../../../../../utils/api";

export const Route = createFileRoute(
	"/_dashboardLayout/courses/sections/$sectionId/edit",
)({
	component: RouteComponent,
});

function RouteComponent() {
	const { sectionId } = Route.useParams();
	const router = useRouter();
	const queryClient = useQueryClient();
	const { section, isSectionLoading } = useSection(sectionId);
	const { course, isCourseLoading } = useCourse(section?.course_id || "");

	const updateSectionMutation = useMutation({
		mutationFn: async ({ id, data }: { id: string; data: SectionUpdate }) => {
			return await api.courses.updateSection(id, data);
		},
		onSuccess: () => {
			// Invalidate sections query to refresh the list
			if (section?.course_id) {
				queryClient.invalidateQueries({
					queryKey: ["sections", section.course_id],
				});
			}
			// Navigate back to the course edit page
			if (section?.course_id) {
				router.navigate({ to: `/courses/edit/${section.course_id}` });
			} else {
				router.navigate({ to: "/courses" });
			}
		},
	});

	const deleteSectionMutation = useMutation({
		mutationFn: async (id: string) => {
			return await api.courses.deleteSection(id);
		},
		onSuccess: () => {
			// Invalidate sections query to refresh the list
			if (section?.course_id) {
				queryClient.invalidateQueries({
					queryKey: ["sections", section.course_id],
				});
			}
			// Navigate back to the course edit page
			if (section?.course_id) {
				router.navigate({ to: `/courses/edit/${section.course_id}` });
			} else {
				router.navigate({ to: "/courses" });
			}
		},
	});

	const handleSave = async (data: SectionCreate | SectionUpdate) => {
		try {
			await updateSectionMutation.mutateAsync({
				id: sectionId,
				data: data as SectionUpdate,
			});
		} catch (error) {
			console.error("Failed to update section:", error);
		}
	};

	const handleDelete = async () => {
		if (
			window.confirm(
				"Are you sure you want to delete this section and all its lessons?",
			)
		) {
			try {
				await deleteSectionMutation.mutateAsync(sectionId);
			} catch (error) {
				console.error("Failed to delete section:", error);
			}
		}
	};

	const handleCancel = () => {
		if (section?.course_id) {
			router.navigate({ to: `/courses/edit/${section.course_id}` });
		} else {
			router.navigate({ to: "/courses" });
		}
	};

	if (isSectionLoading || isCourseLoading || !section) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<div className="text-muted-foreground">Loading...</div>
			</div>
		);
	}

	return (
		<div className="mx-auto max-w-7xl py-8">
			{/* Course Header */}
			{course && (
				<div className="mb-8 rounded-xl border border-border bg-card p-6 shadow-sm">
					<h1 className="mb-2 font-bold text-2xl">{course.title}</h1>
					{course.description && (
						<p className="text-muted-foreground text-sm leading-relaxed">
							{course.description}
						</p>
					)}
				</div>
			)}

			{/* Section Editor */}
			<SectionEditor
				section={section}
				courseId={section.course_id}
				onSave={handleSave}
				onCancel={handleCancel}
				onDelete={handleDelete}
				loading={updateSectionMutation.isPending}
				isEdit={true}
			/>
		</div>
	);
}
