import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { dormantSacrificialAltar } from "../domains/dormant-sacrificial-altar.ts";
import { automatonDrone } from "./automaton-drone.ts";
import { obeliskOfFabrication } from "./obelisk-of-fabrication.ts";

/** @covers xy5lh23qu7-a1 */
describe("Obelisk of Fabrication — Domain discount and buffed Drone summoning", () => {
  for (const additionalDomains of [0, 2]) {
    it(`pays ${5 - additionalDomains} with ${additionalDomains + 1} controlled Domains`, () => {
      const champion = createClassBonusTestChampion(
        obeliskOfFabrication,
        false,
        "activation-discount",
      );
      const cost = 5 - additionalDomains;
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            field: [
              obeliskOfFabrication,
              ...Array.from({ length: additionalDomains }, () => dormantSacrificialAltar),
            ],
            hand: Array.from({ length: 6 }, () => woodlandSquirrels),
          },
        },
        playerTwo: {
          champion,
          zones: { field: [dormantSacrificialAltar, dormantSacrificialAltar] },
        },
        definitions: [automatonDrone],
      });
      const player = game.player("player-one");
      const source = player.card(obeliskOfFabrication, { zone: "field" });
      const payment = player
        .cards(woodlandSquirrels, { zone: "hand" })
        .slice(0, cost)
        .map((card) => ({ kind: "card" as const, cardId: card.objectId }));
      const before = game.state;
      expect(() =>
        player.activateAbility(source, "xy5lh23qu7-a1", {
          reservePayment: payment.slice(1),
        }),
      ).toThrow();
      expect(game.state).toEqual(before);

      player.activateAbility(source, "xy5lh23qu7-a1", { reservePayment: payment });
      expect(game.state.objects[source.objectId]!.states.has("rested")).toBe(true);
      expect(player.cards(automatonDrone, { zone: "field" })).toHaveLength(0);
      passEffectsStack(game);

      const token = player.card(automatonDrone, { zone: "field" });
      expect(game.state.objects[token.objectId]!.isToken).toBe(true);
      expect(game.state.objects[token.objectId]!.counters.buff).toBe(1);
      expect(game.state.objects[token.objectId]!.states.has("rested")).toBe(false);
      expect(game.player("player-two").cards(automatonDrone, { zone: "field" })).toHaveLength(0);
    });
  }
});
