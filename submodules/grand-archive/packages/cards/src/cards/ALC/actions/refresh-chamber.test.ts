import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { cascadingRound } from "../items/cascading-round.ts";
import { navigateTheStreets } from "./navigate-the-streets.ts";
import { refreshChamber } from "./refresh-chamber.ts";

/** @covers 7nk45swaf8-a1 */
describe("Refresh Chamber — Bullet materialization and Floating Memory recycle", () => {
  it("pays the Bullet's cost, banishes an eligible graveyard card, and moves itself to memory", () => {
    const champion = createClassBonusTestChampion(refreshChamber, true, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          hand: [refreshChamber, ...Array.from({ length: 5 }, () => woodlandSquirrels)],
          graveyard: [navigateTheStreets, woodlandSquirrels],
          "material-deck": [cascadingRound],
        },
      },
      playerTwo: { champion },
    });
    const player = game.player("player-one");
    const payments = player.cards(woodlandSquirrels, { zone: "hand" });
    const action = player.card(refreshChamber, { zone: "hand" });
    const bullet = player.card(cascadingRound, { zone: "material-deck" });
    const eligible = player.card(navigateTheStreets, { zone: "graveyard" });
    const ineligible = player.card(woodlandSquirrels, { zone: "graveyard" });
    player.activate(action, {
      reservePayment: payments
        .slice(0, 2)
        .map((card) => ({ kind: "card" as const, cardId: card.objectId })),
    });
    passEffectsStack(game);
    if (game.state.decision?.kind === "resolve-effect-choice")
      answerDecision(game, "resolve-effect-choice", [bullet.objectId]);
    expect(game.state.decision?.kind).toBe("announce-effect-materialization");
    answerDecision(game, "announce-effect-materialization", {});
    passEffectsStack(game);
    expect(game.state.decision?.kind).toBe("resolve-optional-effect");
    answerDecision(game, "resolve-optional-effect", true);

    if (game.state.decision?.kind === "resolve-effect-choice") {
      const beforeInvalid = game.state;
      expect(() => answerDecision(game, "resolve-effect-choice", [ineligible.objectId])).toThrow();
      expect(game.state).toEqual(beforeInvalid);
      answerDecision(game, "resolve-effect-choice", [eligible.objectId]);
    }
    passEffectsStack(game);

    expect(player.cards(cascadingRound, { zone: "field" })).toHaveLength(1);
    expect(game.state.objects[eligible.objectId]!.zone).toBe("banishment");
    expect(game.state.objects[action.objectId]!.zone).toBe("memory");
  });
});
