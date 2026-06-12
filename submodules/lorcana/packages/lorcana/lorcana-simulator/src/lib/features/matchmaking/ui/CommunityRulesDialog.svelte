<script lang="ts">
	import * as Dialog from "$lib/design-system/primitives/dialog";
	import { Button } from "$lib/design-system/primitives/button";
	import Loader from "@lucide/svelte/icons/loader-circle";

	let {
		open = $bindable(false),
		loading = false,
		error = null,
		onAccept,
	}: {
		open: boolean;
		loading: boolean;
		error: string | null;
		onAccept: () => void;
	} = $props();

	let agreed = $state(false);
</script>

<Dialog.Root bind:open>
	<Dialog.Portal>
		<Dialog.Overlay />
		<Dialog.Content
			class="sm:max-w-lg"
			showCloseButton={false}
			interactOutsideBehavior="ignore"
			escapeKeydownBehavior="ignore"
		>
			<Dialog.Header>
				<Dialog.Title class="text-2xl">
					Community Rules
				</Dialog.Title>
				<Dialog.Description>
					Please review and accept our community guidelines to continue.
				</Dialog.Description>
			</Dialog.Header>

			<div class="max-h-[50vh] space-y-4 overflow-y-auto px-1 text-sm leading-6 text-slate-200 [scrollbar-color:rgba(148,163,184,0.5)_transparent] [scrollbar-width:thin]">
				<p class="text-muted-foreground text-xs italic">
					Our use of Disney-related trademarks and intellectual property is solely for non-commercial, educational, or entertainment purposes.
				</p>

				<div class="space-y-3">
					<div>
						<h3 class="font-semibold text-white">Lorcanito &#8800; Disney Lorcana</h3>
						<p class="mt-1">
							Just so we're clear &mdash; Lorcanito has zero connection to Disney Lorcana. It's a non-commercial, community-made project, and we are in no way affiliated with Disney.
						</p>
					</div>

					<div>
						<h3 class="font-semibold text-white">Lorcanito is still a work-in-progress</h3>
						<p class="mt-1">
							Yep, this means bugs. Please report them, and don't exploit them! If something weird happens, switch to manual mode and chat it out with your opponent. Assume good intentions; we're all here to have fun.
						</p>
					</div>

					<div>
						<h3 class="font-semibold text-white">No tournaments, please!</h3>
						<p class="mt-1">
							Seriously, no Lorcanito tournaments, especially with prize pools. The competitive scene is out there in the real world, and that's where it belongs. Let's keep it chill here.
						</p>
					</div>

					<div>
						<h3 class="font-semibold text-white">Community &gt; Competition</h3>
						<p class="mt-1">
							We're here to help each other get better, not to one-up each other with sneaky moves. If your opponent does something that seems off, maybe they're just new. Be kind!
						</p>
					</div>

					<div>
						<h3 class="font-semibold text-white">No streaming or content creation</h3>
						<p class="mt-1">
							Please don't stream or create videos using Lorcanito. We don't want people thinking this is some kind of official Disney Lorcana client.
						</p>
					</div>
				</div>
			</div>

			<div class="space-y-4 px-1 pt-2">
				{#if error}
					<div
						class="rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200"
						role="alert"
					>
						{error}
					</div>
				{/if}

				<label
					class="border-border/70 bg-muted/20 flex cursor-pointer items-start gap-3 rounded-lg border px-4 py-3 text-left"
					for="community-rules-agree"
				>
					<input
						id="community-rules-agree"
						bind:checked={agreed}
						class="mt-1 size-4 rounded border-white/20 bg-transparent accent-sky-500"
						type="checkbox"
						disabled={loading}
					/>
					<span class="space-y-1">
						<span class="text-sm font-medium">
							I have read and agree to the Community Rules,
							<a
								href="https://lorcanito.com/terms-of-service"
								class="cursor-pointer text-sky-300 underline-offset-2 hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
							>
								Terms of Service
							</a>
							and
							<a
								href="https://lorcanito.com/privacy"
								class="cursor-pointer text-sky-300 underline-offset-2 hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
							>
								Privacy Policy
							</a>
						</span>
					</span>
				</label>

				<Button
					class="h-11 w-full text-base"
					disabled={!agreed || loading}
					onclick={onAccept}
				>
					{#if loading}
						<Loader class="mr-2 size-5 animate-spin" />
						Setting up your profile...
					{:else}
						Accept & Continue
					{/if}
				</Button>
			</div>
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>
