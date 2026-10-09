import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { bellOfTheChosen } from "./bell-of-the-chosen.ts";
import { windsOfDestiny } from "../actions/winds-of-destiny.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers dvxsl5klqe-a1 */
describe("Bell of the Chosen — entry quest and return glimpse", () => {
  for (const size of [0, 1, 3])
    for (const placement of ["top", "bottom", "split"] as const)
      it(`glimpses only on return: deck=${size}, placement=${placement}`, () => {
        const champion = enableAllTestElements(
          createClassBonusTestChampion(bellOfTheChosen, false, "activation-discount"),
        );
        const game = GrandArchiveTestEngine.startFixture({
          phase: "materialize",
          playerOne: {
            champion,
            preserveMainDeckOrder: true,
            zones: {
              "material-deck": [bellOfTheChosen],
              hand: [windsOfDestiny, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
              "main-deck": Array.from({ length: size + 1 }, () => woodlandSquirrels),
            },
          },
          playerTwo: { champion, zones: { "main-deck": [woodlandSquirrels] } },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          bell = p.card(bellOfTheChosen),
          hero = p.card(champion);
        const initialDeck = p.zone("main-deck"),
          enemy = q.zone("main-deck");
        p.materialize(bell);
        passEffectsStack(game);
        expect(game.state.objects[hero.objectId]!.counters["named:quest"]).toBe(1);
        expect(game.state.decision).toBeNull();
        expect(p.zone("main-deck")).toEqual(initialDeck);
        advanceToMain(game, p.id);
        const original = p.zone("main-deck");
        p.activate(p.card(windsOfDestiny), {
          targets: { "target-1": [bell.objectId] },
          reservePayment: p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, 3)
            .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
        });
        passEffectsStack(game);
        expect(game.state.objects[bell.objectId]!.zone).toBe("banishment");
        for (let n = 0; n < 40 && game.state.turn.phase !== "end"; n++) {
          const wait = game.waitState();
          if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
          game.player(wait.playerId).pass();
        }
        expect(game.state.turn.phase).toBe("end");
        passEffectsStack(game);
        expect(game.state.objects[bell.objectId]!.zone).toBe("field");
        expect(game.state.objects[hero.objectId]!.counters["named:quest"]).toBe(2);
        const looked = original.slice(0, 2).reverse();
        const bottom =
          placement === "bottom" ? looked : placement === "split" ? looked.slice(0, 1) : [];
        const top = looked.filter((c) => !bottom.includes(c));
        if (size) {
          expect(game.state.decision).toMatchObject({
            kind: "resolve-glimpse",
            playerId: p.id,
            cardIds: original.slice(0, 2).map((c) => c.objectId),
          });
          const before = game.state;
          for (const invalid of [
            [],
            [enemy[0]!.objectId],
            [looked[0]!.objectId, looked[0]!.objectId],
          ]) {
            expect(() =>
              answerDecision(game, "resolve-glimpse", {
                kind: "reorder",
                top: invalid,
                bottom: [],
              }),
            ).toThrow();
            expect(game.state).toEqual(before);
          }
          answerDecision(game, "resolve-glimpse", {
            kind: "reorder",
            top: top.map((c) => c.objectId),
            bottom: bottom.map((c) => c.objectId),
          });
          passEffectsStack(game);
        } else expect(game.state.decision).toBeNull();
        expect(p.zone("main-deck")).toEqual([...top, ...original.slice(2), ...bottom]);
        expect(q.zone("main-deck")).toEqual(enemy);
      });
});
