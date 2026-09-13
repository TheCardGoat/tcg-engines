import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { curvedDagger } from "../../DOA/weapons/curved-dagger.ts";
import { assassinsMantle } from "../../P24/items/assassins-mantle.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { fatalTimepiece } from "./fatal-timepiece.ts";

const abilityId = "6gvnta6qse-a1";

/** @covers 6gvnta6qse-a1 */
describe("Fatal Timepiece — each player's materialization history", () => {
  for (const activePlayer of ["player-one", "player-two"] as const) {
    for (const materialized of [false, true]) {
      it(`${activePlayer} materialized=${materialized}`, () => {
        const champion = lineageTestChampion("Fatal Timepiece test", 0);
        const game = GrandArchiveTestEngine.startFixture({
          firstPlayer: activePlayer === "player-one" ? "playerOne" : "playerTwo",
          phase: "materialize",
          playerOne: {
            champion,
            zones: {
              field: [fatalTimepiece, assassinsMantle],
              "material-deck": activePlayer === "player-one" ? [curvedDagger] : [],
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
            },
          },
          playerTwo: {
            champion,
            zones: {
              "material-deck": activePlayer === "player-two" ? [curvedDagger] : [],
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
            },
          },
        });
        const actor = game.player(activePlayer);
        const other = game.player(activePlayer === "player-one" ? "player-two" : "player-one");
        const actorChampion = actor.card(champion);
        const otherChampion = other.card(champion);
        if (materialized) actor.materialize(curvedDagger);
        else actor.execute({ move: "skip-materialization" });

        for (
          let step = 0;
          !game.state.stack.some(
            (item) => item.kind === "triggered-ability" && item.ability.id === abilityId,
          ) && step < 32;
          step++
        ) {
          const wait = game.waitState();
          if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
          game.player(wait.playerId).pass();
        }
        expect(game.state.turn).toMatchObject({ playerId: actor.id, phase: "recollection" });
        expect(
          game.state.stack.some(
            (item) => item.kind === "triggered-ability" && item.ability.id === abilityId,
          ),
        ).toBe(true);
        expect(game.state.objects[actorChampion.objectId]!.damage).toBe(0);
        passEffectsStack(game);
        const attemptedPrevention = activePlayer === "player-one" && !materialized;
        if (attemptedPrevention) {
          expect(game.state.decision?.kind).toBe("choose-replacement");
          answerDecision(game, "choose-replacement", true);
          passEffectsStack(game);
        }

        expect(game.state.objects[actorChampion.objectId]!.damage).toBe(materialized ? 0 : 2);
        expect(game.state.objects[otherChampion.objectId]!.damage).toBe(0);
        expect(
          game
            .player("player-one")
            .cards(assassinsMantle, { zone: attemptedPrevention ? "banishment" : "field" }),
        ).toHaveLength(1);
        expect(game.state.decision).toBeNull();
      });
    }
  }
});
