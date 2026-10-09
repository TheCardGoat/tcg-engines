import { describe } from "vitest";
import { focusingGem } from "./focusing-gem.ts";
import { proveNextActivationDiscount } from "../../../testing/next-activation-discount.ts";
/** @covers SpENiP3jbN-a3 */
describe("Focusing Gem's next activation discount", () => {
  proveNextActivationDiscount({
    card: focusingGem,
    abilityId: "SpENiP3jbN-a3",
    amount: 3,
    beastOnly: false,
  });
});

import { proveHinderedRestBanish } from "../../../testing/rest-banish-entry.ts";
/** @covers SpENiP3jbN-a2 */
describe("Focusing Gem's Hindered cost restriction", () =>
  proveHinderedRestBanish(focusingGem, "SpENiP3jbN-a3"));

import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { grayWolf } from "../../DOA/allies/gray-wolf.ts";
import { jewelOfEnlightenment } from "../../DOA/items/jewel-of-enlightenment.ts";

it("discounts after an earlier card activation and is not consumed by an ability", () => {
  const champion = createClassBonusTestChampion(focusingGem, false, "activation-discount");
  const game = GrandArchiveTestEngine.startFixture({
    playerOne: {
      champion,
      zones: { field: [focusingGem, jewelOfEnlightenment], hand: [woodlandSquirrels, grayWolf] },
    },
    playerTwo: { champion },
  });
  const p = game.player("player-one");
  p.activate(woodlandSquirrels);
  passEffectsStack(game);
  p.activateAbility(focusingGem, "SpENiP3jbN-a3");
  passEffectsStack(game);
  p.activateAbility(jewelOfEnlightenment, "AKA19OwaCh-a1");
  passEffectsStack(game);
  p.activate(grayWolf);
  passEffectsStack(game);
  expect(p.cards(grayWolf, { zone: "field" })).toHaveLength(1);
  expect(p.zone("memory")).toHaveLength(0);
});
