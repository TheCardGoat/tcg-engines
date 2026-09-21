import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { proveClassBonusStealth } from "../../../testing/class-bonus-stealth.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision } from "../../../testing/decisions.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { tweedledumRattledDancer } from "./tweedledum-rattled-dancer.ts";

/** @covers UmZpK4rt2M-a1 */
describe("Tweedledum, Rattled Dancer — Class Bonus Stealth", () => {
  proveClassBonusStealth(tweedledumRattledDancer);
});

/** @covers UmZpK4rt2M-a2 */
describe("Tweedledum, Rattled Dancer — delegated defender", () => {
  it("requires an opponent selection and lets that opponent choose its defending unit", () => {
    const champion = createClassBonusTestChampion(
      tweedledumRattledDancer,
      false,
      "activation-discount",
    );
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: { champion, zones: { field: [tweedledumRattledDancer] } },
      playerTwo: { champion, zones: { field: [giantTortoise, woodlandSquirrels] } },
    });
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    const source = player.card(tweedledumRattledDancer);
    const before = game.state;
    expect(() => player.declareAttack(source, opponent.card(champion))).toThrow();
    expect(game.state).toEqual(before);
    player.execute({
      move: "declare-attack",
      attackerId: source.objectId,
      targetIds: [],
      delegatePlayerId: opponent.id,
    });
    expect(game.state.decision).toMatchObject({
      kind: "choose-delegated-defender",
      playerId: opponent.id,
    });
    const chosen = opponent.card(giantTortoise);
    const decision = game.state.decision;
    if (decision?.kind !== "choose-delegated-defender") {
      throw new Error("Expected delegated defender choice");
    }
    expect(() =>
      player.execute({
        move: "answer-decision",
        decisionId: decision.id,
        stateVersion: decision.stateVersion,
        answer: chosen.objectId,
      }),
    ).toThrow();
    answerDecision(game, "choose-delegated-defender", chosen.objectId);
    expect(game.state.combat?.targetIds).toEqual([chosen.objectId]);
    expect(game.state.objects[source.objectId]!.states.has("rested")).toBe(true);
  });
});
