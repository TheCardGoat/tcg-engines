import type { CardInstanceId, PlayerId } from "@tcg/lorcana-types";
import type {
  ResolutionExecutionOptions,
  ResolutionSelectionContext,
  ResolutionSelectionKind,
  SlottedTargetKind,
} from "@tcg/lorcana-engine";

export type { ResolutionSelectionKind };

import type { PromptCopyDescriptor, PromptKey } from "./prompt-keys";

/**
 * Where the renderer should display the active prompt.
 *
 * `inline-board` — the prompt's targets are rendered as clickable cards on
 * the board (hand / play zones). No modal.
 *
 * `modal-card-picker` — targets live in a non-clickable zone (deck, discard,
 * inkwell, limbo) or selection requires a focused picker. Open a modal.
 *
 * The mapping between selection contexts and surfaces is owned by
 * `pickSurface()` (see `surface/pick-surface.ts`). Renderers must not
 * second-guess it.
 */
export type InteractionSurface =
  | "none"
  | "inline-board"
  | "modal-card-picker"
  | "modal-player-picker"
  | "choice-modal"
  | "optional-banner"
  | "scry-overlay"
  | "name-card-modal"
  | "unsupported";

/**
 * The viewer's relationship to the active prompt.
 *
 * - `chooser` — the viewer is the player who must act. Renderer shows
 *   interactive affordances.
 * - `non-chooser-controller` — the source card belongs to the viewer but the
 *   *opponent* is the chooser (e.g. `chosenBy: "opponent"` effects, where the
 *   opponent picks one of *your* characters). Renderer shows a read-only
 *   "Opponent is choosing" banner. Engine still uses the source's controller
 *   for filtering.
 * - `spectator` — the viewer is neither the controller nor the chooser. Same
 *   read-only banner.
 */
export type ViewerRole = "chooser" | "non-chooser-controller" | "spectator";

/**
 * Pre-computed metadata about the active engine prompt.
 *
 * `null` whenever there is no prompt waiting for player input.
 */
export type ActivePrompt = {
  requestId: string;
  kind: ResolutionSelectionKind;
  /** PlayerId of the player whose UI must resolve the prompt. */
  chooserId: PlayerId;
  /** Owner of the source card; may differ from chooser. */
  controllerId: PlayerId;
  /** Source card that spawned this resolution. */
  sourceCardId: CardInstanceId;
  /**
   * Card ids already locked into this prompt by an earlier resolution step.
   * Choice prompts use this for "that character" follow-ups such as
   * Hades - Looking for a Deal; target prompts expose the same data through
   * `slots` as well.
   */
  selectedCardIds: CardInstanceId[];
  /** Slot keys (from `SLOTTED_TARGET_SLOT_KEYS`) when the engine expects a slotted payload. `null` for flat-array prompts. */
  expectedSlottedKind: SlottedTargetKind | null;
  /** Active slot the chooser is currently filling, when slotted. `null` for non-slotted. */
  activeSlotIndex: number | null;
  /** Slot definitions, parallel to `expectedSlottedKind`. `null` for non-slotted. */
  slots: PromptSlot[] | null;
  /**
   * How many leading slots the engine auto-resolved. The dispatcher needs
   * this to convert a slot-key-aligned index into the raw position used by
   * `currentSelection.targets[]` (which skips auto-resolved slots):
   *
   *   rawIndex = slotKeyIndex - autoResolvedSlotCount
   *
   * Always `0` for non-slotted prompts. Inferred from
   * `maxSelections < totalSlots` until the engine surfaces this directly
   * (work-log gap #15).
   */
  autoResolvedSlotCount: number;
  /** Min selections before the prompt can be submitted. */
  minSelections: number;
  /** Max selections accepted by the engine (already clamped to candidate count). */
  maxSelections: number;
  /** Printed max from the card text (un-clamped) — useful for "up to N" copy. */
  declaredMaxSelections: number | null;
  /** True when the engine fizzled the effect because no legal targets exist. */
  autoRejected: boolean;
  /**
   * Scry destinations from the engine, enriched with the chooser's current
   * (in-flight) assignments. Always `null` for non-scry prompts.
   *
   * Renderers consume this directly instead of re-deriving from
   * `rawContext.destinationRules` + `rawContext.currentSelection.destinations`.
   * See `docs/player-interaction-rewrite.md` gap #16.
   */
  scryDestinations: PromptScryDestination[] | null;
  /**
   * Scry revealed cards from the engine, enriched with each card's current
   * destination assignment + order index. Always `null` for non-scry prompts.
   */
  scryRevealed: PromptScryRevealedCard[] | null;
};

