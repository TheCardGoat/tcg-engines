<script lang="ts">
	import type { AuthUser } from "@tcg/shared/auth";
	import {
		DropdownMenu,
		DropdownMenuContent,
		DropdownMenuItem,
		DropdownMenuLabel,
		DropdownMenuPortal,
		DropdownMenuSeparator,
		DropdownMenuTrigger,
	} from "$lib/design-system/primitives/dropdown-menu";
	import { Button } from "$lib/design-system/primitives/button";
	import { m } from "$lib/i18n/messages.js";
	import { authSession } from "$lib/auth/session.svelte.js";
	import LogOut from "@lucide/svelte/icons/log-out";
	import Settings from "@lucide/svelte/icons/settings";
	import UserCog from "@lucide/svelte/icons/user-cog";
	import Star from "@lucide/svelte/icons/star";
	import Gem from "@lucide/svelte/icons/gem";
	import Sparkles from "@lucide/svelte/icons/sparkles";
	import ShieldCheck from "@lucide/svelte/icons/shield-check";
	import { resolvePatronTierConfig } from "@/features/simulator/model/player-tier.js";

	let {
		user,
		onSignedOut,
		onOpenSettings,
		onOpenAccountSettings,
		signOutInMenu = true,
		settingsInMenu = false,
		triggerClass = "",
	}: {
		user: AuthUser;
		onSignedOut?: () => void | Promise<void>;
		onOpenSettings?: () => void;
		onOpenAccountSettings?: () => void;
		signOutInMenu?: boolean;
		settingsInMenu?: boolean;
		triggerClass?: string;
	} = $props();

	const displayName = $derived(user.displayUsername ?? user.name ?? "Player");

	const patronConfig = $derived(resolvePatronTierConfig(user.subscriptionTier));

	async function handleSignOut() {
		await authSession.signOut();
		await onSignedOut?.();
	}
</script>

<DropdownMenu>
	<DropdownMenuTrigger>
		{#snippet child({ props })}
			<Button
				variant="ghost"
				size="sm"
				class="flex h-11 min-h-11 min-w-0 max-w-[15rem] shrink-0 items-center justify-start gap-2.5 rounded-none border-0 bg-transparent px-2 py-0 text-left text-sm font-semibold text-slate-100 shadow-none hover:bg-white/10 hover:text-white sm:max-w-[18rem] {triggerClass}"
				{...props}
			>
				<span class="min-w-0 flex-1 pe-1 flex items-center gap-1.5">
					<span class="truncate text-sm font-semibold">{displayName}</span>
					{#if patronConfig}
						<span
							class="profile-patron-badge shrink-0"
							style:--patron-color={patronConfig.color}
							style:--patron-glow={patronConfig.glow}
							style:--patron-border={patronConfig.borderColor}
							title={patronConfig.name()}
						>
							{#if patronConfig.icon === "sparkles"}
								<Sparkles class="size-[9px]" />
							{:else if patronConfig.icon === "gem"}
								<Gem class="size-[9px]" />
							{:else if patronConfig.icon === "shield"}
								<ShieldCheck class="size-[9px]" />
							{:else}
								<Star class="size-[9px]" />
							{/if}
						</span>
					{/if}
				</span>
			</Button>
		{/snippet}
	</DropdownMenuTrigger>
	<DropdownMenuPortal>
		<DropdownMenuContent align="end" class="w-56">
			<DropdownMenuLabel class="font-normal">
				<div class="flex flex-col space-y-1">
					<p class="flex items-center gap-1.5 text-sm font-medium leading-none">
						{displayName}
						{#if patronConfig}
							<span
								class="profile-patron-badge"
								style:--patron-color={patronConfig.color}
								style:--patron-glow={patronConfig.glow}
								style:--patron-border={patronConfig.borderColor}
								title={patronConfig.name()}
							>
								{#if patronConfig.icon === "sparkles"}
									<Sparkles class="size-[9px]" />
								{:else if patronConfig.icon === "gem"}
									<Gem class="size-[9px]" />
								{:else if patronConfig.icon === "shield"}
									<ShieldCheck class="size-[9px]" />
								{:else}
									<Star class="size-[9px]" />
								{/if}
							</span>
						{/if}
					</p>
					<p class="text-muted-foreground text-xs leading-none">{user.email}</p>
				</div>
			</DropdownMenuLabel>
			{#if settingsInMenu}
				<DropdownMenuSeparator />
				<DropdownMenuItem onclick={onOpenSettings}>
					<Settings class="mr-2 size-4" />
					{m["sim.settings.title"]({})}
				</DropdownMenuItem>
				<DropdownMenuItem onclick={onOpenAccountSettings}>
					<UserCog class="mr-2 size-4" />
					{m["sim.accountSettings.title"]({})}
				</DropdownMenuItem>
			{/if}
			{#if signOutInMenu}
				<DropdownMenuSeparator />
				<DropdownMenuItem onclick={handleSignOut}>
					<LogOut class="mr-2 size-4" />
					{m["sim.auth.signOut"]({})}
				</DropdownMenuItem>
			{/if}
		</DropdownMenuContent>
	</DropdownMenuPortal>
</DropdownMenu>

<style>
  .profile-patron-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1rem;
    height: 1rem;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.35);
    border: 1px solid var(--patron-border);
    color: var(--patron-color);
    box-shadow:
      0 0 4px var(--patron-glow),
      0 0 8px var(--patron-glow);
    cursor: default;
  }
</style>
