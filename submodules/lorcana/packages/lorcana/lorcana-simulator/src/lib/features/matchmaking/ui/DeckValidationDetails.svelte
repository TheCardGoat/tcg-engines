<script lang="ts">
import { m } from "$lib/i18n/messages.js";
import AlertCircle from "@lucide/svelte/icons/alert-circle";
import ChevronDown from "@lucide/svelte/icons/chevron-down";
import Loader from "@lucide/svelte/icons/loader-circle";
import ShieldAlert from "@lucide/svelte/icons/shield-alert";
import XCircle from "@lucide/svelte/icons/x-circle";
import { getAllCardsById } from "@tcg/lorcana-cards";
import {
	getFullName,
	LORCANA_FORMATS,
	type DeckFormatResult,
	type FormatRuleResult,
	type FormatValidationCardDetail,
	type LorcanaFormatId,
} from "@tcg/lorcana-types";
import {
	fetchDeckValidationForFormat,
	type ProfileDeckSummary,
} from "../api/player-context-api.js";
import ValidationCardReference from "./ValidationCardReference.svelte";

// ---------------------------------------------------------------------------
// Module-level caches (same pattern as DeckCardCountHoverCard)
// ---------------------------------------------------------------------------

const validationCache = new Map<string, DeckFormatResult>();
const validationPromiseCache = new Map<string, Promise<DeckFormatResult>>();
const MAX_VISIBLE_CARDS = 6;

type CardCatalog = Awaited<ReturnType<typeof getAllCardsById>>;
type CardDefinition = CardCatalog[string];

let catalogPromise: Promise<CardCatalog> | null = null;

function loadCatalog(): Promise<CardCatalog> {
	if (!catalogPromise) {
		catalogPromise = getAllCardsById();
	}
	return catalogPromise;
}

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
	initialResult = null,
	initialCatalog = null,
	initiallyExpanded = true,
}: {
	deck: ProfileDeckSummary;
	formatId: LorcanaFormatId;
	initialResult?: DeckFormatResult | null;
	initialCatalog?: CardCatalog | null;
	initiallyExpanded?: boolean;
} = $props();

let expandedOverride = $state<boolean | null>(null);
let result = $state<DeckFormatResult | null>(null);
let loading = $state(false);
let hasError = $state(false);
let catalog = $state<CardCatalog | null>(null);
let requestSequence = 0;

const expanded = $derived(expandedOverride ?? initiallyExpanded);
const effectiveResult = $derived(getEffectiveResult(initialResult, result));
const effectiveCatalog = $derived(initialCatalog ?? catalog);

function getEffectiveResult(
	serverResult: DeckFormatResult | null,
	clientResult: DeckFormatResult | null,
): DeckFormatResult | null {
	if (!serverResult) return clientResult;
	if (!clientResult) return serverResult;
	if (serverResult.valid !== clientResult.valid) return serverResult;
	return clientResult;
}

function getLocalizedFormatLabel(fid: LorcanaFormatId): string {
	if (fid === "attack-of-the-vine") return m["sim.matchmaking.matchmaking.formats.earlyAccess"]({});
	if (fid === "core-constructed") return m["sim.matchmaking.matchmaking.formats.ccROF"]({});
	const formatMessageKey = `sim.matchmaking.matchmaking.formats.${fid}` as keyof typeof m;
	const localizedFormatLabel = m[formatMessageKey]?.();
	return isMissingMessageFallback(localizedFormatLabel)
		? (LORCANA_FORMATS[fid]?.label ?? fid)
		: (localizedFormatLabel ?? LORCANA_FORMATS[fid]?.label ?? fid);
}

const formatLabel = $derived(getLocalizedFormatLabel(formatId));

const failedRules = $derived(
	effectiveResult ? effectiveResult.rules.filter((r) => !r.passed) : [],
);

const failureCount = $derived(failedRules.length);
const validationSummary = $derived(getValidationSummary(effectiveResult, formatLabel));
const AMBIGUOUS_LEGACY_DECK_MESSAGE_START = "This deck was saved with outdated card IDs";

function isMissingMessageFallback(message: string | undefined): boolean {
	return message != null && message.startsWith("[") && message.endsWith("]");
}

function assertNever(value: never): never {
	throw new Error(`Unhandled deck validation kind: ${String(value)}`);
}

