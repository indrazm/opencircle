import { BaseRouter } from "../../baseRouter";
import type {
	ConfirmResetPasswordRequest,
	ConfirmResetPasswordResponse,
	GitHubAuthUrlResponse,
	GitHubLoginRequest,
	GitHubLoginResponse,
	LoginRequest,
	LoginResponse,
	RegisterRequest,
	RegisterResponse,
	ResetPasswordRequest,
	ResetPasswordResponse,
} from "../../types";

export class AuthRouter extends BaseRouter {
	async register(data: RegisterRequest): Promise<RegisterResponse> {
		return this.client.post<RegisterResponse>("register", data);
	}

	async login(data: LoginRequest): Promise<LoginResponse> {
		return this.client.post<LoginResponse>("login", data);
	}

	async githubLogin(): Promise<GitHubAuthUrlResponse> {
		return this.client.get<GitHubAuthUrlResponse>("github/login");
	}

	async githubCallback(data: GitHubLoginRequest): Promise<GitHubLoginResponse> {
		return this.client.post<GitHubLoginResponse>("github/callback", data);
	}

	async resetPassword(
		data: ResetPasswordRequest,
	): Promise<ResetPasswordResponse> {
		return this.client.post<ResetPasswordResponse>("reset-password", data);
	}

	async confirmResetPassword(
		data: ConfirmResetPasswordRequest,
	): Promise<ConfirmResetPasswordResponse> {
		return this.client.post<ConfirmResetPasswordResponse>(
			"confirm-reset-password",
			data,
		);
	}
}
