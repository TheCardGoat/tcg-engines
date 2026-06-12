import { describe, expect, it } from "vite-plus/test";
import { isValidElement, type ReactNode } from "react";

import type { TurnTaggedLogEntry } from "../../game/adapter.ts";
import { toLogTurns, type CardLinkRenderer } from "./log-mapper.tsx";

const VIEWER = "player_one";
const OPPONENT = "player_two";

const entry = (partial: Partial<TurnTaggedLogEntry["entry"]>): TurnTaggedLogEntry => ({
  turnNumber: 0,
  entry: {
    id: 0,
    stateID: 1,
    timestamp: 0,
    type: "gundam.test",
    message: "",
    ...partial,
  },
});

/**
 * Stub card-link renderer — collapses to `[name:cardId]` so the test can
 * assert substitution without rendering JSX or touching the real
 * `<CardLink>` (which would transitively load CardInfoDialog + paraglide).
 */
const stubCardLink: CardLinkRenderer = (cardId, name) => `[${name}:${cardId}]`;

function flatten(node: ReactNode): string {
  if (node === null || node === undefined || typeof node === "boolean") return "";
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(flatten).join("");
  if (isValidElement(node)) {
    const props = node.props as { children?: ReactNode };
    return flatten(props.children ?? null);
  }
  return "";
}

describe("toLogTurns", () => {
  it("substitutes in-message card instance ids with card-link placeholders", () => {
    const resolve = (id: string) =>
      id === "inst-001" ? ({ name: "RX-78-2" } as { name: string }) : null;

    const turns = toLogTurns(
      [
        entry({
          type: "gundam.move.deployUnit",
          message: "player_one deployed inst-001 (cost 1).",
          playerId: VIEWER as never,
          data: { values: { playerId: VIEWER, cardId: "inst-001", cost: 1 } },
        }),
      ],
      VIEWER,
      OPPONENT,
      resolve as never,
      undefined,
      stubCardLink,
    );

    expect(turns).toHaveLength(1);
    const item = turns[0]!.groups[0]!.items[0]!;
    expect(flatten(item)).toBe("You deployed [RX-78-2:inst-001] (cost 1).");
  });

  it("appends card-links as a suffix when the message contains no id string", () => {
    const resolve = (id: string) =>
      id === "inst-hand-1" || id === "inst-hand-2"
        ? ({ name: "Test Unit" } as { name: string })
        : null;

    const turns = toLogTurns(
      [
        entry({
          type: "gundam.effect.cardsDrawn",
          message: "You drew 2 card(s).",
          playerId: VIEWER as never,
          cardIds: ["inst-hand-1", "inst-hand-2"],
          data: { values: { playerId: VIEWER, count: 2 } },
        }),
      ],
      VIEWER,
      OPPONENT,
      resolve as never,
      undefined,
      stubCardLink,
    );

    const item = turns[0]!.groups[0]!.items[0]!;
    expect(flatten(item)).toBe(
      "You drew 2 card(s). — [Test Unit:inst-hand-1], [Test Unit:inst-hand-2]",
    );
  });

  it("leaves the message as a plain string when no card ids can be resolved", () => {
    const turns = toLogTurns(
      [
        entry({
          type: "gundam.setup.firstPlayerChosen",
          message: "player_one chose player_one to go first.",
          data: { values: { chooser: VIEWER, chosen: VIEWER } },
        }),
      ],
      VIEWER,
      OPPONENT,
    );

    const item = turns[0]!.groups[0]!.items[0]!;
    expect(item).toBe("You chose You to go first.");
  });
});
