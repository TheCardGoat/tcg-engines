import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { harvestHerbs } from "../actions/harvest-herbs.ts";
import { blightroot } from "../tokens/blightroot.ts";
import { fraysia } from "../tokens/fraysia.ts";
import { manaroot } from "../tokens/manaroot.ts";
import { razorvine } from "../tokens/razorvine.ts";
import { silvershine } from "../tokens/silvershine.ts";
import { springleaf } from "../tokens/springleaf.ts";
import { alchemistsKit } from "./alchemists-kit.ts";

/** @covers ettczb14m4-a1 @covers ettczb14m4-a2 */
describe("Alchemist's Kit — Gather tracking and refinement draw", () => {
  for (const gathers of [0, 3, 4, 8]) {
    it(`draws ${Math.floor(gathers / 4)} after ${gathers} controlled Gather actions`, () => {
      const champion = createClassBonusTestChampion(harvestHerbs, true, "activation-discount");
      const draws = Math.floor(gathers / 4);
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            field: [alchemistsKit],
            hand: [
              ...Array.from({ length: gathers }, () => harvestHerbs),
              ...Array.from({ length: gathers }, () => woodlandSquirrels),
            ],
            "main-deck": Array.from({ length: Math.max(3, draws + 1) }, () => woodlandSquirrels),
          },
        },
        playerTwo: { champion, zones: { "main-deck": [woodlandSquirrels] } },
        definitions: [blightroot, fraysia, manaroot, razorvine, silvershine, springleaf],
      });
      const player = game.player("player-one");
      const kit = player.card(alchemistsKit, { zone: "field" });
      for (let index = 0; index < gathers; index++) {
        player.activate(player.cards(harvestHerbs, { zone: "hand" })[0]!, {
          reservePayment: [
            {
              kind: "card",
              cardId: player.cards(woodlandSquirrels, { zone: "hand" })[0]!.objectId,
            },
          ],
        });
        passEffectsStack(game);
        expect(game.state.objects[kit.objectId]!.counters["named:refinement"]).toBe(index + 1);
      }

      const handBefore = player.zone("hand");
      const deckBefore = player.zone("main-deck");
      player.activateAbility(kit, "ettczb14m4-a2");
      expect(game.state.objects[kit.objectId]!.zone).toBe("banishment");
      expect(player.zone("hand")).toEqual(handBefore);
      passEffectsStack(game);

      expect(player.zone("hand")).toEqual([...handBefore, ...deckBefore.slice(0, draws)]);
      expect(player.zone("main-deck")).toEqual(deckBefore.slice(draws));
    });
  }
});
