import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { seekingShot } from "./seeking-shot.ts";
import { proveSubtypeAttackTarget } from "../../../testing/subtype-attack-target.ts";
import { proveAttackPower } from "../../../testing/attack-power.ts";
import {
  createClassBonusTestChampion,
  grantTestChampionLevel,
} from "../../../testing/class-bonus-test-champion.ts";
import { declareResolvedAttack, passEffectsStack } from "../../../testing/decisions.ts";
import { shimmercloakAssassin } from "../../ALC/allies/shimmercloak-assassin.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";

/** @covers 88zq9ox7u6-a3 */
describe("Seeking Shot — Human ally", () =>
  proveSubtypeAttackTarget(seekingShot, "human-ally", 1, 1, 3));
/** @covers 88zq9ox7u6-a2 */
describe("Seeking Shot — class bonus prevents retaliation", () => {
  for (const classBonus of [false, true])
    for (const allyTarget of [false, true])
      proveAttackPower({
        card: seekingShot,
        cost: 1,
        power: 1,
        classBonus,
        allyTarget,
        retaliationAllowed: !classBonus,
      });
});
/** @covers 88zq9ox7u6-a1 */
describe("Seeking Shot — level-gated True Sight", () => {
  for (const matching of [false, true])
    for (const level of [0, 1, 2, 3])
      it(`class=${matching}, level=${level}`, () => {
        const champion = grantTestChampionLevel(
          createClassBonusTestChampion(seekingShot, matching, "activation-discount"),
          level,
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: { champion, zones: { hand: [seekingShot, woodlandSquirrels] } },
          playerTwo: { champion, zones: { field: [shimmercloakAssassin] } },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          hero = p.card(champion),
          hidden = q.card(shimmercloakAssassin),
          enemy = q.card(champion);
        const before = game.state;
        expect(() => p.declareAttack(hero, hidden)).toThrow();
        expect(game.state).toEqual(before);
        p.activate(seekingShot, {
          attackAttackerId: hero.objectId,
          reservePayment: [{ kind: "card", cardId: p.card(woodlandSquirrels).objectId }],
        });
        passEffectsStack(game);
        if (level < 2) {
          const prior = game.state;
          expect(() =>
            declareResolvedAttack(
              game,
              hero.objectId,
              hidden.objectId,
              "Cannot target stealth below level two",
            ),
          ).toThrow();
          expect(game.state).toEqual(prior);
        }
        const target = level >= 2 ? hidden : enemy;
        declareResolvedAttack(
          game,
          hero.objectId,
          target.objectId,
          "Resolve Seeking Shot with current level",
        );
        const start = game.state.eventHistory.length;
        game.resolveCombatWithoutRetaliation();
        expect(
          game.state.eventHistory
            .slice(start)
            .filter((e) => e.type === "damage-marked" && e.objectId === target.objectId)
            .map((e) => (e.type === "damage-marked" ? e.amount : 0)),
        ).toEqual([1]);
        expect(game.state.combat).toBeNull();
      });
});
