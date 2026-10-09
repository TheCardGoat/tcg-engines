import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { visceralInversion } from "./visceral-inversion.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { stillwaterPatrol } from "../../DOA/allies/stillwater-patrol.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";

/** @covers tZtoAl4ojK-a1 */
/** @covers tZtoAl4ojK-a2 */
describe("Visceral Inversion — ephemeral life reduction during an attack", () => {
  for (const ephemerate of [false, true])
    it(`pays ${ephemerate ? 3 : 1} and reduces ${ephemerate ? "life" : "power"}`, () => {
      const champion = enableAllTestElements(
        createClassBonusTestChampion(visceralInversion, false, "activation-discount"),
      );
      const game = GrandArchiveTestEngine.startFixture({
        firstPlayer: "playerTwo",
        playerOne: {
          champion,
          zones: {
            hand: [
              ...(ephemerate ? [] : [visceralInversion]),
              woodlandSquirrels,
              woodlandSquirrels,
              woodlandSquirrels,
            ],
            graveyard: ephemerate ? [visceralInversion] : [],
          },
        },
        playerTwo: { champion, zones: { field: [stillwaterPatrol, woodlandSquirrels] } },
      });
      const p = game.player("player-one"),
        q = game.player("player-two");
      const source = p.card(visceralInversion),
        attacker = q.card(stillwaterPatrol),
        hero = p.card(champion);
      q.declareAttack(attacker, hero);
      q.pass();
      const cost = ephemerate ? 3 : 1;
      const payment = p
        .cards(woodlandSquirrels, { zone: "hand" })
        .slice(0, cost)
        .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
      const options = {
        activationMethod: ephemerate ? ("ephemerate" as const) : undefined,
        targets: { "target-1": [attacker.objectId] },
        reservePayment: payment,
      };
      const before = game.state;
      for (const invalid of [q.card(woodlandSquirrels), q.card(champion)]) {
        expect(() =>
          p.activate(source, { ...options, targets: { "target-1": [invalid.objectId] } }),
        ).toThrow();
        expect(game.state).toEqual(before);
      }
      expect(() => p.activate(source, { ...options, reservePayment: payment.slice(1) })).toThrow();
      expect(game.state).toEqual(before);
      expect(() =>
        p.activate(source, { ...options, activationMethod: ephemerate ? undefined : "ephemerate" }),
      ).toThrow();
      expect(game.state).toEqual(before);
      p.activate(source, options);
      expect(p.zone("memory")).toHaveLength(cost);
      expect(game.state.objects[source.objectId]!.states.has("ephemeral")).toBe(ephemerate);
      passEffectsStack(game);
      if (game.state.combat) game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[source.objectId]!.zone).toBe(
        ephemerate ? "banishment" : "graveyard",
      );
      expect(game.state.objects[attacker.objectId]!.zone).toBe(ephemerate ? "graveyard" : "field");
      expect(game.state.objects[hero.objectId]!.damage).toBe(0);
    });
});
