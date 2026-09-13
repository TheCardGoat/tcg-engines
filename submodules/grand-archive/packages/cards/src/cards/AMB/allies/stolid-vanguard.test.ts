import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { galesMare } from "../../RDO/allies/gales-mare.ts";
import { stolidVanguard } from "./stolid-vanguard.ts";

/** @covers yrm3xibmoz-a1 */
describe("Stolid Vanguard — Equestrian On Enter power", () => {
  for (const horse of [false, true]) {
    it(`${horse ? "gains" : "does not gain"} +2 POWER until end of turn with a Horse ally`, () => {
      const champion = createClassBonusTestChampion(stolidVanguard, false, "activation-discount");
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            hand: [stolidVanguard, woodlandSquirrels, woodlandSquirrels],
            field: horse ? [galesMare] : [],
          },
        },
        playerTwo: { champion },
      });
      const player = game.player("player-one");
      const opponent = game.player("player-two");
      player.activate(stolidVanguard, {
        reservePayment: player
          .cards(woodlandSquirrels, { zone: "hand" })
          .map((card) => ({ kind: "card" as const, cardId: card.objectId })),
      });
      player.pass();
      opponent.pass();
      expect(
        game.state.stack.some(
          (item) => item.kind === "triggered-ability" && item.ability.id === "yrm3xibmoz-a1",
        ),
      ).toBe(true);
      const vanguard = player.card(stolidVanguard, { zone: "field" });
      const target = opponent.card(champion, { zone: "field" });
      passEffectsStack(game);
      player.declareAttack(vanguard, target);
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[target.objectId]!.damage).toBe(horse ? 3 : 1);
    });
  }
});