/**
 * A scry destination row, derived from `ResolutionSelectionDestinationRule`
 * + the chooser's in-flight assignments in `currentSelection.destinations`.
 */
export type PromptScryDestination = {
  /** Stable id from `ResolutionSelectionDestinationRule.id`. */
  id: string;
  /** Engine zone (e.g. "deck-top", "deck-bottom", "play"). */
  zone: string;
  /** Free-form engine label (renderer can pass through; not yet a PromptKey). */
  label: string;
  min: number;
  max: number | null;
  remainder: boolean;
  /** Whether the chooser may reorder cards within the destination. */
  orderingEnabled: boolean;
  /** Card ids the chooser has tentatively assigned to this destination, in order. */
  currentCardIds: CardInstanceId[];
  /** Engine's exclusiveGroup hint, when set. */
  exclusiveGroup?: string;
};

/**
 * A revealed scry card, decorated with the chooser's current placement.
 */
export type PromptScryRevealedCard = {
  cardId: CardInstanceId;
  label: string;
  cardType?: "character" | "action" | "item" | "location";
  actionSubtype?: string;
  cost?: number;
  classifications?: string[];
  /** Destination this card is currently assigned to, or `null` if unassigned. */
  currentDestinationId: string | null;
  /** 0-based order within the assigned destination; `null` if unassigned. */
  orderIndex: number | null;
  /**
   * Destination ids whose `filters` (the engine's legality predicate) accept
   * this card. The remainder destination — which has no filter — is always
   * included. Renderers use this to highlight which cards may legally be
   * dropped on which non-remainder destination, e.g. when "to play" only
   * accepts actions of cost ≤ 6. Filters that depend on data the view layer
   * does not have (status, zone, exertion, …) are treated as a match so the
   * UI never under-highlights a legally-droppable card; the engine remains
   * the authority at submit time.
   */
  eligibleDestinationIds: string[];
};

export type PromptSlot = {
  /** Stable key from `SLOTTED_TARGET_SLOT_KEYS`. */
  key: string;
  /** Engine-aligned raw slot index (no UI offset). */
  index: number;
  /** Renderer copy key for the slot label (e.g. "From", "To"). */
  labelKey: PromptKey;
  /**
   * True when the engine has pre-resolved this slot (e.g. `from: { ref: "self" }`).
   * Renderer should hide editing affordances; the value is shown read-only.
   *
   * NOTE: derived heuristically until the engine surfaces it directly
   * (work-log gap #15). A slot is considered auto-resolved when the
   * engine's `currentSelection.targets[index]` equals the source card id
   * for self-targeting slot kinds (`move-damage:from`).
   */
  autoResolved: boolean;
  /**
   * True when the slot is filled and the chooser may not edit it. Initially
   * tracks `targetCardId !== null`; tighten when the engine exposes a
   * dedicated lock signal.
   */
  locked: boolean;
  /** Currently bound target id for this slot, or `null` when empty. */
  targetCardId: CardInstanceId | null;
};

/**
 * A pre-computed legal interaction the renderer can offer to the chooser.
 *
 * Each variant carries the EXACT engine submission payload, so the renderer
 * never constructs `ResolutionExecutionOptions` itself. Click handler is:
 * `engine.resolvePendingEffect(view.activePrompt.requestId, interaction.payload)`.
 *
 * Adding a new variant must cause `bun run check-types` to fail at every
 * exhaustive switch over `kind`. Use `assertNeverInteractionKind` for the
 * default branch.
 */
export type Interaction =
  | InteractionSelectCard
  | InteractionSelectPlayer
  | InteractionSelectChoice
  | InteractionAcceptOptional
  | InteractionDeclineOptional
  | InteractionDeclineTargetPrompt
  | InteractionNameCard
  | InteractionScryPlace
  | InteractionUnsupported;

export type InteractionSelectCard = {
  kind: "select-card";
  cardId: CardInstanceId;
  /** Index into the slot list when the prompt is slotted; 0 otherwise. */
  slotIndex: number;
  /** Engine submission payload for picking exactly this card. */
  payload: ResolutionExecutionOptions;
};

export type InteractionSelectPlayer = {
  kind: "select-player";
  playerId: PlayerId;
  payload: ResolutionExecutionOptions;
};

