/**
 * Prompt copy keys.
 *
 * The interaction view emits *structured copy intents* (a key + params object),
 * never formatted strings. The renderer (e.g. the Svelte simulator) is the
 * only layer that knows about i18n / Paraglide and translates these keys at
 * render time using the viewer's locale.
 *
 * Add new keys here when a new prompt surface needs new copy. Renderers must
 * supply translations for every key in this union, enforced via discriminated
 * exhaustiveness in the renderer's `render-prompt-copy.ts`.
 */
export type PromptKey =
  // Generic titles / details
  | "prompt.target.choose-card"
  | "prompt.target.choose-cards"
  | "prompt.target.choose-up-to"
  | "prompt.target.choose-player"
  | "prompt.target.no-legal-targets"
  | "prompt.choice.choose-one"
  | "prompt.optional.accept-or-decline"
  | "prompt.scry.reorder"
  | "prompt.name-card.title"
  | "prompt.discard.choose-cards"
  // Slotted-target slot labels
  | "prompt.slot.move-damage.from"
  | "prompt.slot.move-damage.to"
  | "prompt.slot.move-to-location.subject"
  | "prompt.slot.move-to-location.location"
  | "prompt.slot.shift-and-choose.chosen"
  | "prompt.slot.banish-and-play.banish"
  | "prompt.slot.banish-and-play.play"
  // Common option / action labels
  | "prompt.optional.accept"
  | "prompt.optional.decline"
  | "prompt.target.cancel"
  | "prompt.submit"
  // Filter badges (informational chips next to the target list)
  | "prompt.badge.cost-le"
  | "prompt.badge.cost-ge"
  | "prompt.badge.strength-le"
  | "prompt.badge.strength-ge"
  | "prompt.badge.willpower-le"
  | "prompt.badge.willpower-ge"
  | "prompt.badge.lore-le"
  | "prompt.badge.lore-ge"
  | "prompt.badge.classification"
  | "prompt.badge.card-type"
  | "prompt.badge.has-keyword"
  | "prompt.badge.opposing"
  | "prompt.badge.your"
  | "prompt.badge.exerted"
  | "prompt.badge.ready"
  | "prompt.badge.damaged"
  | "prompt.badge.undamaged"
  | "prompt.badge.zone"
  | "prompt.badge.unsupported"
  // Free-form effect-derived labels: rendered by passing the engine's option
  // string through verbatim. The renderer is expected to translate generic
  // sentences via a separate "effect-text" channel; the interaction package
  // does not introspect their content.
  | "prompt.choice.option-from-engine";

export type PromptCopyParams = Record<string, string | number>;

export type PromptCopyDescriptor = {
  titleKey: PromptKey;
  titleParams: PromptCopyParams;
  detailKey?: PromptKey;
  detailParams?: PromptCopyParams;
  /** A list of badges describing the active filter constraints. UI-side i18n owns rendering. */
  badges: PromptCopyBadge[];
};

export type PromptCopyBadge = {
  /** Stable id for keyed rendering; not user-visible. */
  id: string;
  key: PromptKey;
  params: PromptCopyParams;
  /** "warning" indicates the engine flagged this filter as unsupported / informational only. */
  variant: "default" | "warning";
};
