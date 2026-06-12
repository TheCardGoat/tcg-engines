<script lang="ts">
import { m } from "$lib/i18n/messages.js";
import AlertCircle from "@lucide/svelte/icons/alert-circle";
import ChevronDown from "@lucide/svelte/icons/chevron-down";
import Loader from "@lucide/svelte/icons/loader-circle";
import ShieldAlert from "@lucide/svelte/icons/shield-alert";
import XCircle from "@lucide/svelte/icons/x-circle";
import {
	LORCANA_FORMATS,
	type DeckFormatResult,
	type LorcanaFormatId,
} from "@tcg/lorcana-types";
import {
	fetchDeckValidationForFormat,
	type ProfileDeckSummary,
} from "../api/player-context-api.js";

// ---------------------------------------------------------------------------
// Module-level caches (same pattern as DeckCardCountHoverCard)
// ---------------------------------------------------------------------------

const validationCache = new Map<string, DeckFormatResult>();
const validationPromiseCache = new Map<string, Promise<DeckFormatResult>>();

function cacheKey(deckListId: string, formatId: LorcanaFormatId): string {
	return `${deckListId}:${formatId}`;
}

function loadValidation(
	deckListId: string,
	formatId: LorcanaFormatId,
): Promise<DeckFormatResult> {
	const key = cacheKey(deckListId, formatId);

	const cached = validationCache.get(key);
	if (cached) return Promise.resolve(cached);

	const inFlight = validationPromiseCache.get(key);
	if (inFlight) return inFlight;

	const request = fetchDeckValidationForFormat(deckListId, formatId)
		.then((result) => {
			validationCache.set(key, result);
			validationPromiseCache.delete(key);
			return result;
		})
		.catch((error: unknown) => {
			validationPromiseCache.delete(key);
			throw error;
		});

	validationPromiseCache.set(key, request);
	return request;
}

// ---------------------------------------------------------------------------
// Props & state
// ---------------------------------------------------------------------------

let {
	deck,
	formatId,
}: {
	deck: ProfileDeckSummary;
	formatId: LorcanaFormatId;
} = $props();

let expanded = $state(false);
let result = $state<DeckFormatResult | null>(null);
let loading = $state(false);
let hasError = $state(false);
let requestSequence = 0;

function getLocalizedFormatLabel(fid: LorcanaFormatId): string {
	const formatMessageKey = `sim.matchmaking.matchmaking.formats.${fid}` as keyof typeof m;
	const localizedFormatLabel = m[formatMessageKey]?.();
	return localizedFormatLabel ?? LORCANA_FORMATS[fid]?.label ?? fid;
}

const formatLabel = $derived(getLocalizedFormatLabel(formatId));

const failedRules = $derived(
	result ? result.rules.filter((r) => !r.passed) : [],
);

// Load validation when expanded or when deck/format changes while expanded
$effect(() => {
	const deckListId = deck.activeDeckListId;
	const fid = formatId;

	if (!expanded) return;

	const key = cacheKey(deckListId, fid);
	const cached = validationCache.get(key);
	if (cached) {
		result = cached;
		loading = false;
		hasError = false;
		return;
	}

	result = null;
	loading = true;
	hasError = false;

	const currentRequest = ++requestSequence;
	void loadValidation(deckListId, fid)
		.then((nextResult) => {
			if (currentRequest !== requestSequence) return;
			result = nextResult;
			hasError = false;
		})
		.catch(() => {
			if (currentRequest !== requestSequence) return;
			hasError = true;
		})
		.finally(() => {
			if (currentRequest !== requestSequence) return;
			loading = false;
		});
});
</script>

<div class="space-y-1">
	<button
		type="button"
		class="flex w-full items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-left text-sm text-amber-200 transition-colors hover:bg-amber-500/15"
		aria-expanded={expanded}
		onclick={() => (expanded = !expanded)}
	>
		<ShieldAlert class="size-4 shrink-0 text-amber-400" aria-hidden="true" />
		<span class="flex-1">
			{m["sim.matchmaking.selectedDeck.validation.notLegal"]({ format: formatLabel })}
		</span>
		<ChevronDown
			class="size-4 shrink-0 text-amber-400/70 transition-transform duration-200 {expanded ? 'rotate-180' : ''}"
			aria-hidden="true"
		/>
	</button>

	{#if expanded}
		<div class="space-y-1.5 rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2">
			{#if loading}
				<div class="flex items-center gap-2 text-xs text-amber-200/70">
					<Loader class="size-3.5 animate-spin" aria-hidden="true" />
					<span>{m["sim.matchmaking.selectedDeck.validation.loading"]({})}</span>
				</div>
			{:else if hasError || !result}
				<div class="flex items-center gap-2 text-xs text-amber-200/70">
					<AlertCircle class="size-3.5" aria-hidden="true" />
					<span>{m["sim.matchmaking.selectedDeck.validation.error"]({})}</span>
				</div>
			{:else}
				{#each failedRules as rule}
					<div class="flex items-start gap-2 text-xs text-amber-100/80">
						<XCircle class="mt-0.5 size-3.5 shrink-0 text-amber-400/70" aria-hidden="true" />
						<span>{rule.message}</span>
					</div>
				{/each}
			{/if}
		</div>
	{/if}
</div>