function getRuleTitle(rule: FormatRuleResult): string {
	if (isAmbiguousLegacyDeckRule(rule)) {
		return "Deck needs to be recreated";
	}

	switch (rule.kind) {
		case "DECK_SIZE":
			return "Deck size";
		case "INK_TYPES":
			return "Too many ink types";
		case "CARD_QUANTITY":
			return "Too many copies";
		case "CARD_SET":
			return "Cards outside this format";
		case "BANNED_CARD":
			return "Banned cards";
		case "REQUIRES_ANY_SET":
			return "Missing Early Access cards";
	}

	const exhaustive: never = rule.kind;
	return assertNever(exhaustive);
}

function getRuleDescription(rule: FormatRuleResult): string {
	if (isAmbiguousLegacyDeckRule(rule)) {
		return "This deck was saved before a card ID repair and cannot be matched safely to the correct cards. Please recreate or re-import the deck from your deck list before joining matchmaking.";
	}

	const details = rule.details;
	switch (rule.kind) {
		case "DECK_SIZE":
			if (details?.type === "DECK_SIZE") {
				return `Add ${Math.max(0, details.minimum - details.count)} more card(s). This deck has ${details.count}, and the minimum is ${details.minimum}.`;
			}
			return rule.message;
		case "INK_TYPES":
			if (details?.type === "INK_TYPES") {
				return `Use at most ${details.maximum} ink types. This deck uses ${details.inkTypes.join(", ")}.`;
			}
			return rule.message;
		case "CARD_QUANTITY":
			if (details?.type !== "CARD_QUANTITY") return rule.message;
			return "Reduce these cards to their allowed copy limit.";
		case "CARD_SET":
			if (details?.type !== "CARD_SET") return rule.message;
			return "Remove these cards or choose a format where they are legal.";
		case "BANNED_CARD":
			if (details?.type !== "BANNED_CARD") return rule.message;
			return "Remove these cards before joining this format.";
		case "REQUIRES_ANY_SET":
			if (details?.type === "REQUIRES_ANY_SET") {
				return `Add at least one card from ${details.requiredSets.join(", ")}.`;
			}
			return rule.message;
	}

	const exhaustive: never = rule.kind;
	return assertNever(exhaustive);
}

function isAmbiguousLegacyDeckRule(rule: FormatRuleResult): boolean {
	return (
		rule.kind === "CARD_SET" &&
		rule.message.startsWith(AMBIGUOUS_LEGACY_DECK_MESSAGE_START)
	);
}

function getValidationSummary(
	validation: DeckFormatResult | null,
	label: string,
): string {
	if (!validation) return "";
	const failedMessage = validation.rules.find((rule) => !rule.passed)?.message;
	if (failedMessage) return failedMessage;
	if (!validation.valid) {
		return `This deck is not listed as legal for ${label}. Choose a different deck or select one of the formats shown on the deck badges.`;
	}
	return `This deck is legal for ${label}.`;
}

function getRuleCards(rule: FormatRuleResult): FormatValidationCardDetail[] {
	switch (rule.kind) {
		case "CARD_SET":
			return rule.details?.type === "CARD_SET" ? rule.details.cards : [];
		case "CARD_QUANTITY":
			return rule.details?.type === "CARD_QUANTITY" ? rule.details.cards : [];
		case "BANNED_CARD":
			return rule.details?.type === "BANNED_CARD" ? rule.details.cards : [];
		case "DECK_SIZE":
		case "INK_TYPES":
		case "REQUIRES_ANY_SET":
			return [];
	}

	const exhaustive: never = rule.kind;
	return assertNever(exhaustive);
}

function getVisibleCards(cards: FormatValidationCardDetail[]): FormatValidationCardDetail[] {
	return cards.slice(0, MAX_VISIBLE_CARDS);
}

function getHiddenCardCount(cards: FormatValidationCardDetail[]): number {
	return Math.max(0, cards.length - MAX_VISIBLE_CARDS);
}

function getCardDefinition(publicId: string): CardDefinition | undefined {
	return effectiveCatalog?.[publicId];
}

function getCardName(detail: FormatValidationCardDetail): string {
	const card = getCardDefinition(detail.publicId);
	return card ? getFullName(card) : detail.fullName;
}

function getCardSetLabel(detail: FormatValidationCardDetail): string {
	return detail.sets.length > 0 ? detail.sets.join(", ") : "unknown set";
}

