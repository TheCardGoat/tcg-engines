import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { advanceToRecollection } from "../../../testing/aging-potion.ts";
import { proveClassBonusActivationDiscount } from "../../../testing/class-bonus-activation-discount.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { clockworkAmalgam } from "./clockwork-amalgam.ts";

/** @covers 3zc9p4lpnv-a1 */
describe("clockwork-amalgam — Class Bonus activation discount", () => {
  proveClassBonusActivationDiscount({ card: clockworkAmalgam, discount: 2 });
});

/** @covers 3zc9p4lpnv-a2 */
describe("Clockwork Amalgam — field copy", () => {
  it("enters as the chosen ally and may return itself during recollection", () => {
    const champion = createClassBonusTestChampion(clockworkAmalgam, true, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          hand: [clockworkAmalgam, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
          "main-deck": Array.from({ length: 6 }, () => woodlandSquirrels),
        },
      },
      playerTwo: {
        champion,
        zones: {
          field: [woodlandSquirrels],
          "main-deck": Array.from({ length: 6 }, () => woodlandSquirrels),
        },
      },
    });
    const player = game.player("player-one");
    const target = game.player("player-two").card(woodlandSquirrels, { zone: "field" });
    const payments = player.cards(woodlandSquirrels, { zone: "hand" });
    const source = player.card(clockworkAmalgam, { zone: "hand" });
    player.activate(source, {
      reservePayment: payments.map((card) => ({ kind: "card", cardId: card.objectId })),
    });
    passEffectsStack(game);
    expect(game.state.decision?.kind).toBe("resolve-effect-choice");
    answerDecision(game, "resolve-effect-choice", [target.objectId]);
    passEffectsStack(game);
    expect(game.state.objects[source.objectId]!.activeDefinitionId).toBe(
      woodlandSquirrels.canonicalId,
    );
    expect(game.state.objects[source.objectId]!.zone).toBe("field");

    advanceToRecollection(game, player.id);
    passEffectsStack(game);
    expect(game.state.decision?.kind).toBe("resolve-optional-effect");
    answerDecision(game, "resolve-optional-effect", true);
    passEffectsStack(game);
    expect(game.state.objects[source.objectId]!.zone).toBe("hand");
  });
});
