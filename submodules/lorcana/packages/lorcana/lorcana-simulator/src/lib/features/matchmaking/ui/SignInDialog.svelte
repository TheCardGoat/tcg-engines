<script lang="ts">
	import * as Dialog from "$lib/design-system/primitives/dialog";
	import { Button } from "$lib/design-system/primitives/button";
	import { m } from "$lib/i18n/messages.js";
	import { authSession, DEV_AGENT_AUTH_DEFAULTS } from "$lib/auth/session.svelte.js";

	let { open = $bindable(false) }: { open: boolean } = $props();
	let joinDiscordServer = $state(true);
	let discordError = $state<string | null>(null);
	let metafyError = $state<string | null>(null);
	let emailAuthError = $state<string | null>(null);
	let emailAuthMode = $state<"sign-in" | "sign-up">("sign-in");
	let email = $state(DEV_AGENT_AUTH_DEFAULTS.email);
	let password = $state(DEV_AGENT_AUTH_DEFAULTS.password);
	let displayName = $state(DEV_AGENT_AUTH_DEFAULTS.name);
	let emailAuthLoading = $state(false);
	const showMetafySignIn = import.meta.env.DEV;
	const showDevEmailPasswordSignIn = import.meta.env.DEV;

	async function handleDiscordSignIn() {
		discordError = null;
		metafyError = null;
		emailAuthError = null;
		try {
			await authSession.signInWithDiscord({ joinGuild: joinDiscordServer });
		} catch (error) {
			console.error("Discord sign-in failed:", error);
			discordError = m["sim.auth.signIn.discordError"]({});
		}
	}

	async function handleMetafySignIn() {
		discordError = null;
		metafyError = null;
		emailAuthError = null;
		try {
			await authSession.signInWithMetafy();
		} catch (error) {
			console.error("Metafy sign-in failed:", error);
			metafyError =
				error instanceof Error ? error.message : "Metafy sign-in failed.";
		}
	}

	async function handleEmailAuth() {
		discordError = null;
		metafyError = null;
		emailAuthError = null;
		emailAuthLoading = true;
		try {
			const input = { email, password, name: displayName };
			if (emailAuthMode === "sign-up") {
				await authSession.signUpWithEmail(input);
			} else {
				await authSession.signInOrCreateDefaultDevAgent(input);
			}
			open = false;
		} catch (error) {
			console.error("Email auth failed:", error);
			emailAuthError = error instanceof Error ? error.message : "Email auth failed.";
		} finally {
			emailAuthLoading = false;
		}
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Portal>
		<Dialog.Overlay />
		<Dialog.Content class="sm:max-w-md">
			<Dialog.Header class="text-center sm:text-center">
				<Dialog.Title class="text-2xl">
					{m["sim.auth.signIn.title"]({})}
				</Dialog.Title>
				<Dialog.Description>
					{m["sim.auth.signIn.description"]({})}
				</Dialog.Description>
			</Dialog.Header>

			<div class="space-y-4 px-1">
				<Button
					class="h-12 w-full gap-3 text-base font-medium bg-[#5865F2] text-white hover:bg-[#4752C4]"
					onclick={handleDiscordSignIn}
				>
					<svg
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="currentColor"
						aria-hidden="true"
					>
						<path
							d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"
						/>
					</svg>
					{m["sim.auth.signIn.discord"]({})}
				</Button>
				{#if discordError}
					<p
						class="rounded-md bg-destructive/10 px-3 py-2 text-center text-xs text-destructive"
						role="alert"
						aria-live="assertive"
					>
						{discordError}
					</p>
				{/if}

				{#if showMetafySignIn}
				<Button
					variant="outline"
					class="h-12 w-full gap-3 text-base font-medium"
					onclick={handleMetafySignIn}
				>
					<svg
						width="24"
						height="18"
						viewBox="0 0 278 212"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						aria-hidden="true"
					>
						<g clip-path="url(#metafy-logo-clip)">
							<path
								d="M238.266 173.097C238.249 173.257 238.198 173.411 238.116 173.549C238.035 173.687 237.924 173.806 237.792 173.898C237.66 173.989 237.511 174.051 237.353 174.08C237.195 174.108 237.032 174.103 236.877 174.063C214.85 168.081 179.064 164.184 138.602 164.184C98.1399 164.184 62.3542 168.065 40.3271 174.063C40.1716 174.103 40.0092 174.108 39.8512 174.08C39.6932 174.051 39.5433 173.989 39.4115 173.898C39.2796 173.806 39.1691 173.687 39.0873 173.549C39.0056 173.411 38.9545 173.257 38.9376 173.097L27.6022 76.059C27.5813 75.9263 27.5975 75.7904 27.6489 75.6663C27.7004 75.5423 27.7852 75.4349 27.8939 75.356C28.0026 75.2771 28.131 75.2299 28.2649 75.2194C28.3988 75.2089 28.533 75.2355 28.6527 75.2965L90.4303 105.694C90.8938 105.937 91.4292 106.006 91.9391 105.888C92.4491 105.77 92.8998 105.472 93.2091 105.05L137.958 40.1717C138.027 40.0738 138.118 39.994 138.224 39.9388C138.33 39.8836 138.448 39.8548 138.568 39.8548C138.688 39.8548 138.806 39.8836 138.912 39.9388C139.018 39.994 139.109 40.0738 139.178 40.1717L183.978 105.05C184.275 105.491 184.724 105.808 185.238 105.942C185.753 106.076 186.299 106.018 186.773 105.779L248.551 75.3812C248.671 75.3202 248.805 75.2936 248.939 75.3041C249.073 75.3146 249.201 75.3619 249.31 75.4408C249.419 75.5197 249.503 75.6271 249.555 75.7511C249.606 75.8752 249.623 76.011 249.602 76.1437L238.266 173.097ZM192.145 75.9234L140.449 0.963439C140.245 0.66639 139.972 0.423447 139.653 0.255597C139.334 0.0877466 138.979 0 138.619 0C138.259 0 137.904 0.0877466 137.585 0.255597C137.266 0.423447 136.993 0.66639 136.789 0.963439L85.0929 75.9234C84.9415 76.1431 84.7166 76.3014 84.4587 76.3698C84.2008 76.4381 83.9269 76.4121 83.6866 76.2962L3.21984 36.6812C2.85759 36.504 2.45408 36.4279 2.05215 36.4612C1.65021 36.4944 1.26477 36.6357 0.936583 36.8701C0.608398 37.1046 0.349757 37.4234 0.187943 37.7928C0.0261297 38.1622 -0.0328184 38.5685 0.0174076 38.9687L17.4527 188.465C18.7404 201.393 72.4867 211.797 138.602 211.797C204.717 211.797 258.463 201.393 259.751 188.465L277.203 38.9687C277.256 38.5715 277.199 38.1675 277.041 37.7996C276.882 37.4317 276.627 37.1136 276.302 36.8791C275.977 36.6446 275.595 36.5024 275.196 36.4675C274.797 36.4327 274.395 36.5065 274.035 36.6812L193.551 76.2454C193.316 76.3664 193.046 76.4005 192.789 76.3415C192.532 76.2826 192.303 76.1345 192.145 75.9234Z"
								fill="currentColor"
							/>
							<path
								d="M167.949 131.567C169.389 120.876 165.492 111.506 159.273 110.642C153.055 109.777 146.82 117.741 145.379 128.433C143.939 139.124 147.819 148.494 154.055 149.359C160.29 150.223 166.508 142.327 167.949 131.567Z"
								fill="currentColor"
							/>
							<path
								d="M215.205 137.243C216.391 128.517 213.24 120.876 208.191 120.181C203.141 119.486 198.024 125.976 196.906 134.702C195.788 143.428 198.888 151.07 203.938 151.781C208.987 152.493 214.07 146.02 215.205 137.243Z"
								fill="currentColor"
							/>
						</g>
						<defs>
							<clipPath id="metafy-logo-clip">
								<rect width="278" height="212" fill="white" />
							</clipPath>
						</defs>
					</svg>
					{m["sim.auth.signIn.metafy"]({})}
				</Button>
				{#if metafyError}
					<p
						class="rounded-md bg-destructive/10 px-3 py-2 text-center text-xs text-destructive"
						role="alert"
						aria-live="assertive"
					>
						{metafyError}
					</p>
				{/if}
				{/if}

				{#if showDevEmailPasswordSignIn}
					<form
						class="space-y-3 rounded-lg border border-dashed border-border p-3"
						onsubmit={(event) => {
							event.preventDefault();
							void handleEmailAuth();
						}}
					>
						<div class="flex rounded-md bg-muted p-1 text-sm">
							<button
								type="button"
								class={`flex-1 rounded px-3 py-1.5 ${emailAuthMode === "sign-in" ? "bg-background shadow-sm" : "text-muted-foreground"}`}
								onclick={() => (emailAuthMode = "sign-in")}
							>
								Sign in
							</button>
							<button
								type="button"
								class={`flex-1 rounded px-3 py-1.5 ${emailAuthMode === "sign-up" ? "bg-background shadow-sm" : "text-muted-foreground"}`}
								onclick={() => (emailAuthMode = "sign-up")}
							>
								Create
							</button>
						</div>
						{#if emailAuthMode === "sign-up"}
							<label class="block space-y-1 text-sm">
								<span class="font-medium">Display name</span>
								<input
									bind:value={displayName}
									class="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
									autocomplete="name"
									placeholder="Agent Tester"
									type="text"
								/>
							</label>
						{/if}
						<label class="block space-y-1 text-sm">
							<span class="font-medium">Email</span>
							<input
								bind:value={email}
								class="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
								autocomplete="email"
								placeholder="agent@example.test"
								required
								type="email"
							/>
						</label>
						<label class="block space-y-1 text-sm">
							<span class="font-medium">Password</span>
							<input
								bind:value={password}
								class="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
								autocomplete={emailAuthMode === "sign-up" ? "new-password" : "current-password"}
								minlength="8"
								required
								type="password"
							/>
						</label>
						<Button class="h-10 w-full" disabled={emailAuthLoading} type="submit" variant="secondary">
							{emailAuthLoading ? "Working..." : emailAuthMode === "sign-up" ? "Create dev account" : "Sign in with email"}
						</Button>
						{#if emailAuthError}
							<p
								class="rounded-md bg-destructive/10 px-3 py-2 text-center text-xs text-destructive"
								role="alert"
								aria-live="assertive"
							>
								{emailAuthError}
							</p>
						{/if}
					</form>
				{/if}

				<p class="text-muted-foreground text-center text-xs leading-5">
					{m["sim.auth.signIn.termsIntro"]({})}
					<a
						href="/terms-of-service"
						class="cursor-pointer text-muted-foreground underline-offset-2 underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
					>
						{m["sim.auth.signIn.termsOfService"]({})}
					</a>
					{m["sim.auth.signIn.termsConjunction"]({})}
					<a
						href="/privacy-policy"
						class="cursor-pointer text-muted-foreground underline-offset-2 underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
					>
						{m["sim.auth.signIn.privacyPolicy"]({})}
					</a>
					{m["sim.auth.signIn.termsOutro"]({})}
				</p>

				<label
					class="border-border/70 bg-muted/20 flex cursor-pointer items-start gap-3 rounded-lg border px-4 py-3 text-left"
					for="discord-server-opt-in"
				>
					<input
						id="discord-server-opt-in"
						bind:checked={joinDiscordServer}
						class="mt-1 size-4 rounded border-white/20 bg-transparent accent-[#5865F2]"
						type="checkbox"
					/>
					<span class="space-y-1">
						<span class="text-sm font-medium">
							{m["sim.auth.signIn.joinDiscordLabel"]({})}
						</span>
						<span class="text-muted-foreground block text-xs leading-5">
							{m["sim.auth.signIn.joinDiscordDescription"]({})}
						</span>
					</span>
				</label>
			</div>
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>
