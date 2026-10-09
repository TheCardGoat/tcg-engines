import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import { describe, expect, it } from "vitest";
import { armoredValkyrie } from "./armored-valkyrie.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { glacialGuidance } from "../../DOA/actions/glacial-guidance.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers zk96yd609g-a1 */
/** @covers zk96yd609g-a2 */
describe("Armored Valkyrie — Steadfast retaliation and conditional power", () => {
  for (const matching of [false, true])
    for (const rested of [false, true])
      for (const retaliate of [false, true]) {
        it(`class=${matching}, rested=${rested}, retaliate=${retaliate}`, () => {
          const champion = enableAllTestElements(
            createClassBonusTestChampion(armoredValkyrie, matching, "activation-discount"),
          );
          const game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion,
              zones: { field: [giantTortoise], hand: [glacialGuidance, woodlandSquirrels] },
            },
            playerTwo: { champion, zones: { field: [armoredValkyrie] } },
          });
          const p = game.player("player-one"),
            q = game.player("player-two"),
            attacker = p.card(giantTortoise),
            defender = q.card(armoredValkyrie);
          const power = () =>
            deriveGrandArchiveNumericProperty(game.state.objects[defender.objectId]!, "power", {
              program: game.program,
              state: game.state,
              controllerId: q.id,
              bindings: {},
            });
          if (rested) {
            p.activate(glacialGuidance, {
              reservePayment: [{ kind: "card", cardId: p.card(woodlandSquirrels).objectId }],
              targets: { "target-1": [defender.objectId] },
            });
            passEffectsStack(game);
          }
          expect(power()).toBe(2);
          p.declareAttack(attacker, defender);
          let offered = false;
          for (let step = 0; game.state.combat && step < 64; step++) {
            if (game.state.decision?.kind === "choose-retaliators") {
              offered = true;
              answerDecision(game, "choose-retaliators", retaliate ? [defender.objectId] : []);
              expect(power()).toBe(retaliate && matching ? 4 : 2);
              expect(game.state.objects[defender.objectId]!.states.has("rested")).toBe(rested);
            } else {
              const wait = game.waitState();
              if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
              game.player(wait.playerId).pass();
            }
          }
          expect(offered).toBe(true);
          expect(game.state.combat).toBeNull();
          expect(game.state.objects[attacker.objectId]!.damage).toBe(
            retaliate ? (matching ? 4 : 2) : 0,
          );
          expect(game.state.objects[defender.objectId]!.damage).toBe(1);
          expect(game.state.objects[defender.objectId]!.states.has("rested")).toBe(rested);
          expect(power()).toBe(2);
        });
      }
});
