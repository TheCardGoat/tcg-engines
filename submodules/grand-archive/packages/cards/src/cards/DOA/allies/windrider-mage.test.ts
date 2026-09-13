import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { windriderMage } from "./windrider-mage.ts";
import { woodlandSquirrels } from "./woodland-squirrels.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
/** @covers ZfCtSldRIy-a2 */
describe("Windrider Mage's own recollection return", () => {
  for (const classBonus of [false, true])
    for (const accept of [false, true])
      it(`class=${classBonus}, accept=${accept}`, () => {
        const champion = createClassBonusTestChampion(
            windriderMage,
            classBonus,
            "activation-discount",
          ),
          game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion,
              zones: {
                field: [windriderMage],
                "main-deck": [woodlandSquirrels, woodlandSquirrels],
              },
            },
            playerTwo: { champion, zones: { "main-deck": [woodlandSquirrels, woodlandSquirrels] } },
          });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          source = p.card(windriderMage),
          hero = p.card(champion);
        advanceToMain(game, q.id);
        expect(game.state.objects[source.objectId]!.zone).toBe("field");
        expect(game.state.objects[hero.objectId]!.counters.enlighten ?? 0).toBe(0);
        if (classBonus) {
          for (let step = 0; step < 64 && !game.state.decision; step++) {
            const wait = game.waitState();
            if (wait.kind === "materialization-choice")
              game.player(wait.playerId).execute({ move: "skip-materialization" });
            else if (wait.kind === "opportunity") game.player(wait.playerId).pass();
            else throw new Error(`Unexpected ${wait.kind}`);
          }
          expect(game.state.decision?.kind).toBe("resolve-optional-effect");
          expect(game.state.decision?.playerId).toBe(p.id);
          answerDecision(game, "resolve-optional-effect", accept);
          passEffectsStack(game);
        }
        advanceToMain(game, p.id);
        expect(game.state.objects[source.objectId]!.zone).toBe(
          classBonus && accept ? "hand" : "field",
        );
        expect(game.state.objects[hero.objectId]!.counters.enlighten ?? 0).toBe(
          classBonus && accept ? 1 : 0,
        );
        expect(game.state.objects[q.card(champion).objectId]!.counters.enlighten ?? 0).toBe(0);
      });
});
