import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { lineageTestChampion, proveChampionLineage } from "../../../testing/champion-lineage.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { summonSentinels } from "../actions/summon-sentinels.ts";
import { aurousteelGreatsword } from "../tokens/aurousteel-greatsword.ts";
import { automatonDrone } from "../tokens/automaton-drone.ts";
import { tonorisCreationsWill } from "./tonoris-creations-will.ts";

/** @covers n2jnltv5kl-a1 */
describe("tonoris-creations-will — Lineage", () => {
  proveChampionLineage({
    card: tonorisCreationsWill,
    lineageName: "Tonoris",
    level: 3,
    memoryCost: 3,
  });
});

/** @covers n2jnltv5kl-a2 */
/** @covers n2jnltv5kl-a3 */
describe("Tonoris, Creation's Will — Greatsword tokens", () => {
  it("replaces a token summon, then lets one token weapon empower another", () => {
    const starter = lineageTestChampion("Tonoris", 0);
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion: starter,
        lineage: [
          lineageTestChampion("Tonoris", 1),
          lineageTestChampion("Tonoris", 2),
          tonorisCreationsWill,
        ],
        zones: {
          hand: [summonSentinels, ...Array.from({ length: 4 }, () => woodlandSquirrels)],
        },
      },
      playerTwo: { champion: lineageTestChampion("Opponent", 0) },
      definitions: [automatonDrone, aurousteelGreatsword],
    });
    const player = game.player("player-one");
    player.activate(summonSentinels, {
      reservePayment: player
        .cards(woodlandSquirrels, { zone: "hand" })
        .map((card) => ({ kind: "card", cardId: card.objectId })),
    });
    passEffectsStack(game);
    expect(game.state.decision).toMatchObject({ kind: "choose-replacement", mode: "optional" });
    answerDecision(game, "choose-replacement", true);
    passEffectsStack(game);
    expect(player.cards(automatonDrone, { zone: "field" })).toHaveLength(0);
    const swords = player.cards(aurousteelGreatsword, { zone: "field" });
    expect(swords).toHaveLength(2);

    const [sacrifice, target] = swords;
    player.activateAbility(sacrifice!, "granted-n2jnltv5kl-a3", {
      targets: { "target-weapon": [target!.objectId] },
    });
    expect(game.state.objects[sacrifice!.objectId]).toBeUndefined();
    passEffectsStack(game);
    expect(
      deriveGrandArchiveNumericProperty(game.state.objects[target!.objectId]!, "power", {
        program: game.program,
        state: game.state,
        controllerId: player.id,
        bindings: {},
      }),
    ).toBe(6);
  });
});
