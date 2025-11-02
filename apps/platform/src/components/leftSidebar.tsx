import { Link } from "@tanstack/react-router";
import { Bell, List, Paperclip, Video, Zap } from "lucide-react";
import { useAppSettings } from "../features/appSettings/hooks/useAppSettings";
import { ChannelList } from "../features/channels/components/ChannelList";
import { MenuItem } from "./menuItem";

export const LeftSidebar = () => {
	const { appSettings } = useAppSettings();

	return (
		<div className="sticky top-0 h-screen flex justify-between flex-col py-4 pr-4">
			<div className="space-y-4">
				<Link to="/" className="block">
					{appSettings?.app_logo_url ? (
						<img
							src={appSettings.app_logo_url}
							alt={appSettings.app_name}
							className="w-[60%] ml-2"
						/>
					) : (
						<section className="relative flex gap-2 items-center ml-2">
							<div className="w-6 h-6 bg-foreground text-background rounded-lg flex justify-center items-center">
								<Zap size={12} fill="currentColor" />
							</div>
							<h2 className="font-medium">Opencircle</h2>
							<div className="-ml-1 tracking-tight bg-foreground text-background rounded-lg px-1 py-0.5 text-[10px] font-medium">
								alpha
							</div>
						</section>
					)}
				</Link>
				<section className="font-medium">
					<MenuItem icon={<List size={16} />} label="Timeline" to="/" />
					<MenuItem
						icon={<Paperclip size={16} />}
						label="Articles"
						to="/articles"
					/>
					<MenuItem icon={<Video size={16} />} label="Courses" to="/courses" />
					<MenuItem
						icon={<Bell size={16} />}
						label="Notifications"
						to="/notifications"
					/>
				</section>
				<section className="p-2 space-y-3">
					<div className="text-sm space-y-2">
						<div>Channels</div>
						<div className="w-8 h-0.5 bg-foreground/20" />
					</div>
					<ChannelList />
				</section>
			</div>
			<div>
				<div className="bg-linear-210 rounded-lg border border-border tracking-tight p-4 text-xs font-medium from-primary to-transparent">
					Opensource Community Platform for Creators built by Devscalelabs
				</div>
			</div>
		</div>
	);
};
