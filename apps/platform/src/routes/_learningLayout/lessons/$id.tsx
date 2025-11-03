import { createFileRoute, Link } from "@tanstack/react-router";
import MDEditor from "@uiw/react-md-editor";
import { ArrowLeft, Zap } from "lucide-react";
import { CourseSidebar } from "../../../features/courses/components/courseSidebar";
import { useCourse } from "../../../features/courses/hooks/useCourse";
import { useCheckEnrollment } from "../../../features/enrollment/hooks/useCheckEnrollment";
import { useLesson } from "../../../features/lessons/hooks/useLesson";

export const Route = createFileRoute("/_learningLayout/lessons/$id")({
	component: RouteComponent,
});

function RouteComponent() {
	const navigate = Route.useNavigate();
	const { id } = Route.useParams();
	const { lesson, isLoading: lessonLoading } = useLesson(id);
	const { isEnrolled, isLoading: enrollmentLoading } = useCheckEnrollment(
		lesson?.section?.course_id || "",
	);
	const { course, isLoading: courseLoading } = useCourse(
		lesson?.section?.course_id || "",
	);

	if (lessonLoading || courseLoading || enrollmentLoading) {
		return <div>Loading...</div>;
	}

	if (!lesson) {
		return <div>Lesson not found</div>;
	}

	if (!course) {
		return <div>Course not found</div>;
	}

	if (!isEnrolled) {
		return (
			<div className="p-4">
				<div className="mt-8 text-center">
					<h1 className="text-2xl font-bold text-foreground mb-4">
						Enrollment Required
					</h1>
					<p className="text-foreground/70 mb-6">
						You need to enroll in this course to access the lesson content.
					</p>
					<Link
						to="/courses/$id"
						params={{ id: course.id }}
						className="inline-block px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
					>
						Enroll in Course
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className="relative flex min-h-screen">
			{/* Sidebar */}
			<div className="sticky top-0 h-screen w-72 border-r border-border p-6 space-y-8">
				<div className="flex justify-between items-center">
					<section className="flex gap-2 items-center ml-2">
						<div className="w-6 h-6 bg-foreground text-background rounded-lg flex justify-center items-center">
							<Zap size={12} fill="currentColor" />
						</div>
						<h2 className="font-medium">Opencircle</h2>
					</section>
					<button
						type="button"
						onClick={() =>
							navigate({ to: "/courses/$id", params: { id: course.id } })
						}
						className="flex gap-2 items-center text-xs"
					>
						<ArrowLeft size={14} />
						<div>Back</div>
					</button>
				</div>
				<CourseSidebar courseId={course.id} currentLessonId={id} />
			</div>

			{/* Main Content */}
			<div className="flex-1 p-8">
				<main className="space-y-6 max-w-4xl m-auto">
					{/* Lesson Header */}
					<div className="space-y-4">
						<div className="flex items-center gap-3">
							<h1 className="text-2xl font-bold text-foreground">
								{lesson.order + 1}. {lesson.title}
							</h1>
							<span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm capitalize">
								{lesson.type}
							</span>
						</div>

						{lesson.section && (
							<div className="text-sm text-foreground/60">
								Section: {lesson.section.title}
							</div>
						)}
					</div>

					{/* Lesson Content */}
					<div className="space-y-6">
						{/* Video Content */}
						{lesson.type === "video" && lesson.video_url && (
							<div className="aspect-video bg-black rounded-lg overflow-hidden">
								<iframe
									src={lesson.video_url}
									className="w-full h-full"
									title={lesson.title}
								/>
							</div>
						)}

						{/* Text Content */}
						{lesson.content && (
							<div className="prose prose-invert prose-headings:font-medium max-w-none">
								<div className="prose prose-invert prose-headings:text-base prose-headings:text-foreground prose-headings:font-medium prose-p:text-sm prose-p:text-foreground/70 max-w-none">
									<MDEditor.Markdown
										source={lesson?.content}
										className="!bg-transparent !max-w-none"
									/>
								</div>
							</div>
						)}
					</div>
				</main>
			</div>
		</div>
	);
}
