import { useResources } from "../hooks/useResources";
import { ResourceCard } from "./resourceCard";

interface ResourcesListProps {
	channelId?: string;
}

export const ResourcesList = ({ channelId }: ResourcesListProps) => {
	const { resources, isResourcesLoading } = useResources(channelId);

	if (isResourcesLoading) {
		return <div className="p-4">Loading resources...</div>;
	}

	if (!resources || resources.length === 0) {
		return (
			<div className="p-8 text-center text-foreground/50">
				<p>No resources found</p>
			</div>
		);
	}

	return (
		<div className="space-y-4 p-4">
			{resources.map((resource) => (
				<ResourceCard key={resource.id} resource={resource} />
			))}
		</div>
	);
};
