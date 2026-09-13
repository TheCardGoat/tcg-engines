import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { proveClassBonusActivationDiscount } from "../../../testing/class-bonus-activation-discount.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { nascentBlast } from "../../P24/actions/nascent-blast.ts";
import { veiledDash } from "./veiled-dash.ts";

/** @covers 08kuz07nk4-a1 */
describe("Veiled Dash — Class Bonus activation discount", () => {
  proveClassBonusActivationDiscount({ card: veiledDash, discount: 2 });
});

/** @covers 08kuz07nk4-a2 */
describe("Veiled Dash — distance and per-unit prevention", () => {
  it("reveals only Wind memory cards and prevents that much damage once for each target", () => {
    const champion = createClassBonusTestChampion(veiledDash, true, "activation-discount");
    const opposingChampion = createClassBonusTestChampion(
      nascentBlast,
      false,
      "activation-discount",
    );
    const game = GrandArchiveTestEngine.startFixture({
      firstPlayer: "playerTwo",
      playerOne: {
        champion,
        zones: {
          hand: [veiledDash, woodlandSquirrels, woodlandSquirrels],
          memory: [veiledDash, veiledDash, woodlandSquirrels],
          field: [giantTortoise],
        },
      },
      playerTwo: {
        champion: opposingChampion,
        zones: {
          hand: [
            nascentBlast,
            nascentBlast,
            nascentBlast,
            ...Array.from({ length: 9 }, () => woodlandSquirrels),
          ],
        },
      },
    });
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    const ownChampion = player.card(champion, { zone: "field" });
    const ally = player.card(giantTortoise, { zone: "field" });
    opponent.pass();
    player.activate(veiledDash, {
      reservePayment: player
        .cards(woodlandSquirrels, { zone: "hand" })
        .map((card) => ({ kind: "card" as const, cardId: card.objectId })),
      targets: { "target-units": [ownChampion.objectId, ally.objectId] },
    });
    passEffectsStack(game);
    expect(game.state.objects[ownChampion.objectId]!.states.has("distant")).toBe(true);
    expect(game.state.objects[ally.objectId]!.states.has("distant")).toBe(true);

    const windCards = player.cards(veiledDash, { zone: "memory" });
    const nonWind = player.cards(woodlandSquirrels, { zone: "memory" })[0]!;
    const beforeInvalid = game.state;
    expect(() =>
      answerDecision(game, "resolve-effect-choice", [windCards[0]!.objectId, nonWind.objectId]),
    ).toThrow();
    expect(game.state).toEqual(beforeInvalid);
    answerDecision(
      game,
      "resolve-effect-choice",
      windCards.map((card) => card.objectId),
    );
    passEffectsStack(game);

    function blast(targetId: typeof ally.objectId): void {
      opponent.activate(opponent.cards(nascentBlast, { zone: "hand" })[0]!, {
        reservePayment: opponent
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, 3)
          .map((card) => ({ kind: "card" as const, cardId: card.objectId })),
        targets: { "target-1": [targetId] },
      });
      passEffectsStack(game);
    }

    blast(ally.objectId);
    expect(game.state.objects[ally.objectId]!.damage).toBe(1);
    blast(ally.objectId);
    expect(game.state.objects[ally.objectId]!.damage).toBe(4);
    blast(ownChampion.objectId);
    expect(game.state.objects[ownChampion.objectId]!.damage).toBe(1);
  });
});
