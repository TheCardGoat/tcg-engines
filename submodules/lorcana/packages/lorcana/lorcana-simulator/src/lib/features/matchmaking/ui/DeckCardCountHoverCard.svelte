<script lang="ts">
import { Badge } from "$lib/design-system/primitives/badge";
import * as HoverCard from "$lib/design-system/primitives/hover-card/index.js";
import { m } from "$lib/i18n/messages.js";
import { cn } from "$lib/utils.js";
import AlertCircle from "@lucide/svelte/icons/alert-circle";
import Loader from "@lucide/svelte/icons/loader-circle";
import { getInkSymbolUrl } from "@/features/simulator/model/asset-urls.js";
import {
	fetchDeckListBreakdownByDeckListId,
	type DeckListBreakdown,
	type ProfileDeckSummary,
} from "@/features/matchmaking/api/player-context-api.js";

const deckBreakdownCache = new Map<string, DeckListBreakdown>();
const deckBreakdownPromiseCache = new Map<string, Promise<DeckListBreakdown>>();

function loadDeckBreakdown(deckListId: string): Promise<DeckListBreakdown> {
	const cachedBreakdown = deckBreakdownCache.get(deckListId);
	if (cachedBreakdown) {
		return Promise.resolve(cachedBreakdown);
	}

	const inFlightRequest = deckBreakdownPromiseCache.get(deckListId);
	if (inFlightRequest) {
		return inFlightRequest;
	}

	const request = fetchDeckListBreakdownByDeckListId(deckListId)
		.then((breakdown) => {
			deckBreakdownCache.set(deckListId, breakdown);
			deckBreakdownPromiseCache.delete(deckListId);
			return breakdown;
		})
		.catch((error: unknown) => {
			deckBreakdownPromiseCache.delete(deckListId);
			throw error;
		});

	deckBreakdownPromiseCache.set(deckListId, request);
	return request;
}

function formatCardType(type: string): string {
	return type.charAt(0).toUpperCase() + type.slice(1);
}

let {
	deck,
	class: className,
}: {
	deck: ProfileDeckSummary;
	class?: string;
} = $props();

let breakdown = $state<DeckListBreakdown | null>(null);
let loading = $state(false);
let hasError = $state(false);
let requestSequence = 0;

$effect(() => {
	const deckListId = deck.activeDeckListId;
	const cachedBreakdown = deckBreakdownCache.get(deckListId);

	if (cachedBreakdown) {
		breakdown = cachedBreakdown;
		loading = false;
		hasError = false;
		return;
	}

	breakdown = null;
	loading = true;
	hasError = false;

	const currentRequest = ++requestSequence;
	void loadDeckBreakdown(deckListId)
		.then((nextBreakdown) => {
			if (currentRequest !== requestSequence) {
				return;
			}

			breakdown = nextBreakdown;
			hasError = false;
		})
		.catch(() => {
			if (currentRequest !== requestSequence) {
				return;
			}

			hasError = true;
		})
		.finally(() => {
			if (currentRequest !== requestSequence) {
				return;
			}

			loading = false;
		});
});
</script>

<HoverCard.Root openDelay={140}>
	<HoverCard.Trigger class="inline-flex">
		<Badge
			variant="outline"
			tabindex={0}
			class={cn(
				"cursor-help rounded-full border-white/10 bg-white/[0.05] px-2.5 py-1 text-[0.65rem] font-medium uppercase tracking-[0.16em] text-slate-300 transition-colors hover:bg-white/[0.08] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300",
				className,
			)}
		>
			{m["sim.matchmaking.selectedDeck.cardsCount"]({ count: deck.cardCount })}
		</Badge>
	</HoverCard.Trigger>

	<HoverCard.Content
		side="top"
		align="end"
		sideOffset={10}
		class="w-[min(20rem,calc(100vw-1.5rem))] rounded-2xl border-white/10 bg-slate-950/95 p-3 text-slate-100 shadow-[0_24px_64px_-24px_rgba(2,6,23,0.95)] backdrop-blur-xl"
	>
		<div class="space-y-3">
			<div class="space-y-1">
				<p class="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-slate-400">
					{m["sim.matchmaking.selectedDeck.detailsTitle"]({})}
				</p>
				<div class="flex items-baseline justify-between gap-3">
					<p class="min-w-0 truncate text-sm font-semibold text-slate-50">{deck.deckName}</p>
					<span class="shrink-0 text-xs text-slate-400">
						{m["sim.matchmaking.selectedDeck.cardsCount"]({ count: deck.cardCount })}
					</span>
				</div>
			</div>

			{#if loading}
				<div class="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-slate-300">
					<Loader class="size-4 animate-spin text-slate-400" aria-hidden="true" />
					<span>{m["sim.matchmaking.selectedDeck.detailsLoading"]({})}</span>
				</div>
			{:else if hasError || !breakdown}
				<div class="flex items-center gap-2 rounded-xl border border-rose-500/25 bg-rose-500/10 px-3 py-2 text-sm text-rose-100">
					<AlertCircle class="size-4" aria-hidden="true" />
					<span>{m["sim.matchmaking.selectedDeck.detailsError"]({})}</span>
				</div>
			{:else}
				<div class="grid grid-cols-2 gap-2">
					<div class="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2">
						<p class="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-slate-400">
							{m["sim.matchmaking.selectedDeck.detailsInkable"]({})}
						</p>
						<p class="mt-1 text-lg font-semibold text-slate-50">{breakdown.inkableCount}</p>
					</div>
					<div class="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2">
						<p class="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-slate-400">
							{m["sim.matchmaking.selectedDeck.detailsUninkable"]({})}
						</p>
						<p class="mt-1 text-lg font-semibold text-slate-50">{breakdown.uninkableCount}</p>
					</div>
				</div>

				<div class="space-y-2">
					<p class="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-slate-400">
						{m["sim.matchmaking.selectedDeck.detailsByColor"]({})}
					</p>
					<div class="flex flex-wrap gap-1.5">
						{#each breakdown.colorBreakdown as entry}
							<Badge
								variant="outline"
								class="gap-1.5 rounded-full border-white/10 bg-white/[0.04] px-2 py-1 text-slate-200"
							>
								<img
									src={getInkSymbolUrl(entry.ink)}
									alt={entry.ink}
									class="size-4 rounded-full bg-black/20 object-contain"
								/>
								<span class="capitalize">{entry.ink}</span>
								<span class="text-slate-400">{entry.count}</span>
							</Badge>
						{/each}
					</div>
				</div>

				<div class="space-y-2">
					<p class="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-slate-400">
						{m["sim.matchmaking.selectedDeck.detailsByType"]({})}
					</p>
					<div class="grid grid-cols-2 gap-1.5">
						{#each breakdown.typeBreakdown as entry}
							<div class="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] px-2.5 py-2 text-sm text-slate-200">
								<span>{formatCardType(entry.type)}</span>
								<span class="font-medium text-slate-400">{entry.count}</span>
							</div>
						{/each}
					</div>
				</div>
			{/if}
		</div>
	</HoverCard.Content>
</HoverCard.Root>
