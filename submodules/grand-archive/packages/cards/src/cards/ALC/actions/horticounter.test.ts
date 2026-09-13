import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { springleaf } from "../tokens/springleaf.ts";
import { horticounter } from "./horticounter.ts";

/** @covers vve1szpv86-a1 */
/** @covers vve1szpv86-a2 */
describe("Horticounter — variable Herb tax", () => {
  it("sacrifices Y Herbs, taxes the activation by X+Y, then banishes and glimpses", () => {
    const champion = createClassBonusTestChampion(horticounter, false, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      firstPlayer: "playerTwo",
      playerOne: {
        champion,
        zones: {
          field: [springleaf, springleaf],
          hand: [horticounter],
          "main-deck": [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
        },
      },
      playerTwo: {
        champion,
        zones: { hand: [woodlandSquirrels, woodlandSquirrels] },
      },
    });
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    const target = opponent.cards(woodlandSquirrels, { zone: "hand" })[0]!;
    opponent.activate(target);
    const targetActivation = game.state.stack.at(-1);
    if (targetActivation?.kind !== "card-activation") throw new Error("Expected a card activation");
    opponent.pass();

    const herbs = player.cards(springleaf, { zone: "field" });
    player.activate(horticounter, {
      variables: { X: 0, Y: 2 },
      costSelections: [herbs.map((herb) => herb.objectId)],
      targets: { "target-stack-item": [targetActivation.id] },
    });
    expect(player.cards(springleaf, { zone: "field" })).toHaveLength(0);
    for (const herb of herbs) expect(game.state.objects[herb.objectId]).toBeUndefined();

    passEffectsStack(game);
    expect(game.state.decision).toMatchObject({
      kind: "resolve-effect-payment",
      playerId: opponent.id,
    });
    answerDecision(game, "resolve-effect-payment", false);
    passEffectsStack(game);

    expect(opponent.cards(target, { zone: "banishment" })).toHaveLength(1);
    const glimpse = game.state.decision;
    if (glimpse?.kind !== "resolve-glimpse") throw new Error("Expected Glimpse 3");
    expect(glimpse.cardIds).toHaveLength(3);
    answerDecision(game, "resolve-glimpse", { kind: "reorder", top: [], bottom: glimpse.cardIds });
    passEffectsStack(game);
    expect(game.state.stack).toHaveLength(0);
  });
});
