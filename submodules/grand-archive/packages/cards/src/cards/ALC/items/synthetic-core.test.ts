import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import {
  advanceCombatToTrigger,
  answerDecision,
  passEffectsStack,
} from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { carnwennanShroudedEdge } from "../../DOA/weapons/carnwennan-shrouded-edge.ts";
import { automatedGardener } from "../allies/automated-gardener.ts";
import { automatonDrone } from "../tokens/automaton-drone.ts";
import { syntheticCore } from "./synthetic-core.ts";

const abilityId = "w0y6isxy5l-a1";

function combatFixture(subject: "automaton" | "token" | "ordinary" | "opposing") {
  const champion = lineageTestChampion("Synthetic Core test", 0);
  const target =
    subject === "automaton"
      ? automatedGardener
      : subject === "token"
        ? automatonDrone
        : subject === "ordinary"
          ? woodlandSquirrels
          : automatedGardener;
  const opposing = subject === "opposing";
  const game = GrandArchiveTestEngine.startFixture({
    firstPlayer: opposing ? "playerOne" : "playerTwo",
    playerOne: {
      champion,
      zones: {
        field: [syntheticCore, ...(opposing ? [carnwennanShroudedEdge] : [target])],
      },
    },
    playerTwo: {
      champion,
      zones: { field: opposing ? [target] : [carnwennanShroudedEdge] },
    },
  });
  const attacker = game.player(opposing ? "player-one" : "player-two");
  const defender = game.player(opposing ? "player-two" : "player-one");
  attacker.declareAttack(attacker.card(champion), defender.card(target), {
    weaponIds: [attacker.card(carnwennanShroudedEdge).objectId],
  });
  advanceCombatToTrigger(game, abilityId);
  return { game, owner: game.player("player-one"), target };
}

/** @covers w0y6isxy5l-a1 */
describe("Synthetic Core — recover a dying non-token Automaton", () => {
  for (const accept of [false, true]) {
    it(`${accept ? "banishes itself and returns" : "declines to return"} the dead ally`, () => {
      const { game, owner } = combatFixture("automaton");
      const dead = owner.card(automatedGardener, { zone: "graveyard" });
      expect(
        game.state.stack.some(
          (item) => item.kind === "triggered-ability" && item.ability.id === abilityId,
        ),
      ).toBe(true);
      passEffectsStack(game);
      expect(game.state.decision?.kind).toBe("resolve-optional-effect");
      answerDecision(game, "resolve-optional-effect", accept);
      passEffectsStack(game);

      expect(owner.cards(syntheticCore, { zone: accept ? "banishment" : "field" })).toHaveLength(1);
      expect(owner.cards(automatedGardener, { zone: accept ? "memory" : "graveyard" })).toEqual([
        dead,
      ]);
      expect(game.state.decision).toBeNull();
    });
  }

  for (const subject of ["token", "ordinary", "opposing"] as const) {
    it(`does not trigger for a ${subject} death`, () => {
      const { game, owner } = combatFixture(subject);
      expect(
        game.state.stack.some(
          (item) => item.kind === "triggered-ability" && item.ability.id === abilityId,
        ),
      ).toBe(false);
      expect(owner.cards(syntheticCore, { zone: "field" })).toHaveLength(1);
      expect(game.state.decision).toBeNull();
    });
  }
});
