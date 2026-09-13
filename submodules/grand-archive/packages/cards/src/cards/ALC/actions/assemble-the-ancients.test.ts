import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { oasisTradingPost } from "../domains/oasis-trading-post.ts";
import { automatonDrone } from "../tokens/automaton-drone.ts";
import { assembleTheAncients } from "./assemble-the-ancients.ts";

/** @covers moi0a5uhjx-a1 */
describe("Assemble the Ancients — sacrificed domains become enhanced Drones", () => {
  it("summons one rested Drone per committed sacrifice, gives each the total buffs, and grants Vigor", () => {
    const champion = createClassBonusTestChampion(
      assembleTheAncients,
      false,
      "activation-discount",
    );
    const game = GrandArchiveTestEngine.startFixture({
      definitions: [automatonDrone],
      playerOne: {
        champion,
        zones: {
          hand: [assembleTheAncients, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
          field: [oasisTradingPost, oasisTradingPost],
        },
      },
      playerTwo: { champion, zones: { field: [oasisTradingPost] } },
    });
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    const domains = player.cards(oasisTradingPost, { zone: "field" });
    player.activate(assembleTheAncients, {
      reservePayment: player
        .cards(woodlandSquirrels, { zone: "hand" })
        .map((card) => ({ kind: "card" as const, cardId: card.objectId })),
    });
    passEffectsStack(game);
    const beforeInvalid = game.state;
    expect(() =>
      answerDecision(game, "resolve-effect-choice", [
        opponent.card(oasisTradingPost, { zone: "field" }).objectId,
      ]),
    ).toThrow();
    expect(game.state).toEqual(beforeInvalid);
    answerDecision(
      game,
      "resolve-effect-choice",
      domains.map((card) => card.objectId),
    );
    passEffectsStack(game);

    expect(player.cards(oasisTradingPost, { zone: "graveyard" })).toEqual(domains);
    const drones = player.cards(automatonDrone, { zone: "field" });
    expect(drones).toHaveLength(2);
    for (const drone of drones) {
      expect(game.state.objects[drone.objectId]!.states.has("rested")).toBe(true);
      expect(game.state.objects[drone.objectId]!.counters.buff).toBe(2);
    }

    for (
      let step = 0;
      step < 32 && !(game.state.turn.phase === "end" && game.state.stack.length > 0);
      step++
    ) {
      const decision = game.state.decision;
      if (decision?.kind === "order-triggered-abilities") {
        answerDecision(game, decision.kind, decision.pendingTriggerIds);
        continue;
      }
      const wait = game.waitState();
      if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
      game.player(wait.playerId).pass();
    }
    expect(game.state.turn.phase).toBe("end");
    expect(game.state.stack).not.toHaveLength(0);
    passEffectsStack(game);
    for (const drone of drones) {
      expect(game.state.objects[drone.objectId]!.states.has("rested")).toBe(false);
    }
  });
});
