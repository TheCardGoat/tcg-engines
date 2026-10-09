import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { stillwaterPatrol } from "../cards/DOA/allies/stillwater-patrol.ts";
import { sparkAlight } from "../cards/DOA/actions/spark-alight.ts";
import { fireball } from "../cards/DOA/actions/fireball.ts";
import { lineageTestChampion } from "./champion-lineage.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
  grandArchiveTestFace,
} from "./class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "./decisions.ts";
export function proveEphemeralStealth(
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>,
  ephemerateCost: number,
  aliceDiscard = false,
): void {
  for (const ephemeral of [false, true])
    for (const mode of ["ordinary", "true-sight", "spell"] as const)
      it(`ephemeral=${ephemeral}, interaction=${mode}`, () => {
        const champion = enableAllTestElements(
          lineageTestChampion(aliceDiscard ? "Alice" : "Other", 0),
        );
        const opponentChampion = enableAllTestElements(
          createClassBonusTestChampion(fireball, true, "activation-discount"),
        );
        const cost = ephemeral ? ephemerateCost : 3;
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              hand: [
                ...(ephemeral ? [] : [card]),
                sparkAlight,
                ...Array.from({ length: cost }, () => woodlandSquirrels),
              ],
              graveyard: ephemeral ? [card] : [],
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
            },
          },
          playerTwo: {
            champion: opponentChampion,
            zones: {
              field: [woodlandSquirrels, stillwaterPatrol],
              hand: [fireball, ...Array.from({ length: 2 }, () => woodlandSquirrels)],
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
            },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          source = p.card(card),
          discard = p.card(sparkAlight);
        const reservePayment = p
          .cards(woodlandSquirrels, { zone: "hand" })
          .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
        const options = {
          activationMethod: ephemeral ? ("ephemerate" as const) : undefined,
          costSelections: ephemeral && aliceDiscard ? [[discard.objectId]] : undefined,
          reservePayment,
        };
        const before = game.state;
        expect(() =>
          p.activate(source, { ...options, reservePayment: reservePayment.slice(1) }),
        ).toThrow();
        expect(game.state).toEqual(before);
        if (ephemeral && aliceDiscard) {
          expect(() => p.activate(source, { ...options, costSelections: [] })).toThrow();
          expect(game.state).toEqual(before);
        }
        p.activate(source, options);
        passEffectsStack(game);
        expect(game.state.objects[source.objectId]!.zone).toBe("field");
        expect(game.state.objects[source.objectId]!.states.has("ephemeral")).toBe(ephemeral);
        expect(game.state.objects[discard.objectId]!.zone).toBe(
          ephemeral && aliceDiscard ? "graveyard" : "hand",
        );
        advanceToMain(game, q.id);
        expect(game.state.objects[source.objectId]!.zone).toBe("field");
        if (ephemeral && mode === "ordinary") {
          const pending = game.state;
          expect(() =>
            q.declareAttack(q.card(woodlandSquirrels, { zone: "field" }), source),
          ).toThrow();
          expect(game.state).toEqual(pending);
          return;
        }
        if (mode === "spell") {
          q.activate(fireball, {
            targets: { "target-1": [source.objectId] },
            reservePayment: q
              .cards(woodlandSquirrels, { zone: "hand" })
              .slice(0, 2)
              .map((c) => ({ kind: "card", cardId: c.objectId })),
          });
          passEffectsStack(game);
        } else {
          q.declareAttack(
            q.card(mode === "true-sight" ? stillwaterPatrol : woodlandSquirrels, { zone: "field" }),
            source,
          );
          game.resolveCombatWithoutRetaliation();
        }
        const damage = mode === "true-sight" ? (ephemeral ? 3 : 2) : 1,
          life = grandArchiveTestFace(card).stats.life;
        if (typeof life !== "number") throw new Error("Expected ally life");
        const lethal = damage >= life;
        expect(game.state.objects[source.objectId]!.zone).toBe(
          lethal ? (ephemeral ? "banishment" : "graveyard") : "field",
        );
        expect(game.state.objects[source.objectId]!.damage).toBe(lethal ? 0 : damage);
      });
}
