import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { galesMare } from "../../RDO/allies/gales-mare.ts";
import { gemOfSorority } from "../items/gem-of-sorority.ts";
import { galvanizingGale } from "./galvanizing-gale.ts";

/** @covers f00cEmu6Ql-a1 */
describe("Galvanizing Gale — next attack +3 and empowered draw", () => {
  for (const empowered of [false, true]) {
    it(`${empowered ? "draws after being empowered and" : "does not draw unless empowered and"} gives +3 combat power`, () => {
      const champion = createClassBonusTestChampion(galvanizingGale, false, "activation-discount");
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            hand: [galvanizingGale, woodlandSquirrels, woodlandSquirrels],
            field: [galesMare, ...(empowered ? [gemOfSorority] : [])],
            "main-deck": [woodlandSquirrels],
          },
        },
        playerTwo: { champion },
      });
      const player = game.player("player-one");
      if (empowered) player.activateAbility(gemOfSorority, "4dys05p49w-a1");
      passEffectsStack(game);
      const ally = player.card(galesMare, { zone: "field" });
      const before = game.state;
      expect(() =>
        player.activate(galvanizingGale, {
          reservePayment: player.cards(woodlandSquirrels, { zone: "hand" }).map((card) => ({
            kind: "card" as const,
            cardId: card.objectId,
          })),
          targets: { "target-1": [player.card(champion, { zone: "field" }).objectId] },
        }),
      ).toThrow();
      expect(game.state).toEqual(before);
      const deck = player.zone("main-deck");
      player.activate(galvanizingGale, {
        reservePayment: player.cards(woodlandSquirrels, { zone: "hand" }).map((card) => ({
          kind: "card" as const,
          cardId: card.objectId,
        })),
        targets: { "target-1": [ally.objectId] },
      });
      passEffectsStack(game);
      expect(player.zone("memory")).toHaveLength(empowered ? 3 : 2);
      if (empowered) expect(player.zone("memory")).toContainEqual(deck[0]);
      const defender = game.player("player-two").card(champion, { zone: "field" });
      player.declareAttack(ally, defender);
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[defender.objectId]!.damage).toBe(5);
    });
  }
});
