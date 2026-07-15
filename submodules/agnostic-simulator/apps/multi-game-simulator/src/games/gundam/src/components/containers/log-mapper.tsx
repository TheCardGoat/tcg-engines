import { Fragment, type ReactNode } from "react";

import type { EngineAdapter, TurnTaggedLogEntry } from "../../game/adapter.ts";
import type { LogItem, LogTurn } from "../ui/types.ts";

export interface LogPrettyNames {
  readonly self: string;
  readonly opponent: string;
}

/**
 * Renders a single inline card-link — the concrete React component lives in
 * `ui/CardLink.tsx`, but the mapper takes it as an injected prop so tests
 * (and any other non-UI consumer) don't transitively drag in the whole
 * CardInfoDialog/paraglide chain via a static import.
 */
export type CardLinkRenderer = (cardId: string, name: string, key: string) => ReactNode;

const DEFAULT_PRETTY_NAMES: LogPrettyNames = { self: "You", opponent: "Opponent" };

const DEFAULT_CARD_LINK: CardLinkRenderer = (_cardId, name) => name;

/**
 * Best-effort author attribution for a log entry. The engine's public
 * `GameLogEntry.playerId` isn't always populated (setup logs emit via
 * `emitGundamLog` which doesn't set it), so we also peek at
 * `data.values.{playerId, chooser}` which the payload-builders in
 * `packages/engine/src/gundam/moves/setup/*` DO carry.
 *
 * Returns `null` for pure system entries (phase transitions, game over,
 * etc.) — the caller decides whether to drop them or attach to the
 * turn's active player.
 */
function authorOf(entry: TurnTaggedLogEntry["entry"]): string | null {
  if (entry.playerId) return String(entry.playerId);
  const data = (entry.data as Record<string, unknown> | undefined) ?? {};
  const values = (data.values as Record<string, unknown> | undefined) ?? {};
  const fallback = values.playerId ?? values.chooser;
  return typeof fallback === "string" ? fallback : null;
}

/** Escape a string for use in a RegExp literal. */
function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Rewrite raw engine player ids (`player_one`, UUIDs, whatever the runtime
 * is seated with) to localised pretty names in a rendered log message.
 * Uses word-boundary matching so we don't clobber substrings that happen
 * to coincide with an id.
 */
function prettifyPlayerIds(
  message: string,
  viewerId: string,
  opponentId: string | null,
  prettyNames: LogPrettyNames,
): string {
  let out = message.replace(new RegExp(`\\b${escapeRegExp(viewerId)}\\b`, "g"), prettyNames.self);
  if (opponentId) {
    out = out.replace(new RegExp(`\\b${escapeRegExp(opponentId)}\\b`, "g"), prettyNames.opponent);
  }
  return out;
}

/**
 * Keys on `entry.data.values` that are known to carry a card INSTANCE id in
 * the Gundam engine's log payloads. Extracted per move template in
 * `packages/engine/messages/en.json` — anything we'd otherwise render as a
 * raw id string gets the CardLink substitution treatment.
 */
const CARD_ID_VALUE_KEYS = [
  "cardId",
  "attackerId",
  "targetId",
  "blockerId",
  "pilotId",
  "unitId",
  "chosenId",
] as const;

function collectCardIdCandidates(entry: TurnTaggedLogEntry["entry"]): string[] {
  const candidates = new Set<string>();
  for (const id of entry.cardIds ?? []) candidates.add(id);

  const values = (entry.data as { values?: Record<string, unknown> } | undefined)?.values ?? {};
  for (const key of CARD_ID_VALUE_KEYS) {
    const v = values[key];
    if (typeof v === "string") candidates.add(v);
  }
  const arr = values["cardIds"];
  if (Array.isArray(arr)) {
    for (const v of arr) if (typeof v === "string") candidates.add(v);
  }

  return [...candidates];
}

/**
 * Render a single log entry as a `ReactNode` item for the sidebar. Player
 * ids in the pre-rendered message are rewritten to pretty names. Any card
 * instance ids the adapter can resolve become interactive
 * `<CardLink>` elements:
 *
 *  - If the id appears inside the message string (most move templates
 *    interpolate `{cardId}` inline), the raw id is replaced in-place.
 *  - Otherwise the card names are appended after the message as a
 *    comma-separated list (e.g. for the PRIVATE `cardsDrawn` entry whose
 *    template is count-only but whose payload carries the drawn ids).
 */
