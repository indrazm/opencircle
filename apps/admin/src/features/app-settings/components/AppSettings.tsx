import type { AppSettingsUpdate } from "@opencircle/core";
import { Button, Input } from "@opencircle/ui";
import { Save, Settings, Upload } from "lucide-react";
import { useEffect, useId, useState } from "react";
import toast from "react-hot-toast";
import { useAppSettings } from "../hooks/useAppSettings";
import type { AppSettingsFormData } from "../utils/types";

export function AppSettings() {
	const {
		appSettings,
		isAppSettingsLoading,
		updateAppSettings,
		isUpdatingAppSettings,
	} = useAppSettings();
	const [formData, setFormData] = useState<AppSettingsFormData>({
		app_name: "",
		app_logo_url: "",
		enable_sign_up: true,
	});

	// Generate unique IDs for form elements
	const appNameId = useId();
	const appLogoId = useId();
	const logoUploadId = useId();
	const enableSignUpId = useId();

	useEffect(() => {
		if (appSettings) {
			setFormData({
				app_name: appSettings.app_name,
				app_logo_url: appSettings.app_logo_url || "",
				enable_sign_up: appSettings.enable_sign_up,
			});
		}
	}, [appSettings]);

	const handleInputChange = (
		field: keyof AppSettingsFormData,
		value: string | boolean,
	) => {
		setFormData((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const handleSave = async () => {
		try {
			const updateData: AppSettingsUpdate = {
				app_name: formData.app_name,
				app_logo_url: formData.app_logo_url || undefined,
				enable_sign_up: formData.enable_sign_up,
			};

			updateAppSettings(updateData, {
				onSuccess: () => {
					toast.success("App settings updated successfully");
				},
				onError: () => {
					toast.error("Failed to update app settings");
				},
			});
		} catch {
			toast.error("Failed to update app settings");
		}
	};

	const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				const result = e.target?.result as string;
				handleInputChange("app_logo_url", result);
			};
			reader.readAsDataURL(file);
		}
	};

	if (isAppSettingsLoading) {
		return (
			<main className="p-6">
				<div className="flex items-center justify-center h-64">
					<div className="animate-pulse text-muted-foreground">
						Loading settings...
					</div>
				</div>
			</main>
		);
	}

	return (
		<main className="p-6 max-w-4xl">
			<div className="mb-6">
				<h1 className="text-2xl font-medium flex items-center gap-2">
					<Settings className="w-6 h-6" />
					App Settings
				</h1>
				<p className="text-muted-foreground mt-1">
					Manage your application settings and preferences
				</p>
			</div>

			<div className="border border-border rounded-lg shadow-sm">
				<div className="p-6 border-b border-border">
					<h2 className="text-lg font-semibold">General Settings</h2>
					<p className="text-sm text-gray-600 mt-1">
						Configure your application name, logo, and user registration
						settings
					</p>
				</div>
				<div className="p-6 space-y-6">
					<div className="space-y-2">
						<label htmlFor={appNameId} className="block text-sm font-medium">
							Application Name
						</label>
						<Input
							id={appNameId}
							value={formData.app_name}
							onChange={(e) => handleInputChange("app_name", e.target.value)}
							placeholder="Enter your application name"
						/>
					</div>

					<div className="space-y-2">
						<label htmlFor={appLogoId} className="block text-sm font-medium">
							Application Logo
						</label>
						<div className="flex gap-2">
							<Input
								id={appLogoId}
								value={formData.app_logo_url}
								onChange={(e) =>
									handleInputChange("app_logo_url", e.target.value)
								}
								placeholder="Enter logo URL or upload a file"
							/>
							<Button
								type="button"
								variant="secondary"
								size="md"
								onClick={() => document.getElementById(logoUploadId)?.click()}
							>
								<Upload className="h-4 w-4" />
							</Button>
						</div>
						<input
							id={logoUploadId}
							type="file"
							accept="image/*"
							onChange={handleLogoUpload}
							className="hidden"
						/>
						{formData.app_logo_url && (
							<div className="mt-2">
								<img
									src={formData.app_logo_url}
									alt="Logo preview"
									className="h-16 w-16 object-contain rounded border"
								/>
							</div>
						)}
					</div>

					<div className="flex items-center space-x-2">
						<input
							type="checkbox"
							id={enableSignUpId}
							checked={formData.enable_sign_up}
							onChange={(e) =>
								handleInputChange("enable_sign_up", e.target.checked)
							}
							className="rounded"
						/>
						<label htmlFor="enable_sign_up" className="text-sm font-medium">
							Enable user registration
						</label>
					</div>

					<div className="flex justify-end pt-4">
						<Button onClick={handleSave} disabled={isUpdatingAppSettings}>
							{isUpdatingAppSettings ? (
								<>
									<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
									Saving...
								</>
							) : (
								<>
									<Save className="w-4 h-4 mr-2" />
									Save Changes
								</>
							)}
						</Button>
					</div>
				</div>
			</div>
		</main>
	);
}
