import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { stillwaterPatrol } from "../cards/DOA/allies/stillwater-patrol.ts";
import { fireball } from "../cards/DOA/actions/fireball.ts";
import { glacialGuidance } from "../cards/DOA/actions/glacial-guidance.ts";
import { secondWind } from "../cards/DOA/actions/second-wind.ts";
import { reposition } from "../cards/ALC/actions/reposition.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
  grandArchiveTestFace,
} from "./class-bonus-test-champion.ts";
import { passEffectsStack } from "./decisions.ts";
export function proveStateStealth(
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>,
  condition: "awake" | "distant",
): void {
  const setup = () => {
    const champion = enableAllTestElements(
      createClassBonusTestChampion(fireball, true, "activation-discount"),
    );
    const game = GrandArchiveTestEngine.startFixture({
      firstPlayer: "playerTwo",
      playerOne: { champion, zones: { field: [card, woodlandSquirrels] } },
      playerTwo: {
        champion,
        zones: {
          field: [woodlandSquirrels, stillwaterPatrol],
          hand: [
            fireball,
            glacialGuidance,
            secondWind,
            reposition,
            ...Array.from({ length: 7 }, () => woodlandSquirrels),
          ],
        },
      },
    });
    const p = game.player("player-one"),
      q = game.player("player-two"),
      defender = p.card(card);
    const cast = (spell: typeof fireball, cost: number) => {
      q.activate(spell, {
        targets: { "target-1": [defender.objectId] },
        reservePayment: q
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, cost)
          .map((c) => ({ kind: "card", cardId: c.objectId })),
      });
      passEffectsStack(game);
    };
    return { game, p, q, defender, cast };
  };
  for (const active of [false, true])
    for (const mode of ["ordinary", "true-sight", "spell"] as const)
      it(`${condition} stealth=${active}, interaction=${mode}`, () => {
        const { game, p, q, defender, cast } = setup();
        if (condition === "awake" && !active) cast(glacialGuidance, 1);
        if (condition === "distant" && active) cast(reposition, 1);
        expect(
          game.state.objects[defender.objectId]!.states.has(
            condition === "awake" ? "rested" : "distant",
          ),
        ).toBe(condition === "awake" ? !active : active);
        if (mode === "ordinary" && active) {
          const before = game.state;
          expect(() =>
            q.declareAttack(q.card(woodlandSquirrels, { zone: "field" }), defender),
          ).toThrow();
          expect(game.state).toEqual(before);
          q.declareAttack(
            q.card(woodlandSquirrels, { zone: "field" }),
            p.card(woodlandSquirrels, { zone: "field" }),
          );
          game.resolveCombatWithoutRetaliation();
          expect(game.state.objects[defender.objectId]!.damage).toBe(0);
          return;
        }
        if (mode === "spell") cast(fireball, 2);
        else {
          q.declareAttack(
            q.card(mode === "true-sight" ? stillwaterPatrol : woodlandSquirrels, { zone: "field" }),
            defender,
          );
          game.resolveCombatWithoutRetaliation();
        }
        const damage = mode === "true-sight" ? (active ? 3 : 2) : 1,
          life = grandArchiveTestFace(card).stats.life;
        if (typeof life !== "number") throw new Error("Expected ally life");
        expect(game.state.objects[defender.objectId]!.zone).toBe(
          damage >= life ? "graveyard" : "field",
        );
        expect(game.state.objects[defender.objectId]!.damage).toBe(damage >= life ? 0 : damage);
      });
  for (const trueSight of [false, true])
    it(`gaining ${condition} stealth during combat, true sight=${trueSight}`, () => {
      const { game, q, defender, cast } = setup();
      if (condition === "awake") cast(glacialGuidance, 1);
      q.declareAttack(
        q.card(trueSight ? stillwaterPatrol : woodlandSquirrels, { zone: "field" }),
        defender,
      );
      cast(condition === "awake" ? secondWind : reposition, condition === "awake" ? 3 : 1);
      game.resolveCombatWithoutRetaliation();
      const life = grandArchiveTestFace(card).stats.life;
      if (typeof life !== "number") throw new Error("Expected ally life");
      const damage = trueSight ? 3 : 0;
      expect(game.state.objects[defender.objectId]!.damage).toBe(damage >= life ? 0 : damage);
      expect(game.state.objects[defender.objectId]!.zone).toBe(
        damage >= life ? "graveyard" : "field",
      );
    });
}
