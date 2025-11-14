import type { LessonCreate, LessonUpdate } from "@opencircle/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useCourse } from "../../../../../features/course/hooks/useCourse";
import { LessonEditor } from "../../../../../features/lesson/components/lessonEditor";
import { useLesson } from "../../../../../features/lesson/hooks/useLesson";
import { useSection } from "../../../../../features/section/hooks/useSection";
import { api } from "../../../../../utils/api";

export const Route = createFileRoute(
	"/_dashboardLayout/courses/lessons/$lessonId/edit",
)({
	component: RouteComponent,
});

function RouteComponent() {
	const { lessonId } = Route.useParams();
	const router = useRouter();
	const queryClient = useQueryClient();
	const { lesson, isLessonLoading } = useLesson(lessonId);
	const { section, isSectionLoading } = useSection(lesson?.section_id || "");
	const { course, isCourseLoading } = useCourse(section?.course_id || "");

	const updateLessonMutation = useMutation({
		mutationFn: async ({ id, data }: { id: string; data: LessonUpdate }) => {
			return await api.courses.updateLesson(id, data);
		},
		onSuccess: () => {
			// Invalidate lessons query to refresh the list
			if (lesson?.section_id) {
				queryClient.invalidateQueries({
					queryKey: ["lessons", lesson.section_id],
				});
			}
			// Navigate back to the section edit page
			if (lesson?.section_id) {
				router.navigate({
					to: `/courses/sections/${lesson.section_id}/edit`,
				});
			} else {
				router.navigate({ to: "/courses" });
			}
		},
	});

	const handleSave = async (data: LessonCreate | LessonUpdate) => {
		try {
			await updateLessonMutation.mutateAsync({
				id: lessonId,
				data: data as LessonUpdate,
			});
		} catch (error) {
			console.error("Failed to update lesson:", error);
		}
	};

	const handleCancel = () => {
		if (lesson?.section_id) {
			router.navigate({ to: `/courses/sections/${lesson.section_id}/edit` });
		} else {
			router.navigate({ to: "/courses" });
		}
	};

	if (isLessonLoading || isSectionLoading || isCourseLoading || !lesson) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<div className="text-muted-foreground">Loading...</div>
			</div>
		);
	}

	return (
		<div className="mx-auto max-w-7xl py-8">
			{/* Course & Section Header */}
			{course && section && (
				<div className="mb-8 space-y-4">
					{/* Course Info */}
					<div className="rounded-xl border border-border bg-card p-6 shadow-sm">
						<h1 className="mb-2 font-bold text-2xl">{course.title}</h1>
						{course.description && (
							<p className="text-muted-foreground text-sm leading-relaxed">
								{course.description}
							</p>
						)}
					</div>

					{/* Section Info */}
					<div className="rounded-xl border border-border bg-card p-4 shadow-sm">
						<div className="flex items-center gap-2">
							<span className="font-medium text-muted-foreground text-sm">
								Section:
							</span>
							<h2 className="font-semibold text-lg">{section.title}</h2>
						</div>
						{section.description && (
							<p className="mt-1 text-muted-foreground text-sm">
								{section.description}
							</p>
						)}
					</div>
				</div>
			)}

			{/* Lesson Editor */}
			<div className="rounded-xl border border-border bg-card p-6 shadow-sm">
				<LessonEditor
					lesson={lesson}
					onSave={handleSave}
					onCancel={handleCancel}
					loading={updateLessonMutation.isPending}
					isEdit={true}
				/>
			</div>
		</div>
	);
}