function renderEntryItem(
  entry: TurnTaggedLogEntry["entry"],
  viewerId: string,
  opponentId: string | null,
  resolveCard: (id: string) => { name: string } | null,
  prettyNames: LogPrettyNames,
  renderCardLink: CardLinkRenderer,
): ReactNode {
  const prettyMessage = prettifyPlayerIds(entry.message, viewerId, opponentId, prettyNames);

  const candidates = collectCardIdCandidates(entry);
  const idToName = new Map<string, string>();
  for (const id of candidates) {
    const def = resolveCard(id);
    if (def) idToName.set(id, def.name);
  }
  if (idToName.size === 0) return prettyMessage;

  // Try inline substitution first — any id that appears in the message is
  // replaced in-place with a CardLink. Record which ids matched so we only
  // append the leftovers as a suffix.
  const ids = [...idToName.keys()];
  const pattern = new RegExp(`(${ids.map(escapeRegExp).join("|")})`, "g");
  const matched = new Set<string>();
  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  pattern.lastIndex = 0;
  while ((match = pattern.exec(prettyMessage)) !== null) {
    if (match.index > lastIndex) parts.push(prettyMessage.slice(lastIndex, match.index));
    const id = match[0];
    const name = idToName.get(id) ?? id;
    matched.add(id);
    parts.push(renderCardLink(id, name, `${id}-${match.index}`));
    lastIndex = match.index + id.length;
  }
  if (lastIndex < prettyMessage.length) parts.push(prettyMessage.slice(lastIndex));

  const leftovers = ids.filter((id) => !matched.has(id));
  if (leftovers.length === 0) return <>{parts}</>;

  return (
    <>
      {parts}
      {" — "}
      {leftovers.map((id, i) => (
        <Fragment key={id}>
          {i > 0 ? ", " : null}
          {renderCardLink(id, idToName.get(id) ?? id, id)}
        </Fragment>
      ))}
    </>
  );
}

/**
 * Collapse the engine's flat log trail into the `LogTurn[]` shape the
 * sidebar's `EventLog` expects: one section per turn, containing groups of
 * consecutive same-author entries tagged YOU / OPPONENT. Player ids in
 * each entry's rendered message are rewritten to pretty names, and any
 * card-instance ids carried on the entry become inline `<CardLink>`
 * references when the adapter can resolve them.
 *
 * System entries without an author are dropped for now — the setup flow's
 * user-relevant entries (firstPlayerChosen, mulligan, deployments) all
 * carry an author through one of the paths in {@link authorOf}.
 */
export function toLogTurns(
  entries: readonly TurnTaggedLogEntry[],
  viewerId: string,
  opponentId: string | null = null,
  resolveCard: EngineAdapter["cardDefinitionOf"] = () => null,
  prettyNames: LogPrettyNames = DEFAULT_PRETTY_NAMES,
  renderCardLink: CardLinkRenderer = DEFAULT_CARD_LINK,
): LogTurn[] {
  const byTurn = new Map<number, TurnTaggedLogEntry[]>();
  for (const tagged of entries) {
    const bucket = byTurn.get(tagged.turnNumber);
    if (bucket) bucket.push(tagged);
    else byTurn.set(tagged.turnNumber, [tagged]);
  }

  const turnNumbers = [...byTurn.keys()].sort((a, b) => a - b);
  const result: LogTurn[] = [];

  for (const turn of turnNumbers) {
    const bucket = byTurn.get(turn) ?? [];
    const groups: LogItem[] = [];
    let current: { author: string; items: ReactNode[] } | null = null;

    for (const { entry } of bucket) {
      if (!entry.message) continue; // PUBLIC_WITH_OVERRIDES leaves this empty.
      const author = authorOf(entry);
      if (author === null) continue;
      const item = renderEntryItem(
        entry,
        viewerId,
        opponentId,
        resolveCard,
        prettyNames,
        renderCardLink,
      );

      if (!current || current.author !== author) {
        if (current) {
          groups.push({
            who: current.author === viewerId ? "YOU" : "OPPONENT",
            items: current.items,
          });
        }
        current = { author, items: [item] };
      } else {
        current.items.push(item);
      }
    }
    if (current) {
      groups.push({
        who: current.author === viewerId ? "YOU" : "OPPONENT",
        items: current.items,
      });
    }

    if (groups.length > 0) {
      result.push({ turn, groups });
    }
  }

  return result;
}
