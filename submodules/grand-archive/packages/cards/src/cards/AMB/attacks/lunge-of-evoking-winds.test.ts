import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { namedClassBonusChampion } from "../../../testing/class-bonus-level.ts";
import {
  advanceCombatToTrigger,
  answerDecision,
  declareResolvedAttack,
  passEffectsStack,
} from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { galesMare } from "../../RDO/allies/gales-mare.ts";
import { lungeOfEvokingWinds } from "./lunge-of-evoking-winds.ts";

/** @covers kDCEtGnZZe-a1 */
describe("Lunge of Evoking Winds — Jin Bonus On Hit", () => {
  it("returns revealed wind cards from memory to hand", () => {
    const { starter } = namedClassBonusChampion(lungeOfEvokingWinds, "Jin", true);
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion: starter,
        zones: {
          hand: [lungeOfEvokingWinds, woodlandSquirrels, woodlandSquirrels],
          memory: [galesMare, galesMare, woodlandSquirrels],
        },
      },
      playerTwo: { champion: lineageTestChampion("Opponent", 0) },
    });
    const player = game.player("player-one");
    const attacker = player.card(starter, { zone: "field" });
    const winds = player.cards(galesMare, { zone: "memory" });
    player.activate(lungeOfEvokingWinds, {
      attackAttackerId: attacker.objectId,
      reservePayment: player
        .cards(woodlandSquirrels, { zone: "hand" })
        .map((ref) => ({ kind: "card" as const, cardId: ref.objectId })),
    });
    passEffectsStack(game);
    declareResolvedAttack(
      game,
      attacker.objectId,
      game.player("player-two").card(lineageTestChampion("Opponent", 0), { zone: "field" })
        .objectId,
      "declare Lunge of Evoking Winds",
    );
    advanceCombatToTrigger(game, "kDCEtGnZZe-a1");
    passEffectsStack(game);
    if (game.state.decision?.kind === "resolve-effect-choice") {
      const squirrel = player.cards(woodlandSquirrels, { zone: "memory" })[0]!;
      const before = game.state;
      expect(() => answerDecision(game, "resolve-effect-choice", [squirrel.objectId])).toThrow();
      expect(game.state).toEqual(before);
      answerDecision(
        game,
        "resolve-effect-choice",
        winds.map((card) => card.objectId),
      );
      passEffectsStack(game);
    }
    if (game.state.combat) game.resolveCombatWithoutRetaliation();
    expect(player.cards(galesMare, { zone: "hand" })).toHaveLength(2);
    expect(player.cards(galesMare, { zone: "memory" })).toHaveLength(0);
  });
});
