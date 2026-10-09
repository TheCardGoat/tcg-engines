import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import {
  deriveGrandArchiveCharacteristics,
  deriveGrandArchiveNumericProperty,
} from "@tcg/grand-archive-engine/runtime";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { trainingSword } from "../cards/AMB/weapons/training-sword.ts";
import { beseechTheWinds } from "../cards/DOA/actions/beseech-the-winds.ts";
import { reclaim } from "../cards/DOA/actions/reclaim.ts";
import { lineageTestChampion } from "./champion-lineage.ts";
import { enableAllTestElements } from "./class-bonus-test-champion.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "./decisions.ts";
type Card = GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
type Scenario = {
  identity: "wrong" | "matching" | "buried" | "current";
  count: number;
  mode: "own" | "opponent" | "expired" | "activated";
};
export function proveRestFatestoneTransform(
  card: Card,
  abilityId: string,
  baseCost: number,
  discount = false,
) {
  if (card.layout.kind !== "double-faced") throw new Error("Expected double-faced card");
  const flip = card.layout.flipFace;
  const scenarios: Scenario[] = (["wrong", "matching", "buried", "current"] as const).map(
    (identity) => ({
      identity,
      count: 0,
      mode: "own" as const,
    }),
  );
  if (discount) {
    for (const count of [1, 2, 3, 4]) scenarios.push({ identity: "matching", count, mode: "own" });
    for (const mode of ["opponent", "expired", "activated"] as const)
      scenarios.push({ identity: "matching", count: 2, mode });
  }
  for (const { identity, count, mode } of scenarios)
    it(`transforms with exact rest/reserve costs: identity=${identity}, materializations=${count}, mode=${mode}`, () => {
      const champion = enableAllTestElements(
        lineageTestChampion(
          identity === "matching" || identity === "buried" ? "Guo Jia" : "Other",
          0,
        ),
      );
      const lineage =
        identity === "buried" || identity === "current"
          ? [
              enableAllTestElements(
                lineageTestChampion(identity === "current" ? "Guo Jia" : "Other", 1),
              ),
            ]
          : [];
      const opponent = enableAllTestElements(lineageTestChampion("Guo Jia", 0));
      const game = GrandArchiveTestEngine.startFixture({
        firstPlayer: mode === "opponent" ? "playerTwo" : "playerOne",
        playerOne: {
          champion,
          lineage,
          zones: {
            field: [card],
            hand: [
              reclaim,
              ...Array.from({ length: count }, () => beseechTheWinds),
              ...Array.from({ length: 9 + 3 * count }, () => woodlandSquirrels),
            ],
            "material-deck": Array.from({ length: count }, () => trainingSword),
            "main-deck": [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
          },
        },
        playerTwo: {
          champion: opponent,
          zones: {
            field: [card],
            hand: [
              ...Array.from({ length: count }, () => beseechTheWinds),
              ...Array.from({ length: 3 * count }, () => woodlandSquirrels),
            ],
            "material-deck": Array.from({ length: count }, () => trainingSword),
            "main-deck": [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
          },
        },
      });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        source = p.card(card),
        other = q.card(card);
      const actor = mode === "opponent" ? q : p;
      const pay = (player: typeof p, n: number) =>
        player
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, n)
          .map((ref) => ({ kind: "card" as const, cardId: ref.objectId }));
      for (let i = 0; i < count; i++) {
        if (mode === "activated") {
          p.activate(p.cards(woodlandSquirrels, { zone: "hand" })[0]!);
          passEffectsStack(game);
          continue;
        }
        actor.activate(actor.cards(beseechTheWinds, { zone: "hand" })[0]!, {
          reservePayment: pay(actor, 3),
        });
        passEffectsStack(game);
        const sword = actor.cards(trainingSword, { zone: "material-deck" })[0]!;
        answerDecision(game, "resolve-effect-choice", [sword.objectId]);
        answerDecision(game, "announce-effect-materialization", {});
        passEffectsStack(game);
        expect(game.state.objects[sword.objectId]!.zone).toBe("field");
      }
      if (mode === "expired") advanceToMain(game, p.id, game.state.turn.number);
      const wait = game.waitState();
      if (wait.kind === "opportunity" && wait.playerId !== p.id) game.player(wait.playerId).pass();
      const expectedCost = Math.max(0, baseCost - (discount && mode === "own" ? 2 * count : 0));
      const before = game.state;
      if (identity === "wrong" || identity === "buried") {
        expect(() =>
          p.activateAbility(source, abilityId, { reservePayment: pay(p, expectedCost) }),
        ).toThrow();
        expect(game.state).toEqual(before);
        return;
      }
      if (expectedCost) {
        expect(() =>
          p.activateAbility(source, abilityId, { reservePayment: pay(p, expectedCost - 1) }),
        ).toThrow();
        expect(game.state).toEqual(before);
      }
      expect(() =>
        p.activateAbility(source, abilityId, { reservePayment: pay(p, expectedCost + 1) }),
      ).toThrow();
      expect(game.state).toEqual(before);
      const oldHand = p.zone("hand").length,
        oldMemory = p.zone("memory").length,
        incarnation = game.state.objects[source.objectId]!.incarnation;
      p.activateAbility(source, abilityId, { reservePayment: pay(p, expectedCost) });
      expect(p.zone("hand")).toHaveLength(oldHand - expectedCost);
      expect(p.zone("memory")).toHaveLength(oldMemory + expectedCost);
      expect(game.state.objects[source.objectId]!.face).toBe("default");
      expect(game.state.objects[source.objectId]!.states.has("rested")).toBe(true);
      const paid = game.state;
      expect(() =>
        p.activateAbility(source, abilityId, { reservePayment: pay(p, expectedCost) }),
      ).toThrow();
      expect(game.state).toEqual(paid);
      passEffectsStack(game);
      const transformed = game.state.objects[source.objectId]!;
      expect(transformed).toMatchObject({ face: "transformed", zone: "field", incarnation });
      expect(transformed.states.has("rested")).toBe(true);
      const context = {
        program: game.program,
        state: game.state,
        controllerId: p.id,
        bindings: {},
      };
      expect(deriveGrandArchiveCharacteristics(transformed, context).names).toEqual([flip.name]);
      expect(deriveGrandArchiveCharacteristics(transformed, context).types).toEqual(["ALLY"]);
      for (const stat of ["power", "life"] as const)
        expect(deriveGrandArchiveNumericProperty(transformed, stat, context)).toBe(
          flip.stats[stat],
        );
      expect(game.state.objects[other.objectId]!.face).toBe("default");
      const response = game.waitState();
      if (response.kind === "opportunity" && response.playerId !== p.id)
        game.player(response.playerId).pass();
      p.activate(reclaim, {
        reservePayment: pay(p, 2),
        targets: { "target-1": [source.objectId] },
      });
      passEffectsStack(game);
      expect(p.card(card, { zone: "hand" })).toEqual(source);
      expect(game.state.objects[source.objectId]!.face).toBe("default");
    });
}
