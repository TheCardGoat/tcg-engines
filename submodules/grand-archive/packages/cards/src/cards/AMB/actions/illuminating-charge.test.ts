import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { galesMare } from "../../RDO/allies/gales-mare.ts";
import { fireball } from "../../DOA/actions/fireball.ts";
import { illuminatingCharge } from "./illuminating-charge.ts";

/** @covers 6ddfdn8y9f-a1 */
describe("Illuminating Charge — put Animals from memory onto the field", () => {
  it("puts up to two revealed Animals onto the field and rejects non-Animals", () => {
    const champion = createClassBonusTestChampion(illuminatingCharge, false, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          hand: [illuminatingCharge, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
          memory: [woodlandSquirrels, galesMare, fireball],
        },
      },
      playerTwo: { champion },
    });
    const player = game.player("player-one");
    const animal = player.card(woodlandSquirrels, { zone: "memory" });
    const horse = player.card(galesMare, { zone: "memory" });
    const spell = player.card(fireball, { zone: "memory" });
    player.activate(illuminatingCharge, {
      reservePayment: player.cards(woodlandSquirrels, { zone: "hand" }).map((card) => ({
        kind: "card" as const,
        cardId: card.objectId,
      })),
    });
    passEffectsStack(game);
    const beforeInvalid = game.state;
    expect(() =>
      answerDecision(game, "resolve-effect-choice", [spell.objectId, animal.objectId]),
    ).toThrow();
    expect(game.state).toEqual(beforeInvalid);
    answerDecision(game, "resolve-effect-choice", [animal.objectId, horse.objectId]);
    passEffectsStack(game);
    expect(game.state.objects[animal.objectId]!.zone).toBe("field");
    expect(game.state.objects[horse.objectId]!.zone).toBe("field");
    expect(game.state.objects[spell.objectId]!.zone).toBe("memory");
  });
});
