import { Fragment, type ReactNode } from "react";

import type { EngineAdapter, TurnTaggedMoveLog } from "../../game/adapter.ts";
import type { GundamMoveLog, GundamMoveOutcomes } from "@tcg/gundam-engine";
import type { LogItem, LogTurn } from "../ui/types.ts";
import type { CardLinkRenderer, LogPrettyNames } from "./log-mapper.tsx";

const DEFAULT_CARD_LINK: CardLinkRenderer = (_cardId, name) => name;
type Segment = { readonly key: string; readonly node: ReactNode };

function cardNode(
  cardId: string,
  resolveCard: EngineAdapter["cardDefinitionOf"],
  renderCardLink: CardLinkRenderer,
  key: string,
): ReactNode {
  if (cardId === "direct") return "direct";
  const name = resolveCard(cardId)?.name ?? cardId;
  return renderCardLink(cardId, name, key);
}

function segment(key: string, node: ReactNode): Segment {
  return { key, node };
}

function sentence(parts: readonly Segment[]): ReactNode {
  return (
    <>
      {parts.map((part) => (
        <Fragment key={part.key}>{part.node}</Fragment>
      ))}
    </>
  );
}

function prettyPlayer(playerId: string, viewerId: string, prettyNames: LogPrettyNames): string {
  return playerId === viewerId ? prettyNames.self : prettyNames.opponent;
}

function visibleCardIds(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((id): id is string => typeof id === "string");
  if (
    typeof value === "object" &&
    value !== null &&
    "value" in value &&
    Array.isArray((value as { value?: unknown }).value)
  ) {
    return (value as { value: unknown[] }).value.filter(
      (id): id is string => typeof id === "string",
    );
  }
  return [];
}

function outcomeItems(
  outcomes: GundamMoveOutcomes | undefined,
  resolveCard: EngineAdapter["cardDefinitionOf"],
  renderCardLink: CardLinkRenderer,
): ReactNode[] {
  if (!outcomes) return [];
  const items: ReactNode[] = [];

  for (const damage of outcomes.damageDealt ?? []) {
    items.push(
      sentence([
        segment(
          `damage-target-${damage.targetId}`,
          cardNode(
            damage.targetId,
            resolveCard,
            renderCardLink,
            `damage-target-${damage.targetId}`,
          ),
        ),
        segment("text", ` took ${damage.amount} damage.`),
      ]),
    );
  }

  for (const shield of outcomes.shieldsRemoved ?? []) {
    items.push(
      sentence([
        segment(
          `shield-${shield.cardId}`,
          cardNode(shield.cardId, resolveCard, renderCardLink, `shield-${shield.cardId}`),
        ),
        segment("text", " lost a shield."),
      ]),
    );
  }

  for (const defeated of outcomes.unitsDefeated ?? []) {
    items.push(
      sentence([
        segment(
          `defeated-${defeated.cardId}`,
          cardNode(defeated.cardId, resolveCard, renderCardLink, `defeated-${defeated.cardId}`),
        ),
        segment("text", " was defeated."),
      ]),
    );
  }

  if (outcomes.cardsDrawn) {
    const cards = visibleCardIds(outcomes.cardsDrawn.cardIds);
    if (cards.length > 0) {
      items.push(
        sentence([
          segment("prefix", `Drew ${outcomes.cardsDrawn.count}: `),
          ...cards.flatMap((id, index) => [
            segment(`drawn-separator-${index}`, index > 0 ? ", " : ""),
            segment(
              `drawn-${id}-${index}`,
              cardNode(id, resolveCard, renderCardLink, `drawn-${id}-${index}`),
            ),
          ]),
          segment("suffix", "."),
        ]),
      );
    } else {
      items.push(`Drew ${outcomes.cardsDrawn.count} card(s).`);
    }
  }

  if (outcomes.resourcesSpent) {
    items.push(
      `Spent ${outcomes.resourcesSpent.regularCount} resources and removed ${outcomes.resourcesSpent.exRemovedCount} EX tokens.`,
    );
  }

  for (const id of outcomes.cardsDiscarded ?? []) {
    items.push(
      sentence([
        segment("prefix", "Discarded "),
        segment(`discarded-${id}`, cardNode(id, resolveCard, renderCardLink, `discarded-${id}`)),
        segment("suffix", "."),
      ]),
    );
  }

  for (const id of outcomes.unitsRested ?? []) {
    items.push(
      sentence([
        segment(`rested-${id}`, cardNode(id, resolveCard, renderCardLink, `rested-${id}`)),
        segment("text", " was rested for cost."),
      ]),
    );
  }

  for (const moved of outcomes.cardsMoved ?? []) {
    items.push(
      sentence([
        segment(
          `moved-${moved.cardId}`,
          cardNode(moved.cardId, resolveCard, renderCardLink, `moved-${moved.cardId}`),
        ),
        segment("text", ` moved${moved.from ? ` from ${moved.from}` : ""} to ${moved.to}.`),
      ]),
    );
  }

  for (const id of outcomes.cardsReturnedToHand ?? []) {
    items.push(
      sentence([
        segment(`returned-${id}`, cardNode(id, resolveCard, renderCardLink, `returned-${id}`)),
        segment("text", " returned to hand."),
      ]),
    );
  }

  for (const id of outcomes.cardsExhausted ?? []) {
    items.push(
      sentence([
        segment(`exhausted-${id}`, cardNode(id, resolveCard, renderCardLink, `exhausted-${id}`)),
        segment("text", " was exhausted."),
      ]),
    );
  }

  for (const id of outcomes.cardsReadied ?? []) {
    items.push(
      sentence([
        segment(`readied-${id}`, cardNode(id, resolveCard, renderCardLink, `readied-${id}`)),
        segment("text", " was readied."),
      ]),
    );
  }

  for (const placed of outcomes.resourcesPlaced ?? []) {
    items.push(
      sentence([
        segment(
          `resource-${placed.cardId}`,
          cardNode(placed.cardId, resolveCard, renderCardLink, `resource-${placed.cardId}`),
        ),
        segment("text", ` was placed as a ${placed.state} resource.`),
      ]),
    );
  }

  for (const effect of outcomes.effectsQueued ?? []) {
    items.push(
      sentence([
        segment(
          `queued-${effect.sourceCardId}`,
          cardNode(
            effect.sourceCardId,
            resolveCard,
            renderCardLink,
            `queued-${effect.sourceCardId}`,
          ),
        ),
        segment("text", ` queued ${effect.kind}.`),
      ]),
    );
  }

  for (const effect of outcomes.effectsResolved ?? []) {
    items.push(
      sentence([
        segment(
          `resolved-${effect.sourceCardId}`,
          cardNode(
            effect.sourceCardId,
            resolveCard,
            renderCardLink,
            `resolved-${effect.sourceCardId}`,
          ),
        ),
        segment("text", " resolved an effect."),
      ]),
    );
  }

  return items;
}

