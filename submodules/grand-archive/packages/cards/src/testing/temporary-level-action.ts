import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { createClassBonusTestChampion } from "./class-bonus-test-champion.ts";
import { passEffectsStack, advanceToMain } from "./decisions.ts";

export function proveTemporaryLevelAction({
  card,
  cost,
  amount,
  draw = 0,
}: {
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
  cost: number;
  amount: number;
  draw?: number;
}): void {
  it(`pays ${cost}, gains ${amount} level on resolution, and loses it at the end of the turn`, () => {
    const champion = createClassBonusTestChampion(card, false, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          hand: [card, ...Array.from({ length: cost }, () => woodlandSquirrels)],
          "main-deck": [woodlandSquirrels, woodlandSquirrels],
        },
      },
      playerTwo: { champion, zones: { "main-deck": [woodlandSquirrels, woodlandSquirrels] } },
    });
    const p = game.player("player-one"),
      q = game.player("player-two");
    const level = (playerId: string) =>
      deriveGrandArchiveNumericProperty(
        game.state.objects[game.player(playerId).card(champion).objectId]!,
        "level",
        {
          program: game.program,
          state: game.state,
          controllerId: game.player(playerId).id,
          bindings: {},
        },
      );
    const payments = p
      .cards(woodlandSquirrels, { zone: "hand" })
      .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
    if (cost > 0) {
      const before = game.state;
      expect(() => p.activate(card, { reservePayment: payments.slice(1) })).toThrow();
      expect(game.state).toEqual(before);
    }
    p.activate(card, { reservePayment: payments });
    expect(level(p.id)).toBe(0);
    expect(p.zone("hand")).toHaveLength(0);
    passEffectsStack(game);
    expect(level(p.id)).toBe(amount);
    expect(level(q.id)).toBe(0);
    expect(p.zone("hand")).toHaveLength(draw);
    advanceToMain(game, q.id);
    expect(level(p.id)).toBe(0);
    expect(level(q.id)).toBe(0);
  });
}
