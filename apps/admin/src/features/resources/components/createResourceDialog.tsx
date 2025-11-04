import type { ResourceCreate } from "@opencircle/core";
import {
	Button,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	Input,
} from "@opencircle/ui";
import { useId, useState } from "react";
import { useChannels } from "../../channels/hooks/useChannels";
import { useResourceCreation } from "../hooks/useResourceCreation";

interface CreateResourceDialogProps {
	children: React.ReactNode;
	userId: string;
}

export const CreateResourceDialog = ({
	children,
	userId,
}: CreateResourceDialogProps) => {
	const [open, setOpen] = useState(false);
	const [formData, setFormData] = useState({
		url: "",
		description: "",
		channel_id: "",
	});
	const { createResource, isSubmitting } = useResourceCreation();
	const { channels } = useChannels();

	const urlId = useId();
	const descriptionId = useId();
	const channelId = useId();

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!formData.channel_id) {
			alert("Please select a channel");
			return;
		}

		const resourceData: ResourceCreate = {
			url: formData.url,
			description: formData.description || undefined,
			user_id: userId,
			channel_id: formData.channel_id,
		};

		createResource(resourceData, {
			onSuccess: () => {
				setOpen(false);
				setFormData({
					url: "",
					description: "",
					channel_id: "",
				});
			},
		});
	};

	const handleInputChange =
		(field: string) =>
		(
			e: React.ChangeEvent<
				HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
			>,
		) => {
			setFormData((prev) => ({
				...prev,
				[field]: e.target.value,
			}));
		};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className="p-6">
				<DialogHeader>
					<DialogTitle>Add New Resource</DialogTitle>
					<DialogDescription>
						Add a new resource link to a channel.
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit}>
					<div className="grid gap-4 py-4">
						<div className="grid gap-2">
							<label htmlFor={channelId} className="font-medium text-sm">
								Channel
							</label>
							<select
								id={channelId}
								value={formData.channel_id}
								onChange={handleInputChange("channel_id")}
								className="block w-full rounded-md border border-border px-3 py-2 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary"
								required
							>
								<option value="">Select a channel</option>
								{channels.map((channel) => (
									<option key={channel.id} value={channel.id}>
										{channel.emoji} {channel.name}
									</option>
								))}
							</select>
						</div>
						<div className="grid gap-2">
							<label htmlFor={urlId} className="font-medium text-sm">
								Resource URL
							</label>
							<Input
								id={urlId}
								type="url"
								value={formData.url}
								onChange={handleInputChange("url")}
								placeholder="https://example.com/resource"
								required
							/>
						</div>
						<div className="grid gap-2">
							<label htmlFor={descriptionId} className="font-medium text-sm">
								Description (Optional)
							</label>
							<textarea
								id={descriptionId}
								value={formData.description}
								onChange={handleInputChange("description")}
								placeholder="Brief description of the resource"
								className="block min-h-20 w-full rounded-md border border-border px-3 py-2 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary"
							></textarea>
						</div>
					</div>
					<DialogFooter>
						<Button
							type="button"
							variant="secondary"
							onClick={() => setOpen(false)}
							disabled={isSubmitting}
						>
							Cancel
						</Button>
						<Button type="submit" disabled={isSubmitting}>
							{isSubmitting ? "Adding..." : "Add Resource"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};
