import { parseUrls } from "../../posts/utils/contentParsing";
import { useUrlPreview } from "../hooks/useUrlPreview";

interface UrlPreviewProps {
	content: string;
}

export const UrlPreview = ({ content }: UrlPreviewProps) => {
	const { previews, isLoading } = useUrlPreview(content);

	if (isLoading || Object.keys(previews).length === 0) {
		return null;
	}

	const urlMatches = parseUrls(content).filter((match) => match.isUrl);
	const hasMultiplePreviews = urlMatches.length > 1;

	return (
		<div className={`${hasMultiplePreviews ? "space-y-2" : "space-y-3"} mt-3`}>
			{urlMatches.slice(0, 3).map((match) => {
				const preview = previews[match.url];
				if (!preview) return null;

				if (hasMultiplePreviews) {
					// Thumbnail layout for multiple previews
					return (
						<a
							onClick={(e) => e.stopPropagation()}
							key={preview.url}
							href={match.url}
							target="_blank"
							rel="noopener noreferrer"
							className="flex gap-3 p-3 bg-background-secondary rounded-lg group hover:bg-background-secondary/80 transition-colors"
						>
							{preview.image_url && (
								<div className="flex-shrink-0 w-20 h-20 rounded-md overflow-hidden">
									<img
										src={preview.image_url}
										alt={preview.title || "Preview"}
										className="w-full h-full object-cover"
									/>
								</div>
							)}
							<div className="flex-1 min-w-0">
								{preview.title && (
									<h3 className="font-bold text-foreground text-sm line-clamp-2 group-hover:underline">
										{preview.title}
									</h3>
								)}
								{preview.description && (
									<p className="text-foreground/70 text-xs line-clamp-2 mt-1">
										{preview.description}
									</p>
								)}
								<p className="text-blue-400 text-xs truncate mt-2">
									{match.url}
								</p>
							</div>
						</a>
					);
				}

				// Large preview layout for single preview
				return (
					<a
						key={preview.url}
						href={match.url}
						target="_blank"
						rel="noopener noreferrer"
						className="block group relative overflow-hidden rounded-lg"
					>
						{preview.image_url ? (
							<>
								<div className="absolute inset-0">
									<img
										src={preview.image_url}
										alt={preview.title || "Preview"}
										className="w-full h-full object-cover"
									/>
									<div className="absolute inset-0 bg-gradient-to-t from-black/80 to-40% to-transparent" />
								</div>
								<div className="relative p-4 pt-32 min-h-[240px] flex flex-col justify-end">
									{preview.title && (
										<h3 className="font-bold text-white text-lg line-clamp-2 group-hover:underline">
											{preview.title}
										</h3>
									)}
									{preview.description && (
										<p className="text-white/90 text-sm line-clamp-3">
											{preview.description}
										</p>
									)}
									<p className="text-white/70 text-xs truncate">{match.url}</p>
								</div>
							</>
						) : (
							<div className="p-4 bg-background-secondary">
								{preview.title && (
									<h3 className="font-bold text-foreground text-lg mb-2 group-hover:underline">
										{preview.title}
									</h3>
								)}
								{preview.description && (
									<p className="text-foreground/70 text-sm mb-3">
										{preview.description}
									</p>
								)}
								<p className="text-blue-400 text-xs truncate">{match.url}</p>
							</div>
						)}
					</a>
				);
			})}
		</div>
	);
};
