import { Button } from "@opencircle/ui";
import { createFileRoute, Link } from "@tanstack/react-router";
import { format } from "date-fns";
import {
	ArrowLeft,
	Calendar,
	Clock,
	Mail,
	Shield,
	User as UserIcon,
} from "lucide-react";
import { useUser } from "../../../features/user/hooks/useUser";

export const Route = createFileRoute("/_dashboardLayout/users/$id")({
	component: RouteComponent,
});

function RouteComponent() {
	const { id } = Route.useParams();
	const { user, isUserLoading } = useUser(id);

	if (isUserLoading) {
		return <div>Loading...</div>;
	}

	if (!user) {
		return <div>User not found</div>;
	}

	return (
		<div className="mx-auto max-w-4xl space-y-6">
			{/* Header Actions */}
			<div className="flex items-center justify-between">
				<Link to="/users">
					<Button size="sm">
						<ArrowLeft size={16} className="mr-2" />
						Back to Users
					</Button>
				</Link>
				<div className="flex gap-2">
					<Button variant="secondary">Ban User</Button>
				</div>
			</div>

			{/* User Header */}
			<div className="space-y-4">
				<div className="flex items-center gap-2">
					<span
						className={`rounded-full px-3 py-1 font-medium text-sm ${
							user.is_active
								? "bg-green-100 text-green-800"
								: "bg-red-100 text-red-800"
						}`}
					>
						{user.is_active ? "Active" : "Inactive"}
					</span>
					<span className="rounded-full bg-blue-100 px-3 py-1 font-medium text-blue-800 text-sm capitalize">
						{user.role}
					</span>
				</div>

				<h1 className="font-bold text-4xl">{user.name || user.username}</h1>

				{/* User Meta */}
				<div className="flex flex-wrap items-center gap-6 text-sm">
					<div className="flex items-center gap-2">
						<UserIcon size={16} />
						<span>@{user.username}</span>
					</div>
					<div className="flex items-center gap-2">
						<Mail size={16} />
						<span>{user.email}</span>
					</div>
					<div className="flex items-center gap-2">
						<Calendar size={16} />
						<span>
							Joined {format(new Date(user.created_at), "MMM dd, yyyy")}
						</span>
					</div>
					<div className="flex items-center gap-2">
						<Clock size={16} />
						<span>
							Updated {format(new Date(user.updated_at), "MMM dd, yyyy")}
						</span>
					</div>
				</div>
			</div>

			{/* User Details */}
			<div className="rounded-lg border border-border bg-background shadow-sm">
				<div className="border-border border-b px-6 py-4">
					<h2 className="font-semibold text-lg">User Information</h2>
				</div>
				<div className="space-y-4 p-6">
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
						<div>
							<label className="block font-medium text-foreground/60 text-sm">
								User ID
							</label>
							<p className="mt-1 text-sm">{user.id}</p>
						</div>
						<div>
							<label className="block font-medium text-foreground/60 text-sm">
								Username
							</label>
							<p className="mt-1 text-sm">@{user.username}</p>
						</div>
						<div>
							<label className="block font-medium text-foreground/60 text-sm">
								Full Name
							</label>
							<p className="mt-1 text-sm">{user.name || "Not provided"}</p>
						</div>
						<div>
							<label className="block font-medium text-foreground/60 text-sm">
								Email
							</label>
							<p className="mt-1 text-sm">{user.email}</p>
						</div>
						<div>
							<label className="block font-medium text-foreground/60 text-sm">
								Role
							</label>
							<p className="mt-1 flex items-center gap-2 text-sm capitalize">
								<Shield size={14} />
								{user.role}
							</p>
						</div>
						<div>
							<label className="block font-medium text-foreground/60 text-sm">
								Status
							</label>
							<p className="mt-1 text-sm">
								{user.is_active ? "Active" : "Inactive"}
							</p>
						</div>
					</div>

					{user.bio && (
						<div className="pt-4">
							<label className="block font-medium text-foreground/60 text-sm">
								Bio
							</label>
							<p className="mt-1 text-sm">{user.bio}</p>
						</div>
					)}
				</div>
			</div>

			{/* User Footer */}
			<div className="border-t pt-6">
				<div className="flex items-center justify-between">
					<div className="text-sm">
						Account created on {format(new Date(user.created_at), "PPP")}
					</div>
				</div>
			</div>
		</div>
	);
}
