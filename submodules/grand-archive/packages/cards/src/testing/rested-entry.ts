import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { createClassBonusTestChampion } from "./class-bonus-test-champion.ts";
import { passEffectsStack, advanceToMain } from "./decisions.ts";

export function proveRestedEntry({
  card,
  cost,
}: {
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
  cost: { kind: "reserve" | "memory"; amount: number };
}): void {
  it("enters rested only upon resolution and wakes in its controller's next wake-up phase", () => {
    const champion = createClassBonusTestChampion(card, false, "activation-discount");
    const payments = Array.from({ length: cost.amount }, () => woodlandSquirrels);
    const game = GrandArchiveTestEngine.startFixture({
      phase: cost.kind === "memory" ? "materialize" : "main",
      playerOne: {
        champion,
        zones: {
          hand: cost.kind === "reserve" ? [card, ...payments] : [],
          memory: cost.kind === "memory" ? payments : [],
          "material-deck": cost.kind === "memory" ? [card] : [],
          "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
        },
      },
      playerTwo: {
        champion,
        zones: { "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels) },
      },
    });
    const p = game.player("player-one"),
      q = game.player("player-two");
    if (cost.kind === "memory") p.materialize(card);
    else
      p.activate(card, {
        reservePayment: p
          .cards(woodlandSquirrels, { zone: "hand" })
          .map((c) => ({ kind: "card", cardId: c.objectId })),
      });
    expect(p.cards(card, { zone: "field" })).toHaveLength(0);
    passEffectsStack(game);
    const id = p.card(card, { zone: "field" }).objectId;
    expect(game.state.objects[id]!.states.has("rested")).toBe(true);
    advanceToMain(game, q.id);
    expect(game.state.objects[id]!.states.has("rested")).toBe(true);
    advanceToMain(game, p.id);
    expect(game.state.objects[id]!.states.has("rested")).toBe(false);
  });
}
