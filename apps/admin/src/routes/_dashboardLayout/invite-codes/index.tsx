import { Button } from "@opencircle/ui";
import { createFileRoute, Link } from "@tanstack/react-router";
import { InviteCodeList } from "../../../features/inviteCode/components/InviteCodeList";
import { useInviteCodeSubmission } from "../../../features/inviteCode/hooks/useInviteCodeSubmission";
import { useInviteCodes } from "../../../features/inviteCode/hooks/useInviteCodes";

export const Route = createFileRoute("/_dashboardLayout/invite-codes/")({
	component: RouteComponent,
});

function RouteComponent() {
	const { inviteCodes, isInviteCodesLoading } = useInviteCodes();
	const { deleteInviteCode, deactivateInviteCode } = useInviteCodeSubmission();

	const handleDelete = async (id: string) => {
		if (window.confirm("Are you sure you want to delete this invite code?")) {
			try {
				await deleteInviteCode(id);
			} catch (error) {
				console.error("Failed to delete invite code:", error);
			}
		}
	};

	const handleDeactivate = async (id: string) => {
		if (
			window.confirm("Are you sure you want to deactivate this invite code?")
		) {
			try {
				await deactivateInviteCode(id);
			} catch (error) {
				console.error("Failed to deactivate invite code:", error);
			}
		}
	};

	return (
		<main>
			<div className="flex justify-between items-center mb-4">
				<h1 className="text-2xl font-medium">Invite Codes</h1>
				<Link to="/invite-codes/new">
					<Button size="sm">Create Invite Code</Button>
				</Link>
			</div>
			<InviteCodeList
				inviteCodes={inviteCodes || []}
				onDelete={handleDelete}
				onDeactivate={handleDeactivate}
				loading={isInviteCodesLoading}
			/>
		</main>
	);
}
