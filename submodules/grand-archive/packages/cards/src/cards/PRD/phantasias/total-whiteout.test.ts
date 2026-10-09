import { describe } from "vitest";

import { proveClassBonusActivationDiscount } from "../../../testing/class-bonus-activation-discount.ts";
import { totalWhiteout } from "./total-whiteout.ts";

/** @covers O4mD40xpbY-a1 */
describe("Total Whiteout — Class Bonus activation discount", () => {
  proveClassBonusActivationDiscount({ card: totalWhiteout, discount: 3 });
});

import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { potionOfHealing } from "../../ALC/items/potion-of-healing.ts";
import { featheryTune } from "../../HVN/actions/feathery-tune.ts";
import { fledgling } from "../../HVN/tokens/fledgling.ts";
import { productionCrawldroid } from "../allies/production-crawldroid.ts";
import { powercell } from "../../MRC/tokens/powercell.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";

/** @covers O4mD40xpbY-a2 */
describe("Total Whiteout — all opposing entries are rested", () => {
  for (const own of [false, true])
    for (const active of [false, true])
      for (const items of [false, true])
        it(`own=${own}, active=${active}, token items=${items}`, () => {
          const champion = enableAllTestElements(
            createClassBonusTestChampion(totalWhiteout, false, "activation-discount"),
          );
          const summon = items ? productionCrawldroid : featheryTune;
          const token = items ? powercell : fledgling;
          const hand = [
            summon,
            summon,
            potionOfHealing,
            ...Array.from({ length: 10 }, () => woodlandSquirrels),
          ];
          const game = GrandArchiveTestEngine.startFixture({
            firstPlayer: own ? "playerOne" : "playerTwo",
            definitions: [token],
            playerOne: {
              champion,
              zones: {
                field: active ? [totalWhiteout] : [],
                graveyard: active ? [] : [totalWhiteout],
                hand: own ? hand : [],
              },
            },
            playerTwo: { champion, zones: { hand: own ? [] : hand } },
          });
          const actor = game.player(own ? "player-one" : "player-two");
          const pay = (n: number) =>
            actor
              .cards(woodlandSquirrels, { zone: "hand" })
              .slice(0, n)
              .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
          actor.activate(potionOfHealing, { reservePayment: pay(3) });
          passEffectsStack(game);
          expect(
            game.state.objects[actor.card(potionOfHealing).objectId]!.states.has("rested"),
          ).toBe(active && !own);
          for (const source of actor.cards(summon, { zone: "hand" })) {
            actor.activate(source, { reservePayment: pay(3) });
            passEffectsStack(game);
          }
          expect(actor.cards(token, { zone: "field" })).toHaveLength(4);
          for (const source of actor.cards(token, { zone: "field" }))
            expect(game.state.objects[source.objectId]!.states.has("rested")).toBe(active && !own);
          for (const source of actor.cards(productionCrawldroid, { zone: "field" }))
            expect(game.state.objects[source.objectId]!.states.has("rested")).toBe(active && !own);
          expect(game.state.objects[actor.card(champion).objectId]!.states.has("rested")).toBe(
            false,
          );
        });
});
