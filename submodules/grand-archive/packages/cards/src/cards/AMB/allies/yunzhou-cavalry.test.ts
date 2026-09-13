import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { proveRangedAlly } from "../../../testing/ranged-ally.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { galesMare } from "../../RDO/allies/gales-mare.ts";
import { yunzhouCavalry } from "./yunzhou-cavalry.ts";

/** @covers ann23jkuys-a1 */
describe("Yunzhou Cavalry — Class Bonus Ranged 2", () => {
  proveRangedAlly({ card: yunzhouCavalry, power: 2, ranged: 2, classBonus: true });
});

/** @covers ann23jkuys-a2 */
describe("Yunzhou Cavalry — Equestrian distant entry", () => {
  for (const horse of [false, true]) {
    it(`${horse ? "becomes" : "does not become"} distant with a Horse ally=${horse}`, () => {
      const champion = createClassBonusTestChampion(yunzhouCavalry, false, "activation-discount");
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            hand: [yunzhouCavalry, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
            field: horse ? [galesMare] : [woodlandSquirrels],
          },
        },
        playerTwo: { champion, zones: { field: [galesMare] } },
      });
      const player = game.player("player-one");
      const opponent = game.player("player-two");
      player.activate(yunzhouCavalry, {
        reservePayment: player
          .cards(woodlandSquirrels, { zone: "hand" })
          .map((ref) => ({ kind: "card" as const, cardId: ref.objectId })),
      });
      player.pass();
      opponent.pass();
      const cavalry = player.card(yunzhouCavalry, { zone: "field" });
      expect(game.state.objects[cavalry.objectId]!.states.has("distant")).toBe(false);
      expect(
        game.state.stack.some(
          (item) => item.kind === "triggered-ability" && item.ability.id === "ann23jkuys-a2",
        ),
      ).toBe(true);
      passEffectsStack(game);
      expect(game.state.objects[cavalry.objectId]!.states.has("distant")).toBe(horse);
    });
  }
});
