import type { User } from "../auth/types";

export interface PollOption {
	id: string;
	poll_id: string;
	text: string;
	order: number;
	vote_count: number;
	created_at: string;
	updated_at: string;
}

export interface PollOptionCreate {
	text: string;
	order?: number;
}

export interface PollVote {
	id: string;
	poll_id: string;
	option_id: string;
	user_id: string;
	created_at: string;
	updated_at: string;
	user?: User;
}

export interface PollVoteCreate {
	poll_id: string;
	option_id: string;
}

export interface Poll {
	id: string;
	post_id: string;
	duration_hours: number;
	is_active: boolean;
	total_votes: number;
	created_at: string;
	updated_at: string;
	options: PollOption[];
	user_vote?: PollVote;
}

export interface PollCreate {
	post_id: string;
	duration_hours?: number;
	options: PollOptionCreate[];
}

export interface PollResults {
	poll_id: string;
	total_votes: number;
	is_active: boolean;
	options: Array<{
		id: string;
		text: string;
		vote_count: number;
		percentage: number;
	}>;
}
