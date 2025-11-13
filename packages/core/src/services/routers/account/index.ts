import { BaseRouter } from "../../../utils/baseRouter";
import type { User } from "../../types";

export class AccountRouter extends BaseRouter {
	async getAccount(): Promise<User> {
		return this.client.get<User>("account");
	}
}
