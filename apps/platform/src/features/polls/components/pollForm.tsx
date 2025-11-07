import { Button, Input } from "@opencircle/ui";
import { Clock, Plus, X } from "lucide-react";
import { useId, useState } from "react";

interface PollOptionInput {
	id: string;
	text: string;
}

interface PollFormProps {
	onSubmit?: (data: {
		content: string;
		options: { text: string; order?: number }[];
		durationHours: number;
	}) => void;
	onClose?: () => void;
	isSubmitting?: boolean;
}

export const PollForm = ({
	onSubmit,
	onClose,
	isSubmitting = false,
}: PollFormProps) => {
	const questionId = useId();
	const durationId = useId();
	const [question, setQuestion] = useState("");
	const [options, setOptions] = useState<PollOptionInput[]>([
		{ id: "1", text: "" },
		{ id: "2", text: "" },
	]);
	const [durationHours, setDurationHours] = useState(24);

	const addOption = () => {
		if (options.length < 4) {
			const newId = Date.now().toString();
			setOptions([...options, { id: newId, text: "" }]);
		}
	};

	const removeOption = (id: string) => {
		if (options.length > 2) {
			setOptions(options.filter((opt) => opt.id !== id));
		}
	};

	const updateOption = (id: string, text: string) => {
		setOptions(options.map((opt) => (opt.id === id ? { ...opt, text } : opt)));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		const validOptions = options.filter((opt) => opt.text.trim());

		if (question.trim() && validOptions.length >= 2 && onSubmit) {
			onSubmit({
				content: question,
				options: validOptions.map((opt, index) => ({
					text: opt.text,
					order: index,
				})),
				durationHours,
			});
		}
	};

	const canSubmit =
		question.trim() && options.filter((opt) => opt.text.trim()).length >= 2;

	return (
		<form onSubmit={handleSubmit} className="space-y-4 p-4">
			<div className="space-y-2">
				<label
					htmlFor={questionId}
					className="font-medium text-foreground text-sm"
				>
					Poll Question
				</label>
				<Input
					id={questionId}
					value={question}
					onChange={(e) => setQuestion(e.target.value)}
					placeholder="Ask a question..."
					disabled={isSubmitting}
				/>
			</div>

			<div className="space-y-2">
				<div className="flex items-center justify-between">
					<div className="font-medium text-foreground text-sm">
						Options ({options.length}/4)
					</div>
					{options.length < 4 && (
						<Plus
							size={16}
							className="cursor-pointer text-primary hover:text-primary/80"
							onClick={addOption}
						/>
					)}
				</div>

				<div className="space-y-2">
					{options.map((option, index) => (
						<div key={option.id} className="flex items-center gap-2">
							<span className="w-4 text-muted-foreground text-sm">
								{index + 1}.
							</span>
							<Input
								value={option.text}
								onChange={(e) => updateOption(option.id, e.target.value)}
								placeholder={`Option ${index + 1}`}
								disabled={isSubmitting}
								className="flex-1"
							/>
							{options.length > 2 && (
								<X
									size={16}
									className="cursor-pointer text-destructive hover:text-destructive/80"
									onClick={() => removeOption(option.id)}
								/>
							)}
						</div>
					))}
				</div>
			</div>

			<div className="space-y-2">
				<label
					htmlFor={durationId}
					className="flex items-center gap-2 font-medium text-foreground text-sm"
				>
					<Clock size={16} />
					Duration
				</label>
				<select
					id={durationId}
					value={durationHours}
					onChange={(e) => setDurationHours(Number(e.target.value))}
					className="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
					disabled={isSubmitting}
				>
					<option value={1}>1 hour</option>
					<option value={6}>6 hours</option>
					<option value={24}>24 hours</option>
					<option value={48}>2 days</option>
					<option value={168}>7 days</option>
				</select>
			</div>

			<div className="flex justify-end gap-2 pt-2">
				{onClose && (
					<Button type="button" onClick={onClose} disabled={isSubmitting}>
						Cancel
					</Button>
				)}
				<Button type="submit" disabled={!canSubmit || isSubmitting}>
					{isSubmitting ? "Creating Poll..." : "Create Poll"}
				</Button>
			</div>
		</form>
	);
};