function primaryItem(
  log: GundamMoveLog,
  resolveCard: EngineAdapter["cardDefinitionOf"],
  renderCardLink: CardLinkRenderer,
  viewerId: string,
  prettyNames: LogPrettyNames,
): ReactNode {
  switch (log.type) {
    case "deployUnit":
      return sentence([
        segment("prefix", "Deployed "),
        segment("card", cardNode(log.cardId, resolveCard, renderCardLink, "deployUnit")),
        segment("suffix", "."),
      ]);
    case "deployBase":
      return sentence([
        segment("prefix", "Deployed base "),
        segment("card", cardNode(log.cardId, resolveCard, renderCardLink, "deployBase")),
        segment("suffix", "."),
      ]);
    case "playCommand":
      return sentence([
        segment("prefix", "Played "),
        segment("card", cardNode(log.cardId, resolveCard, renderCardLink, "playCommand")),
        segment("suffix", "."),
      ]);
    case "assignPilot":
      return sentence([
        segment("prefix", "Paired "),
        segment("pilot", cardNode(log.pilotId, resolveCard, renderCardLink, "pilot")),
        segment("middle", " with "),
        segment("unit", cardNode(log.unitId, resolveCard, renderCardLink, "unit")),
        segment("suffix", "."),
      ]);
    case "attack":
      return sentence([
        segment("prefix", "Attacked "),
        segment("target", cardNode(log.targetId, resolveCard, renderCardLink, "attack-target")),
        segment("middle", " with "),
        segment("attacker", cardNode(log.attackerId, resolveCard, renderCardLink, "attacker")),
        segment("suffix", "."),
      ]);
    case "block":
      return sentence([
        segment("prefix", "Blocked "),
        segment(
          "attacker",
          cardNode(log.attackerId, resolveCard, renderCardLink, "blocked-attacker"),
        ),
        segment("middle", " with "),
        segment("blocker", cardNode(log.blockerId, resolveCard, renderCardLink, "blocker")),
        segment("suffix", "."),
      ]);
    case "resolveEffect":
      return sentence([
        segment("prefix", "Resolved effect from "),
        segment("source", cardNode(log.sourceCardId, resolveCard, renderCardLink, "effect-source")),
        segment("suffix", "."),
      ]);
    case "pass":
      return `Passed (${log.context}).`;
    case "turnStart":
      return `${prettyPlayer(String(log.activePlayerId), viewerId, prettyNames)} started the turn.`;
    case "gameEnd":
      return `Game ended: ${log.reason}.`;
    default: {
      const exhaustive: never = log;
      throw new Error(`Unhandled structured log type: ${(exhaustive as { type?: string }).type}`);
    }
  }
}

export function toStructuredLogTurns(
  logs: readonly TurnTaggedMoveLog[],
  viewerId: string,
  resolveCard: EngineAdapter["cardDefinitionOf"] = () => null,
  prettyNames: LogPrettyNames,
  renderCardLink: CardLinkRenderer = DEFAULT_CARD_LINK,
): LogTurn[] {
  const byTurn = new Map<number, TurnTaggedMoveLog[]>();
  for (const tagged of logs) {
    const bucket = byTurn.get(tagged.turnNumber);
    if (bucket) bucket.push(tagged);
    else byTurn.set(tagged.turnNumber, [tagged]);
  }

  return [...byTurn.entries()]
    .sort(([a], [b]) => a - b)
    .map(([turn, bucket]) => {
      const groups: LogItem[] = [];
      let current: { author: string; items: ReactNode[] } | null = null;

      for (const { log } of bucket) {
        const author = String(log.playerId);
        const items = [
          primaryItem(log, resolveCard, renderCardLink, viewerId, prettyNames),
          ...outcomeItems(log.outcomes, resolveCard, renderCardLink),
        ];

        if (!current || current.author !== author) {
          if (current) {
            groups.push({
              who: current.author === viewerId ? "YOU" : "OPPONENT",
              items: current.items,
            });
          }
          current = { author, items };
        } else {
          current.items.push(...items);
        }
      }

      if (current) {
        groups.push({
          who: current.author === viewerId ? "YOU" : "OPPONENT",
          items: current.items,
        });
      }

      return { turn, groups };
    })
    .filter((turn) => turn.groups.length > 0);
}
