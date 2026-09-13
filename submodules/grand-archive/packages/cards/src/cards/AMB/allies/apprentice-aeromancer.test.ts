import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { nascentBlast } from "../../P24/actions/nascent-blast.ts";
import { galvanizingGale } from "../actions/galvanizing-gale.ts";
import { apprenticeAeromancer } from "./apprentice-aeromancer.ts";

/** @covers 9f0nsj62l6-a1 */
describe("Apprentice Aeromancer — Class Bonus Empower 2", () => {
  for (const classBonus of [false, true]) {
    it(`Class Bonus=${classBonus} ${classBonus ? "empowers" : "does not empower"} the next Spell`, () => {
      const champion = createClassBonusTestChampion(
        apprenticeAeromancer,
        classBonus,
        "activation-discount",
      );
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            hand: [
              apprenticeAeromancer,
              nascentBlast,
              woodlandSquirrels,
              woodlandSquirrels,
              woodlandSquirrels,
              woodlandSquirrels,
              woodlandSquirrels,
            ],
            "main-deck": [woodlandSquirrels],
          },
        },
        playerTwo: { champion },
      });
      const player = game.player("player-one");
      const opponent = game.player("player-two");
      player.activate(apprenticeAeromancer, {
        reservePayment: player
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, 2)
          .map((ref) => ({ kind: "card" as const, cardId: ref.objectId })),
      });
      player.pass();
      opponent.pass();
      expect(
        game.state.stack.some(
          (item) => item.kind === "triggered-ability" && item.ability.id === "9f0nsj62l6-a1",
        ),
      ).toBe(classBonus);
      passEffectsStack(game);
      const target = opponent.card(champion, { zone: "field" });
      player.activate(nascentBlast, {
        targets: { "target-1": [target.objectId] },
        reservePayment: player
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, 3)
          .map((ref) => ({ kind: "card" as const, cardId: ref.objectId })),
      });
      passEffectsStack(game);
      expect(game.state.objects[target.objectId]!.damage).toBe(3);
      expect(player.cards(nascentBlast, { zone: "memory" })).toHaveLength(classBonus ? 1 : 0);
      expect(player.cards(nascentBlast, { zone: "graveyard" })).toHaveLength(classBonus ? 0 : 1);
    });
  }
});

/** @covers 9f0nsj62l6-a2 */
describe("Apprentice Aeromancer — Class Bonus wind Spell power", () => {
  for (const classBonus of [false, true]) {
    it(`Class Bonus=${classBonus} after a wind Spell`, () => {
      const champion = createClassBonusTestChampion(
        apprenticeAeromancer,
        classBonus,
        "activation-discount",
      );
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            field: [apprenticeAeromancer],
            hand: [galvanizingGale, woodlandSquirrels, woodlandSquirrels],
          },
        },
        playerTwo: { champion },
      });
      const player = game.player("player-one");
      const aeromancer = player.card(apprenticeAeromancer, { zone: "field" });
      player.activate(galvanizingGale, {
        targets: { "target-1": [aeromancer.objectId] },
        reservePayment: player
          .cards(woodlandSquirrels, { zone: "hand" })
          .map((ref) => ({ kind: "card" as const, cardId: ref.objectId })),
      });
      passEffectsStack(game);
      const target = game.player("player-two").card(champion, { zone: "field" });
      player.declareAttack(aeromancer, target);
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[target.objectId]!.damage).toBe(classBonus ? 5 : 4);
    });
  }
});
