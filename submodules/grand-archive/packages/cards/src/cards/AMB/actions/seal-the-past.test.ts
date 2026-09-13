import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { meadowbloomDryad } from "../../DOA/allies/meadowbloom-dryad.ts";
import { ferventBeastmaster } from "../../DOA/allies/fervent-beastmaster.ts";
import { trainingSword } from "../weapons/training-sword.ts";
import { sealThePast } from "./seal-the-past.ts";

/** @covers 2m31946aki-a1 */
describe("Seal the Past — banish three preserved material cards", () => {
  it("lets the targeted player banish three preserved cards and not a non-preserved one", () => {
    const champion = createClassBonusTestChampion(sealThePast, false, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          hand: [sealThePast, woodlandSquirrels, woodlandSquirrels],
          field: [ferventBeastmaster, ferventBeastmaster, ferventBeastmaster, ferventBeastmaster],
          "material-deck": [trainingSword],
        },
      },
      playerTwo: {
        champion,
        zones: {
          field: [meadowbloomDryad, meadowbloomDryad, meadowbloomDryad, meadowbloomDryad],
          "material-deck": [trainingSword],
        },
      },
    });
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    const dryads = opponent.cards(meadowbloomDryad, { zone: "field" });
    const attackers = player.cards(ferventBeastmaster, { zone: "field" });
    for (const [index, dryad] of dryads.entries()) {
      player.declareAttack(attackers[index]!, dryad);
      game.resolveCombatWithoutRetaliation();
    }
    passEffectsStack(game);
    const preserved = opponent.cards(meadowbloomDryad, { zone: "material-deck" });
    expect(preserved).toHaveLength(4);
    player.activate(sealThePast, {
      reservePayment: player.cards(woodlandSquirrels, { zone: "hand" }).map((card) => ({
        kind: "card" as const,
        cardId: card.objectId,
      })),
      targets: { "target-player": [opponent.id] },
    });
    passEffectsStack(game);
    const nonPreserved = opponent.card(trainingSword, { zone: "material-deck" });
    const beforeInvalid = game.state;
    expect(() =>
      answerDecision(game, "resolve-effect-choice", [
        preserved[0]!.objectId,
        preserved[1]!.objectId,
        nonPreserved.objectId,
      ]),
    ).toThrow();
    expect(game.state).toEqual(beforeInvalid);
    answerDecision(
      game,
      "resolve-effect-choice",
      preserved.slice(0, 3).map((card) => card.objectId),
    );
    passEffectsStack(game);
    for (const card of preserved.slice(0, 3))
      expect(game.state.objects[card.objectId]!.zone).toBe("banishment");
    expect(game.state.objects[preserved[3]!.objectId]!.zone).toBe("material-deck");
    expect(game.state.objects[nonPreserved.objectId]!.zone).toBe("material-deck");
  });
});
