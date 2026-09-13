import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../cards/DOA/allies/giant-tortoise.ts";
import { createClassBonusTestChampion } from "./class-bonus-test-champion.ts";
import { passEffectsStack, advanceToMain, answerDecision } from "./decisions.ts";
export function proveAllyBuffAction({
  card,
  cost,
  lifeBonus,
  powerBonus,
  classBonus = false,
  targeted = false,
  permanent = false,
}: {
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
  cost: number;
  lifeBonus: number;
  powerBonus: number;
  classBonus?: boolean;
  targeted?: boolean;
  permanent?: boolean;
}): void {
  it(`buffs only the intended existing allies, class=${classBonus}, and ${permanent ? "keeps counters" : "expires at end of turn"}`, () => {
    const champion = createClassBonusTestChampion(card, classBonus, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          hand: [card, ...Array.from({ length: cost + 1 }, () => woodlandSquirrels)],
          field: [woodlandSquirrels, woodlandSquirrels],
          "main-deck": [woodlandSquirrels],
        },
      },
      playerTwo: { champion, zones: { field: [giantTortoise], "main-deck": [woodlandSquirrels] } },
    });
    const p = game.player("player-one"),
      q = game.player("player-two"),
      allies = p.cards(woodlandSquirrels, { zone: "field" });
    const first = allies[0]!,
      second = allies[1]!,
      late = p.cards(woodlandSquirrels, { zone: "hand" })[0]!;
    const stat = (id: typeof first.objectId, property: "power" | "life") =>
      deriveGrandArchiveNumericProperty(game.state.objects[id]!, property, {
        program: game.program,
        state: game.state,
        controllerId: p.id,
        bindings: {},
      });
    const payment = p
      .cards(woodlandSquirrels, { zone: "hand" })
      .slice(1)
      .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
    if (targeted) {
      const before = game.state;
      expect(() =>
        p.activate(card, {
          reservePayment: payment,
          targets: { "target-1": [q.card(giantTortoise).objectId] },
        }),
      ).toThrow();
      expect(game.state).toEqual(before);
    }
    p.activate(card, {
      reservePayment: payment,
      ...(targeted ? { targets: { "target-1": [first.objectId] } } : {}),
    });
    expect(stat(first.objectId, "life")).toBe(1);
    passEffectsStack(game);
    expect(stat(first.objectId, "life")).toBe(1 + lifeBonus);
    expect(stat(first.objectId, "power")).toBe(1 + powerBonus);
    expect(stat(second.objectId, "life")).toBe(targeted ? 1 : 1 + lifeBonus);
    expect(stat(q.card(giantTortoise).objectId, "life")).toBe(6);
    p.activate(late);
    passEffectsStack(game);
    expect(stat(late.objectId, "life")).toBe(1);
    expect(stat(late.objectId, "power")).toBe(1);
    p.declareAttack(first, q.card(giantTortoise));
    for (let step = 0; game.state.combat && step < 64; step++) {
      if (game.state.decision?.kind === "choose-retaliators")
        answerDecision(game, "choose-retaliators", [q.card(giantTortoise).objectId]);
      else {
        const wait = game.waitState();
        if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
        game.player(wait.playerId).pass();
      }
    }
    expect(game.state.combat).toBeNull();
    expect(game.state.objects[first.objectId]!.zone).toBe("field");
    expect(game.state.objects[first.objectId]!.damage).toBe(1);
    expect(game.state.objects[q.card(giantTortoise).objectId]!.damage).toBe(1 + powerBonus);
    advanceToMain(game, q.id);
    expect(stat(first.objectId, "life")).toBe(permanent ? 1 + lifeBonus : 1);
    expect(stat(first.objectId, "power")).toBe(permanent ? 1 + powerBonus : 1);
  });
}
