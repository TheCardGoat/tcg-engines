import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { proveClassBonusActivationDiscount } from "../../../testing/class-bonus-activation-discount.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { advanceToRecollection } from "../../../testing/aging-potion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { astraSight } from "./astra-sight.ts";
import { celestialCalling } from "./celestial-calling.ts";

/** @covers izm6h38lrj-a1 */
describe("celestial-calling — Class Bonus activation discount", () => {
  proveClassBonusActivationDiscount({ card: celestialCalling, discount: 2 });
});

/** @covers izm6h38lrj-a2 */
describe("Celestial Calling — delayed free activation", () => {
  it("banishes the first revealed Astra Spell and may activate it next recollection without reserve", () => {
    const champion = createClassBonusTestChampion(celestialCalling, true, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          hand: [celestialCalling, woodlandSquirrels, woodlandSquirrels],
          "main-deck": [
            woodlandSquirrels,
            woodlandSquirrels,
            astraSight,
            woodlandSquirrels,
            woodlandSquirrels,
          ],
        },
      },
      playerTwo: {
        champion,
        zones: { "main-deck": Array.from({ length: 5 }, () => woodlandSquirrels) },
      },
    });
    const player = game.player("player-one");
    const called = player.card(astraSight, { zone: "main-deck" });
    player.activate(celestialCalling, {
      reservePayment: player
        .cards(woodlandSquirrels, { zone: "hand" })
        .map((card) => ({ kind: "card", cardId: card.objectId })),
    });
    passEffectsStack(game);
    expect(game.state.objects[called.objectId]!.zone).toBe("banishment");
    expect(player.zone("main-deck")).toHaveLength(4);

    advanceToRecollection(game, player.id);
    passEffectsStack(game);
    answerDecision(game, "resolve-optional-effect", true);
    passEffectsStack(game);
    answerDecision(game, "announce-effect-activation", {});
    expect(game.state.objects[called.objectId]!.zone).toBe("effects-stack");
    passEffectsStack(game);
    expect(game.state.decision?.kind).toBe("resolve-glimpse");
  });
});
