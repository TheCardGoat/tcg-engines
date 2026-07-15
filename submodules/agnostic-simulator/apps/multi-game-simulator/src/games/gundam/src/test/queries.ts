/**
 * Shared DOM queries for RTL specs. The simulator renders `data-card-id`
 * on multiple surfaces (battle-area card faces, Comms-log CardLinks,
 * CardHoverPreview), so "find this card on the battle area" needs to
 * exclude the log, hover preview, and — when relevant — the hand list.
 */

import type { DevRuntime } from "../game/dev-runtime.ts";

/**
 * Resolve card instance ids by their definition name via the engine's
 * `staticResources`. Needed because at small/medium sizes the
 * `ArtFallback` doesn't render card names into the DOM, so text-based
 * queries on the battle-area don't work in jsdom.
 *
 * Reads from `cardsMaps.definitions` first (which includes runtime-
 * registered tokens — see `project-board.ts`) and falls back to the
 * static catalog for definitions that live only there.
 *
 * Strips `g`/`y` flags from the incoming RegExp so repeated `.test()`
 * calls in the loop aren't affected by `lastIndex` advancement.
 */
export function findInstanceIdsByName(dev: DevRuntime, name: RegExp): string[] {
  const stableName =
    name.global || name.sticky ? new RegExp(name.source, name.flags.replace(/[gy]/g, "")) : name;

  const matches: string[] = [];
  for (const { instanceId, definitionId } of dev.staticResources.cardsMaps.instances.entries()) {
    const runtimeDef = dev.staticResources.cardsMaps.definitions.get(definitionId) as
      | { name?: string }
      | undefined;
    const def =
      runtimeDef ??
      (dev.staticResources.getDefinition(definitionId) as { name?: string } | undefined);
    if (def?.name && stableName.test(def.name)) matches.push(instanceId);
  }
  return matches;
}

interface FindOnBattleAreaOptions {
  /** Exclude matches whose ancestor is this element (typically the hand list). */
  readonly excludeWithin?: HTMLElement | null;
}

/**
 * Return every `[data-card-id="<id>"]` element that is part of the
 * in-play board surface. Filters out:
 *   - anything inside a `role="log"` ancestor (Comms-log CardLinks),
 *   - anything inside an `aria-hidden="true"` ancestor (CardHoverPreview),
 *   - any `<button>` element (CardFace is nested under the card layout item),
 *   - anything inside `excludeWithin` (typically the viewer's hand list).
 */
export function findCardsById(
  cardId: string,
  options: FindOnBattleAreaOptions = {},
): HTMLElement[] {
  const { excludeWithin } = options;
  // Escape so ids containing quotes/backslashes don't break the selector —
  // matches `AttackTargetingOverlayContainer.measureRect`. `CSS` isn't
  // always present in jsdom, so fall back to a manual escape.
  const escaped =
    typeof CSS !== "undefined" && typeof CSS.escape === "function"
      ? CSS.escape(cardId)
      : cardId.replace(/["\\\n\r\f]/g, (ch) => `\\${ch}`);
  const selector = `[data-card-id="${escaped}"]`;
  return [...document.querySelectorAll<HTMLElement>(selector)].filter((el) => {
    if (excludeWithin?.contains(el)) return false;
    if (el.closest("[aria-hidden='true']")) return false;
    if (el.closest("[role='log']")) return false;
    if (el.tagName === "BUTTON") return false;
    return true;
  });
}

/**
 * Return in-play cards with the given definition name — resolves the
 * instance ids via `staticResources` (text-based queries don't work
 * because `ArtFallback` only renders names at scale ≥ 0.75, and
 * battle-area/hand sizes are smaller than that).
 */
export function findCardsByName(
  dev: DevRuntime,
  name: RegExp,
  options: FindOnBattleAreaOptions = {},
): HTMLElement[] {
  const ids = findInstanceIdsByName(dev, name);
  return ids.flatMap((id) => findCardsById(id, options));
}
