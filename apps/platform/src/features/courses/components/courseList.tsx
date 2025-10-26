import { Avatar } from "@opencircle/ui";
import { Link, useNavigate } from "@tanstack/react-router";
import { getInitials } from "../../../utils/common";
import { useCourses } from "../hooks/useCourses";

export const CourseList = () => {
	const navigate = useNavigate();
	const { courses } = useCourses();

	return (
		<div>
			{courses.map((course) => {
				const initials = getInitials(course.instructor.name);

				return (
					<main
						key={course.id}
						className="p-4 border-b border-border space-y-4"
					>
						<div
							onClick={() => navigate({ to: `/courses/${course.id}` })}
							className="cursor-pointer"
						>
							<div className="space-y-2">
								{course.thumbnail_url && (
									<img
										src={course.thumbnail_url}
										alt={course.title}
										className="w-full h-48 object-cover rounded-lg"
									/>
								)}
								<h3 className="text-lg font-medium text-foreground">
									{course.title}
								</h3>
								{course.description && (
									<p className="text-sm text-foreground/70 line-clamp-2">
										{course.description}
									</p>
								)}
								<div className="flex items-center gap-4 text-xs text-foreground/50">
									<span className="capitalize">Status: {course.status}</span>
									{course.price !== undefined && (
										<span>
											{course.price === 0 ? "Free" : `$${course.price}`}
										</span>
									)}
									<span>{course.sections.length} sections</span>
								</div>
							</div>
						</div>
						<section className="flex gap-2 items-center mt-4">
							<Avatar
								initials={initials}
								image_url={course.instructor.avatar_url || ""}
							/>
							<Link
								to="/$username"
								params={{ username: course.instructor.username }}
								className="group"
							>
								<div className="space-y-0.5">
									<div className="group-hover:underline">
										{course.instructor.name || course.instructor.email}
									</div>
									<p className="text-foreground/50 text-xs">Instructor</p>
								</div>
							</Link>
						</section>
					</main>
				);
			})}
		</div>
	);
};
