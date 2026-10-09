import { describe } from "vitest";
import { vacuousCall } from "./vacuous-call.ts";
import { vacuousServant } from "../../DTR/tokens/vacuous-servant.ts";
import { proveSummonOnEnter } from "../../../testing/summon-on-enter.ts";
/** @covers ex6AXz6IhB-a1 */
describe("vacuousCall", () => {
  proveSummonOnEnter({
    card: vacuousCall,
    token: vacuousServant,
    cost: 3,
    count: 1,
    abilityId: "ex6AXz6IhB-a1",
  });
});

import { expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { createLineageTestChampion } from "../../../testing/champion-lineage.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
/** @covers ex6AXz6IhB-a2 */
describe("Vacuous Call — Ciel sacrifice ability", () => {
  for (const matching of [false, true])
    it(`requires Ciel, reserve, ally discard and sacrifice, matching=${matching}`, () => {
      const champion = createLineageTestChampion(vacuousCall, matching ? "Ciel" : "Other");
      const game = GrandArchiveTestEngine.startFixture({
        definitions: [vacuousServant],
        playerOne: {
          champion,
          zones: {
            field: [vacuousCall],
            hand: [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels, trainingSword],
          },
        },
        playerTwo: { champion, zones: { hand: [woodlandSquirrels] } },
      });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        source = p.card(vacuousCall),
        allies = p.cards(woodlandSquirrels, { zone: "hand" });
      const reservePayment = allies
        .slice(0, 2)
        .map((ref) => ({ kind: "card" as const, cardId: ref.objectId }));
      const discarded = allies[2]!;
      const options = { reservePayment, costSelections: [[discarded.objectId]] };
      const before = game.state;
      if (!matching) {
        expect(() => p.activateAbility(source, "ex6AXz6IhB-a2", options)).toThrow();
        expect(game.state).toEqual(before);
        return;
      }
      for (const selected of [
        [],
        [p.card(trainingSword).objectId],
        [q.card(woodlandSquirrels).objectId],
      ]) {
        expect(() =>
          p.activateAbility(source, "ex6AXz6IhB-a2", {
            reservePayment,
            costSelections: [selected],
          }),
        ).toThrow();
        expect(game.state).toEqual(before);
      }
      expect(() =>
        p.activateAbility(source, "ex6AXz6IhB-a2", {
          ...options,
          reservePayment: reservePayment.slice(1),
        }),
      ).toThrow();
      expect(game.state).toEqual(before);
      p.activateAbility(source, "ex6AXz6IhB-a2", options);
      expect(game.state.objects[source.objectId]!.zone).toBe("graveyard");
      expect(game.state.objects[discarded.objectId]!.zone).toBe("graveyard");
      expect(p.zone("memory")).toHaveLength(2);
      expect(p.cards(vacuousServant, { zone: "field" })).toHaveLength(0);
      passEffectsStack(game);
      expect(p.cards(vacuousServant, { zone: "field" })).toHaveLength(1);
      expect(q.cards(vacuousServant, { zone: "field" })).toHaveLength(0);
      expect(() => p.activateAbility(source, "ex6AXz6IhB-a2", options)).toThrow();
    });
});
