import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../cards/DOA/allies/giant-tortoise.ts";
import { breakApart } from "../cards/P26/actions/break-apart.ts";
import { reclaim } from "../cards/DOA/actions/reclaim.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
  grandArchiveTestFace,
} from "./class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack, advanceToMain } from "./decisions.ts";

export function proveEntryTargetStat(
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>,
  property: "power" | "life",
) {
  const cost = grandArchiveTestFace(card).cost;
  if (cost.kind !== "reserve" || typeof cost.amount !== "number")
    throw new Error("Expected reserve cost");
  const printedCost = cost.amount;
  for (const mode of ["normal", "target-leaves", "source-leaves", "none"] as const)
    it(`entry ${property} target and expiry: ${mode}`, () => {
      const champion = enableAllTestElements(
        createClassBonusTestChampion(card, false, "activation-discount"),
      );
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            field: mode === "none" ? [] : [giantTortoise],
            hand: [
              card,
              reclaim,
              breakApart,
              ...Array.from({ length: printedCost + 5 }, () => woodlandSquirrels),
            ],
            "main-deck": [woodlandSquirrels, woodlandSquirrels],
          },
        },
        playerTwo: {
          champion,
          zones: { field: [giantTortoise], "main-deck": [woodlandSquirrels] },
        },
      });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        source = p.card(card),
        other = q.card(giantTortoise);
      const pay = (n: number) =>
        p
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, n)
          .map((ref) => ({ kind: "card" as const, cardId: ref.objectId }));
      const stat = (id: typeof source.objectId) =>
        deriveGrandArchiveNumericProperty(game.state.objects[id]!, property, {
          program: game.program,
          state: game.state,
          controllerId: p.id,
          bindings: {},
        });
      const base = property === "power" ? 1 : 6;
      p.activate(source, { reservePayment: pay(printedCost) });
      p.pass();
      q.pass();
      expect(game.state.objects[source.objectId]!.zone).toBe("field");
      if (mode === "none") {
        passEffectsStack(game);
        expect(game.state.decision).toBeNull();
        expect(game.state.stack).toHaveLength(0);
        return;
      }
      const target = p.card(giantTortoise);
      expect(game.state.decision?.kind).toBe("announce-triggered-ability");
      const before = game.state;
      for (const ids of [
        [],
        [other.objectId],
        [p.card(champion).objectId],
        [source.objectId],
        [target.objectId, target.objectId],
      ]) {
        expect(() =>
          answerDecision(game, "announce-triggered-ability", { targets: { "target-1": ids } }),
        ).toThrow();
        expect(game.state).toEqual(before);
      }
      answerDecision(game, "announce-triggered-ability", {
        targets: { "target-1": [target.objectId] },
      });
      expect(stat(target.objectId)).toBe(base);
      if (mode === "target-leaves" || (mode === "source-leaves" && property === "power")) {
        const leaving = mode === "target-leaves" ? target : source;
        p.activate(reclaim, {
          reservePayment: pay(2),
          targets: { "target-1": [leaving.objectId] },
        });
      }
      passEffectsStack(game);
      expect(stat(other.objectId)).toBe(base);
      if (mode === "target-leaves") {
        expect(game.state.objects[target.objectId]!.zone).toBe("hand");
        expect(stat(target.objectId)).toBe(base);
        return;
      }
      expect(stat(target.objectId)).toBe(base + 2);
      if (mode === "source-leaves" && property === "life") {
        p.activate(breakApart, {
          reservePayment: pay(3),
          targets: { "target-1": [source.objectId] },
        });
        passEffectsStack(game);
        expect(game.state.objects[source.objectId]!.zone).toBe("graveyard");
        expect(stat(target.objectId)).toBe(base + 2);
      }
      if (property === "power") {
        p.declareAttack(target, q.card(champion));
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(3);
      }
      advanceToMain(game, q.id);
      expect(stat(target.objectId)).toBe(base);
    });
}
