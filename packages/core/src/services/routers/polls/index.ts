import { BaseRouter } from "../../baseRouter";
import type { Poll, PollCreate, PollResults, PollVote } from "../../types";

export class PollsRouter extends BaseRouter {
	async create(data: PollCreate): Promise<Poll> {
		return this.client.post<Poll>("polls/", data);
	}

	async getById(pollId: string): Promise<Poll> {
		return this.client.get<Poll>(`polls/${pollId}`);
	}

	async getByPostId(postId: string): Promise<Poll> {
		return this.client.get<Poll>(`posts/${postId}/poll`);
	}

	async vote(pollId: string, data: { option_id: string }): Promise<PollVote> {
		return this.client.post<PollVote>(`polls/${pollId}/vote`, {
			poll_id: pollId,
			...data,
		});
	}

	async changeVote(
		pollId: string,
		data: { option_id: string },
	): Promise<PollVote> {
		return this.client.put<PollVote>(`polls/${pollId}/vote`, {
			poll_id: pollId,
			...data,
		});
	}

	async getResults(pollId: string): Promise<PollResults> {
		return this.client.get<PollResults>(`polls/${pollId}/results`);
	}

	async delete(pollId: string): Promise<{ message: string }> {
		return this.client.delete<{ message: string }>(`polls/${pollId}`);
	}
}
