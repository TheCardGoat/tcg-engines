import { describe, expect, it } from "vitest";

import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import {
  advanceToMain,
  startWithShiftingCurrentsNorth,
} from "../../../testing/shifting-currents.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { meadowbloomDryad } from "../../DOA/allies/meadowbloom-dryad.ts";
import { ferventBeastmaster } from "../../DOA/allies/fervent-beastmaster.ts";
import { trainingSword } from "../weapons/training-sword.ts";
import { channelManifoldDesire } from "./channel-manifold-desire.ts";

/** @covers kywpjf1b4k-a1 */
/** @covers kywpjf1b4k-a2 */
describe("Channel Manifold Desire — banish preserved then Empower", () => {
  it("requires a preserved material card, empowers its reserve cost plus two, and may return another preserved card facing North", () => {
    const game = startWithShiftingCurrentsNorth({
      playerOneZones: {
        hand: [
          channelManifoldDesire,
          meadowbloomDryad,
          meadowbloomDryad,
          ...Array.from({ length: 8 }, () => woodlandSquirrels),
        ],
        "material-deck": [trainingSword],
      },
      playerTwoZones: {
        field: [ferventBeastmaster, ferventBeastmaster],
      },
    });
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    for (const dryad of player.cards(meadowbloomDryad, { zone: "hand" })) {
      player.activate(dryad, {
        reservePayment: player
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, 2)
          .map((card) => ({ kind: "card" as const, cardId: card.objectId })),
      });
      passEffectsStack(game);
      if (game.state.decision?.kind === "announce-triggered-ability") {
        answerDecision(game, "announce-triggered-ability", {
          targets: { "target-1": [player.card(meadowbloomDryad, { zone: "field" }).objectId] },
        });
        passEffectsStack(game);
      }
    }
    advanceToMain(game, opponent.id);
    const attackers = opponent.cards(ferventBeastmaster, { zone: "field" });
    const dryads = player.cards(meadowbloomDryad, { zone: "field" });
    for (const [index, dryad] of dryads.entries()) {
      opponent.declareAttack(attackers[index]!, dryad);
      game.resolveCombatWithoutRetaliation();
    }
    passEffectsStack(game);
    advanceToMain(game, player.id);
    const preserved = player.cards(meadowbloomDryad, { zone: "material-deck" });
    expect(preserved.length).toBeGreaterThanOrEqual(2);

    const payment = player
      .cards(woodlandSquirrels, { zone: "hand" })
      .slice(0, 2)
      .map((card) => ({ kind: "card" as const, cardId: card.objectId }));
    const sword = player.card(trainingSword, { zone: "material-deck" });
    const before = game.state;
    expect(() =>
      player.activate(channelManifoldDesire, {
        reservePayment: payment,
        costSelections: [[sword.objectId]],
      }),
    ).toThrow();
    expect(game.state).toEqual(before);

    const chosen = preserved[0]!;
    const leftover = preserved[1]!;
    player.activate(channelManifoldDesire, {
      reservePayment: payment,
      costSelections: [[chosen.objectId]],
    });
    expect(game.state.objects[chosen.objectId]!.zone).toBe("banishment");
    passEffectsStack(game);
    expect(game.state.players[player.id]!.states.empower).toBe(4);
    if (game.state.decision?.kind === "resolve-optional-effect") {
      answerDecision(game, "resolve-optional-effect", true);
      passEffectsStack(game);
    }
    if (game.state.decision?.kind === "resolve-effect-choice") {
      answerDecision(game, "resolve-effect-choice", [leftover.objectId]);
      passEffectsStack(game);
    }
    expect(game.state.objects[leftover.objectId]!.zone).toBe("hand");
  });
});