export type InteractionSelectChoice = {
  kind: "select-choice";
  index: number;
  /** Free-form label string emitted by the engine (already user-facing English from the card text). */
  label: string;
  legal: boolean;
  payload: ResolutionExecutionOptions;
};

export type InteractionAcceptOptional = {
  kind: "accept-optional";
  /** Free-form accept label from the engine (e.g. "Yes", "Banish target"). */
  acceptLabel: string;
  payload: ResolutionExecutionOptions;
};

export type InteractionDeclineOptional = {
  kind: "decline-optional";
  rejectLabel: string;
  payload: ResolutionExecutionOptions;
};

/**
 * For target-selection prompts that originated from a declined optional —
 * the chooser may still cancel. Submitting this resolves the optional as
 * declined without selecting any targets.
 */
export type InteractionDeclineTargetPrompt = {
  kind: "decline-target-prompt";
  payload: ResolutionExecutionOptions;
};

/**
 * Card-naming prompts. `payload` is a function because the named card is
 * only known at click time.
 */
export type InteractionNameCard = {
  kind: "name-card";
  buildPayload: (namedCard: string) => ResolutionExecutionOptions;
};

export type InteractionScryPlace = {
  kind: "scry-place";
  cardId: CardInstanceId;
  destinationId: string;
  orderIndex: number;
  payload: ResolutionExecutionOptions;
};

/**
 * Emitted when the engine surfaces a prompt the interaction layer doesn't
 * yet know how to bridge (e.g. new slotted kinds added to the engine before
 * the interaction package is updated). Renderers should show a "not yet
 * supported" banner instead of a blank locked screen.
 */
export type InteractionUnsupported = {
  kind: "unsupported";
  reason: string;
};

export type InteractionKind = Interaction["kind"];

export function assertNeverInteractionKind(kind: never): never {
  throw new Error(`unhandled interaction kind: ${JSON.stringify(kind)}`);
}

export type InteractionSubmission = {
  /**
   * The engine prompt this submission was built against. Presenters MUST
   * round-trip this value to `resolveEffect(requestId, payload)` so that
   * a stale submission (engine has advanced to a new prompt mid-click) is
   * rejected by the engine validator with `RESOLVE_EFFECT_NOT_PENDING`.
   *
   * `null` only when there is no active prompt.
   */
  requestId: string | null;
  /** True when the chooser has selected enough targets to submit. */
  canSubmit: boolean;
  /** True when the chooser may cancel the prompt (e.g. originated from optional). */
  canCancel: boolean;
  /** True when the engine fizzled the effect — UI should show "no legal targets" not a locked modal. */
  autoRejected: boolean;
  /** Pre-baked engine payload for the submit button; null when not yet submittable. */
  submitPayload: ResolutionExecutionOptions | null;
  /** Pre-baked engine payload for the cancel button; null when cancellation isn't available. */
  cancelPayload: ResolutionExecutionOptions | null;
};

/**
 * The unified, viewer-relative view-model. The renderer's *only* contract.
 *
 * Built purely from `LorcanaProjectedBoardView` + viewer id by
 * `buildPlayerInteractionView()`. No filter logic, no slot arithmetic, no
 * legality decisions are performed in the renderer.
 */
export type PlayerInteractionView = {
  viewerId: PlayerId;
  viewerRole: ViewerRole;
  activePrompt: ActivePrompt | null;
  surface: InteractionSurface;
  interactions: Interaction[];
  submission: InteractionSubmission;
  copy: PromptCopyDescriptor;
  /**
   * The full ordered queue of prompt-bearing effects on the board.
   * `activePrompt` corresponds to one entry in this list (or `null` when
   * the queue is empty). Renderers can show "1 of N pending prompts" or
   * let the chooser navigate.
   */
  promptQueue: PromptQueueEntry[];
  /**
   * Index into `promptQueue` of the active prompt. `-1` when there is no
   * active prompt.
   */
  activeQueueIndex: number;
  /**
   * The raw selection context the view was built from, exposed for
   * diagnostics / equivalence tests. Renderers should not branch on this —
   * always read `interactions`, `submission`, and `copy`.
   */
  rawContext: ResolutionSelectionContext | null;
};

/**
 * A summary of one prompt-bearing effect in the engine's queue. Exposes
 * just enough for the renderer to show a queue indicator; the full
 * details for the active entry live on `PlayerInteractionView`.
 */
export type PromptQueueEntry = {
  requestId: string;
  kind: ResolutionSelectionKind;
  chooserId: PlayerId;
  sourceCardId: CardInstanceId;
};
