import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { stillwaterPatrol } from "../cards/DOA/allies/stillwater-patrol.ts";
import { fireball } from "../cards/DOA/actions/fireball.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
  grandArchiveTestFace,
  requireSingleFace,
} from "./class-bonus-test-champion.ts";
import { passEffectsStack } from "./decisions.ts";

/** Class Bonus Stealth is restricted, so it stays card-specific. */
export function proveClassBonusStealth(
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>,
): void {
  for (const championClass of ["SPIRIT" as const, ...grandArchiveTestFace(card).typeLine.classes])
    for (const mode of ["ordinary", "true-sight", "spell"] as const)
      it(`class=${championClass}: ${mode} respects the attack-only restriction`, () => {
        const matching = championClass !== "SPIRIT";
        const base = createClassBonusTestChampion(card, matching, "activation-discount");
        const face = requireSingleFace(base);
        const champion = enableAllTestElements({
          ...base,
          layout: {
            kind: "single-faced",
            face: {
              ...face,
              typeLine: { ...face.typeLine, classes: [championClass], subtypes: [championClass] },
            },
          },
        });
        const attackerChampion = enableAllTestElements(
          createClassBonusTestChampion(fireball, true, "activation-discount"),
        );
        const attackerCard = mode === "true-sight" ? stillwaterPatrol : woodlandSquirrels;
        const game = GrandArchiveTestEngine.startFixture({
          firstPlayer: "playerTwo",
          playerOne: { champion, zones: { field: [card] } },
          playerTwo: {
            champion: attackerChampion,
            zones: {
              field: [attackerCard],
              hand: [fireball, woodlandSquirrels, woodlandSquirrels],
            },
          },
        });
        const defender = game.player("player-one").card(card, { zone: "field" });
        const q = game.player("player-two");
        const attacker = q.card(attackerCard, { zone: "field" });
        if (matching && mode === "ordinary") {
          const before = game.state;
          expect(() => q.declareAttack(attacker, defender)).toThrow();
          expect(game.state).toEqual(before);
          return;
        }
        if (mode === "spell") {
          q.activate(fireball, {
            targets: { "target-1": [defender.objectId] },
            reservePayment: q
              .cards(woodlandSquirrels, { zone: "hand" })
              .map((c) => ({ kind: "card", cardId: c.objectId })),
          });
          expect(game.state.objects[defender.objectId]!.damage).toBe(0);
          passEffectsStack(game);
        } else {
          q.declareAttack(attacker, defender);
          expect(game.state.objects[defender.objectId]!.damage).toBe(0);
          game.resolveCombatWithoutRetaliation();
        }
        const damage = mode === "true-sight" ? (matching ? 3 : 2) : 1;
        const life = grandArchiveTestFace(card).stats.life;
        if (typeof life !== "number") throw new Error("Expected printed ally life");
        const after = game.state.objects[defender.objectId]!;
        expect(after.zone).toBe(damage >= life ? "graveyard" : "field");
        expect(after.damage).toBe(damage >= life ? 0 : damage);
      });
}
