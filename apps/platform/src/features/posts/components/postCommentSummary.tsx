import { formatCommentSummary } from "../utils/nameFormatting";

interface PostCommentSummaryProps {
	names: string[];
}

export const PostCommentSummary = ({ names }: PostCommentSummaryProps) => {
	const summary = formatCommentSummary(names);

	if (!summary) return null;

	return <div className="text-sm text-foreground/50">{summary}</div>;
};
