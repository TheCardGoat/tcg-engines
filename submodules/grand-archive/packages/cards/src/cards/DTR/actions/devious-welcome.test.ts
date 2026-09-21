import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { deviousWelcome } from "./devious-welcome.ts";
import { evasivePositioning } from "./evasive-positioning.ts";
import { condemnedTrinket } from "../items/condemned-trinket.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "../../../testing/decisions.ts";

function reachPhase(
  game: GrandArchiveTestEngine,
  playerId: string,
  phase: "recollection" | "end",
): void {
  for (let step = 0; step < 128; step++) {
    if (game.state.turn.playerId === playerId && game.state.turn.phase === phase) return;
    const wait = game.waitState();
    if (wait.kind === "materialization-choice")
      game.player(wait.playerId).execute({ move: "skip-materialization" });
    else if (wait.kind === "opportunity") game.player(wait.playerId).pass();
    else throw new Error(`Unexpected ${wait.kind}`);
  }
  throw new Error(`Did not reach ${phase}`);
}

/**
 * @covers vz4kc558yx-a1
 * @covers vz4kc558yx-a2
 */
describe("Devious Welcome — recollection wager on the turn player's activations", () => {
  for (const chosen of ["ACTION", "ALLY"] as const)
    for (const played of ["ACTION", "ALLY", "ability", "none"] as const)
      it(`chooses ${chosen}, opponent activates ${played}`, () => {
        const champion = enableAllTestElements(
          createClassBonusTestChampion(deviousWelcome, false, "activation-discount"),
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              hand: [deviousWelcome, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
              "main-deck": Array.from({ length: 6 }, () => woodlandSquirrels),
            },
          },
          playerTwo: {
            champion,
            zones: {
              hand: [
                evasivePositioning,
                giantTortoise,
                woodlandSquirrels,
                woodlandSquirrels,
                woodlandSquirrels,
                woodlandSquirrels,
              ],
              field: [condemnedTrinket],
              graveyard: [woodlandSquirrels],
              "main-deck": Array.from({ length: 6 }, () => woodlandSquirrels),
            },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two");
        const payment = () =>
          p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, 3)
            .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
        const reject = () => {
          const before = game.state;
          expect(() => p.activate(deviousWelcome, { reservePayment: payment() })).toThrow();
          expect(game.state).toEqual(before);
        };
        reject();
        advanceToMain(game, q.id);
        q.pass();
        reject();
        reachPhase(game, p.id, "recollection");
        reject();
        reachPhase(game, q.id, "recollection");
        q.pass();
        const before = game.state;
        expect(() =>
          p.activate(deviousWelcome, { reservePayment: payment().slice(0, 2) }),
        ).toThrow();
        expect(game.state).toEqual(before);
        const pTop = p.zone("main-deck")[0]!,
          qTop = q.zone("main-deck")[0]!;
        p.activate(deviousWelcome, { reservePayment: payment() });
        expect(p.zone("memory")).toHaveLength(3);
        expect(game.state.objects[pTop.objectId]!.zone).toBe("main-deck");
        expect(game.state.objects[qTop.objectId]!.zone).toBe("main-deck");
        passEffectsStack(game);
        expect(game.state.objects[pTop.objectId]!.zone).toBe("hand");
        expect(game.state.objects[qTop.objectId]!.zone).toBe("hand");
        expect(game.state.decision?.playerId).toBe(p.id);
        const choiceState = game.state;
        expect(() => answerDecision(game, "resolve-effect-choice", ["ITEM"])).toThrow();
        expect(game.state).toEqual(choiceState);
        answerDecision(game, "resolve-effect-choice", [chosen]);
        passEffectsStack(game);
        advanceToMain(game, q.id);
        const qPayment = q
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, played === "ALLY" ? 4 : played === "ability" ? 3 : 1)
          .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
        if (played === "ACTION")
          q.activate(evasivePositioning, {
            reservePayment: qPayment,
            targets: { "target-1": [q.card(champion).objectId] },
          });
        else if (played === "ALLY") q.activate(giantTortoise, { reservePayment: qPayment });
        else if (played === "ability")
          q.activateAbility(condemnedTrinket, "21oy1nd4nw-a1", { reservePayment: qPayment });
        passEffectsStack(game);
        if (played === "ability" && game.state.decision?.kind === "resolve-effect-choice") {
          answerDecision(game, "resolve-effect-choice", [
            q.card(woodlandSquirrels, { zone: "graveyard" }).objectId,
          ]);
          passEffectsStack(game);
        }
        const hand = q.zone("hand").map((c) => c.objectId),
          memory = q.zone("memory").map((c) => c.objectId);
        const pHand = p.zone("hand").map((c) => c.objectId),
          pMemory = p.zone("memory").map((c) => c.objectId);
        reachPhase(game, q.id, "end");
        expect(q.zone("hand").map((c) => c.objectId)).toEqual(hand);
        expect(q.zone("memory").map((c) => c.objectId)).toEqual(memory);
        passEffectsStack(game);
        const loses = played !== chosen;
        expect(q.zone("hand")).toHaveLength(hand.length - Number(loses));
        expect(q.zone("memory")).toHaveLength(memory.length - Number(loses && memory.length > 0));
        for (const ids of [hand, memory]) {
          expect(ids.filter((id) => game.state.objects[id]!.zone === "graveyard")).toHaveLength(
            Number(loses && ids.length > 0),
          );
        }
        expect(p.zone("hand").map((c) => c.objectId)).toEqual(pHand);
        expect(p.zone("memory").map((c) => c.objectId)).toEqual(pMemory);
        advanceToMain(game, p.id);
        reachPhase(game, p.id, "end");
        const laterHand = p.zone("hand").map((c) => c.objectId);
        passEffectsStack(game);
        expect(p.zone("hand").map((c) => c.objectId)).toEqual(laterHand);
      });
});
