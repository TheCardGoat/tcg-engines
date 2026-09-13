import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { giantTortoise } from "../cards/DOA/allies/giant-tortoise.ts";
import { trainingSword } from "../cards/AMB/weapons/training-sword.ts";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { createClassBonusTestChampion } from "./class-bonus-test-champion.ts";
import { passEffectsStack } from "./decisions.ts";
export function proveAdditionalSacrifice({
  card,
  cost,
  weapon,
}: {
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
  cost: number;
  weapon: boolean;
}): void {
  it("requires exactly one controlled object of the printed type before resolving", () => {
    const champion = createClassBonusTestChampion(card, false, "activation-discount"),
      sacrifice = weapon ? trainingSword : giantTortoise,
      wrong = weapon ? giantTortoise : trainingSword;
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          field: [trainingSword, giantTortoise],
          hand: [card, ...Array.from({ length: cost }, () => woodlandSquirrels)],
          "main-deck": [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
        },
      },
      playerTwo: { champion, zones: { field: [trainingSword, giantTortoise] } },
    });
    const p = game.player("player-one"),
      q = game.player("player-two"),
      paid = p.card(sacrifice),
      target = q.card(giantTortoise);
    const options = {
      reservePayment: p
        .cards(woodlandSquirrels, { zone: "hand" })
        .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
      ...(weapon ? { targets: { "target-1": [target.objectId] } } : {}),
    };
    for (const selection of [
      [],
      [q.card(sacrifice).objectId],
      [p.card(wrong).objectId],
      [paid.objectId, paid.objectId],
      [p.card(champion).objectId],
    ]) {
      const before = game.state;
      expect(() => p.activate(card, { ...options, costSelections: [selection] })).toThrow();
      expect(game.state).toEqual(before);
    }
    p.activate(card, { ...options, costSelections: [[paid.objectId]] });
    expect(game.state.objects[paid.objectId]!.zone).toBe(weapon ? "banishment" : "graveyard");
    expect(game.state.objects[q.card(sacrifice).objectId]!.zone).toBe("field");
    expect(p.zone("memory")).toHaveLength(cost);
    expect(p.zone("hand")).toHaveLength(0);
    expect(game.state.objects[target.objectId]!.damage).toBe(0);
    passEffectsStack(game);
    if (weapon) {
      expect(game.state.objects[target.objectId]!.damage).toBe(4);
      expect(p.zone("hand")).toHaveLength(0);
    } else {
      expect(p.zone("hand")).toHaveLength(2);
      expect(p.zone("main-deck")).toHaveLength(1);
      expect(q.zone("hand")).toHaveLength(0);
    }
  });
}