function getCopyText(detail: FormatValidationCardDetail): string | null {
	if (detail.maximum == null || detail.quantity == null) return null;
	return `${detail.quantity} copies, maximum ${detail.maximum}`;
}

function getQuantityText(detail: FormatValidationCardDetail): string | null {
	if (detail.maximum != null || detail.quantity == null) return null;
	return `${detail.quantity} in deck`;
}

$effect(() => {
	deck.activeDeckListId;
	formatId;
	expandedOverride = true;
});

$effect(() => {
	void loadCatalog()
		.then((nextCatalog) => {
			catalog = nextCatalog;
		})
		.catch(() => {
			catalog = null;
		});
});

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
		onclick={() => (expandedOverride = !expanded)}
	>
		<ShieldAlert class="size-4 shrink-0 text-amber-400" aria-hidden="true" />
		<span class="flex-1">
			{m["sim.matchmaking.selectedDeck.validation.notLegal"]({ format: formatLabel })}
			{#if failureCount > 0}
				<span class="ml-1 text-amber-200/65">
					({failureCount} {failureCount === 1 ? "issue" : "issues"})
				</span>
			{/if}
		</span>
		<ChevronDown
			class="size-4 shrink-0 text-amber-400/70 transition-transform duration-200 {expanded ? 'rotate-180' : ''}"
			aria-hidden="true"
		/>
	</button>

	{#if expanded}
		<div class="space-y-2 rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2.5">
			{#if loading}
				<div class="flex items-center gap-2 text-xs text-amber-200/70">
					<Loader class="size-3.5 animate-spin" aria-hidden="true" />
					<span>{m["sim.matchmaking.selectedDeck.validation.loading"]({})}</span>
				</div>
			{:else if hasError || !effectiveResult}
				<div class="flex items-center gap-2 text-xs text-amber-200/70">
					<AlertCircle class="size-3.5" aria-hidden="true" />
					<span>{m["sim.matchmaking.selectedDeck.validation.error"]({})}</span>
				</div>
			{:else}
				{#if failedRules.length === 0}
					<div class="rounded-md border border-amber-400/15 bg-slate-950/35 px-2.5 py-2">
						<div class="flex items-start gap-2">
							<AlertCircle class="mt-0.5 size-3.5 shrink-0 text-amber-400/80" aria-hidden="true" />
							<div class="min-w-0 flex-1">
								<p class="text-xs font-semibold text-amber-100">No itemized issues returned</p>
								<p class="mt-0.5 text-xs leading-5 text-amber-100/70">
									{validationSummary}
								</p>
							</div>
						</div>
					</div>
				{/if}
				{#each failedRules as rule}
					{@const cards = getRuleCards(rule)}
					<div class="rounded-md border border-amber-400/15 bg-slate-950/35 px-2.5 py-2">
						<div class="flex items-start gap-2">
							<XCircle class="mt-0.5 size-3.5 shrink-0 text-amber-400/80" aria-hidden="true" />
							<div class="min-w-0 flex-1">
								<p class="text-xs font-semibold text-amber-100">{getRuleTitle(rule)}</p>
								<p class="mt-0.5 text-xs leading-5 text-amber-100/70">
									{getRuleDescription(rule)}
								</p>
							</div>
						</div>

						{#if cards.length > 0}
							<ul class="mt-2 space-y-1.5 pl-5 text-xs leading-5 text-amber-50/85">
								{#each getVisibleCards(cards) as card (card.publicId)}
									{@const cardDefinition = getCardDefinition(card.publicId)}
									{@const copyText = getCopyText(card)}
									{@const quantityText = getQuantityText(card)}
									<li>
										<ValidationCardReference
											name={getCardName(card)}
											set={cardDefinition?.set}
											cardNumber={cardDefinition?.cardNumber}
											cardType={cardDefinition?.cardType}
										/>
										<span class="text-amber-100/55">
											{#if copyText}
												{" "}({copyText})
											{:else if quantityText}
												{" "}({quantityText}, {getCardSetLabel(card)})
											{:else}
												{" "}({getCardSetLabel(card)})
											{/if}
										</span>
									</li>
								{/each}
								{#if getHiddenCardCount(cards) > 0}
									<li class="text-amber-100/60">
										and {getHiddenCardCount(cards)} more
									</li>
								{/if}
							</ul>
						{/if}
					</div>
				{/each}
			{/if}
		</div>
	{/if}
</div>
