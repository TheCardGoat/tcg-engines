import { enableAllTestElements } from "../../../testing/class-bonus-test-champion.ts";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { cyclonicFatestone } from "../../HVN/items/cyclonic-fatestone.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { describe, expect, it } from "vitest";
import { brokenPromises } from "./broken-promises.ts";
import { idleFatestone } from "../../HVN/items/idle-fatestone.ts";
import { proveAdditionalPaymentDraw } from "../../../testing/additional-payment-draw.ts";

/** @covers re911j7fo4-a1
 * @covers re911j7fo4-a2
 */
describe("brokenPromises payment and draw", () => {
  proveAdditionalPaymentDraw({
    card: brokenPromises,
    paymentCard: idleFatestone,
    amount: 1,
    destination: "memory",
  });
});

it("accepts a Fatebound ally after its printed transform ability resolves", () => {
  const champion = enableAllTestElements(lineageTestChampion("Guo Jia", 0));
  const game = GrandArchiveTestEngine.startFixture({
    playerOne: {
      champion,
      zones: {
        field: [cyclonicFatestone],
        hand: [brokenPromises, ...Array.from({ length: 4 }, () => woodlandSquirrels)],
        "main-deck": [woodlandSquirrels, woodlandSquirrels],
      },
    },
    playerTwo: { champion },
  });
  const p = game.player("player-one"),
    source = p.card(cyclonicFatestone),
    deck = p.zone("main-deck");
  p.activateAbility(source, "l6410a85dn-a3", {
    reservePayment: p
      .cards(woodlandSquirrels, { zone: "hand" })
      .slice(0, 3)
      .map((ref) => ({ kind: "card", cardId: ref.objectId })),
  });
  passEffectsStack(game);
  expect(game.state.objects[source.objectId]!.face).toBe("transformed");
  p.activate(brokenPromises, {
    reservePayment: p
      .cards(woodlandSquirrels, { zone: "hand" })
      .map((ref) => ({ kind: "card", cardId: ref.objectId })),
    costSelections: [[source.objectId]],
  });
  expect(game.state.objects[source.objectId]!.zone).toBe("graveyard");
  passEffectsStack(game);
  expect(p.zone("memory")).toContainEqual(deck[0]);
  expect(p.zone("main-deck")).toEqual(deck.slice(1));
});

import { proveGuoJiaQuestAction } from "../../../testing/guo-jia-quest-action.ts";
/** @covers re911j7fo4-a3 */
describe("brokenPromises Guo Jia quest bonus", () => {
  proveGuoJiaQuestAction(brokenPromises, 1, "sacrifice");
});
