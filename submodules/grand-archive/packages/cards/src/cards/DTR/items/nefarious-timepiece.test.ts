import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { nefariousTimepiece } from "./nefarious-timepiece.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { curvedDagger } from "../../DOA/weapons/curved-dagger.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { evasivePositioning } from "../actions/evasive-positioning.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "../../../testing/decisions.ts";

function reachMaterialization(game: GrandArchiveTestEngine, playerId: string) {
  for (let i = 0; i < 96; i++) {
    const wait = game.waitState();
    if (wait.kind === "materialization-choice" && wait.playerId === playerId) return;
    if (wait.kind === "materialization-choice")
      game.player(wait.playerId).execute({ move: "skip-materialization" });
    else if (wait.kind === "opportunity") game.player(wait.playerId).pass();
    else throw new Error(`Unexpected ${wait.kind}`);
  }
  throw new Error("Materialization not reached");
}

/** @covers h1njd7z5j3-a1 @covers h1njd7z5j3-a2 */
describe("Nefarious Timepiece — entry name and both players' materialization costs", () => {
  for (const own of [false, true])
    for (const named of [false, true])
      for (const memory of [0, 1])
        it(`taxes ${own ? "own" : "opposing"} ${named ? "chosen" : "other"} name with ${memory} memory`, () => {
          const champion = createClassBonusTestChampion(
            nefariousTimepiece,
            false,
            "activation-discount",
          );
          const game = GrandArchiveTestEngine.startFixture({
            phase: "materialize",
            playerOne: {
              champion,
              zones: {
                "material-deck": [nefariousTimepiece, trainingSword, curvedDagger],
                hand: [evasivePositioning, woodlandSquirrels],
                "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
              },
            },
            playerTwo: {
              champion,
              zones: {
                "material-deck": [trainingSword, curvedDagger],
                memory: Array.from({ length: memory }, () => woodlandSquirrels),
                "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
              },
            },
          });
          const p = game.player("player-one"),
            q = game.player("player-two"),
            source = p.card(nefariousTimepiece);
          p.materialize(source);
          passEffectsStack(game);
          expect(game.state.decision).toMatchObject({
            kind: "resolve-effect-choice",
            playerId: p.id,
          });
          expect(game.state.objects[source.objectId]!.zone).toBe("effects-stack");
          for (const invalid of ["Woodland Squirrels", trainingSword.canonicalId]) {
            const before = game.state;
            expect(() => answerDecision(game, "resolve-effect-choice", invalid)).toThrow();
            expect(game.state).toEqual(before);
          }
          answerDecision(game, "resolve-effect-choice", "Training Sword");
          passEffectsStack(game);
          expect(game.state.objects[source.objectId]!.zone).toBe("field");
          advanceToMain(game, p.id);
          if (own && memory) {
            p.activate(evasivePositioning, {
              targets: { "target-1": [p.card(champion).objectId] },
              reservePayment: [
                { kind: "card", cardId: p.cards(woodlandSquirrels, { zone: "hand" })[0]!.objectId },
              ],
            });
            passEffectsStack(game);
          }
          if (own) advanceToMain(game, q.id);
          const owner = own ? p : q;
          reachMaterialization(game, owner.id);
          const target = owner.card(named ? trainingSword : curvedDagger, {
            zone: "material-deck",
          });
          expect(owner.zone("memory")).toHaveLength(memory);
          if (named && !memory) {
            const before = game.state;
            expect(() => owner.materialize(target)).toThrow();
            expect(game.state).toEqual(before);
            return;
          }
          const banished = owner.zone("banishment").length;
          owner.materialize(target);
          expect(owner.zone("memory")).toHaveLength(memory - (named ? 1 : 0));
          expect(owner.zone("banishment")).toHaveLength(banished + (named ? 1 : 0));
          passEffectsStack(game);
          expect(game.state.objects[target.objectId]!.zone).toBe("field");
        });
});

/** @covers h1njd7z5j3-a2 @covers h1njd7z5j3-a3 */
describe("Nefarious Timepiece — paid departure, memory draw and tax removal", () => {
  for (const own of [false, true])
    it(`banishes upfront and stops taxing the ${own ? "controller" : "opponent"}`, () => {
      const champion = createClassBonusTestChampion(
        nefariousTimepiece,
        false,
        "activation-discount",
      );
      const game = GrandArchiveTestEngine.startFixture({
        phase: "materialize",
        playerOne: {
          champion,
          zones: {
            "material-deck": [nefariousTimepiece, trainingSword],
            hand: Array.from({ length: 5 }, () => woodlandSquirrels),
            "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
          },
        },
        playerTwo: {
          champion,
          zones: {
            "material-deck": [trainingSword],
            "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
          },
        },
      });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        source = p.card(nefariousTimepiece);
      p.materialize(source);
      passEffectsStack(game);
      answerDecision(game, "resolve-effect-choice", "Training Sword");
      passEffectsStack(game);
      advanceToMain(game, p.id);
      const deck = p.zone("main-deck"),
        hand = p.zone("hand"),
        payment = p
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, 5)
          .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
      const before = game.state;
      expect(() =>
        p.activateAbility(source, "h1njd7z5j3-a3", { reservePayment: payment.slice(1) }),
      ).toThrow();
      expect(game.state).toEqual(before);
      p.activateAbility(source, "h1njd7z5j3-a3", { reservePayment: payment });
      expect(game.state.objects[source.objectId]!.zone).toBe("banishment");
      expect(p.zone("memory")).toHaveLength(5);
      expect(p.zone("main-deck")).toEqual(deck);
      const paid = game.state;
      expect(() => p.activateAbility(source, "h1njd7z5j3-a3", { reservePayment: [] })).toThrow();
      expect(game.state).toEqual(paid);
      passEffectsStack(game);
      expect(p.zone("memory")).toHaveLength(6);
      expect(game.state.objects[deck[0]!.objectId]!.zone).toBe("memory");
      expect(p.zone("main-deck")).toEqual(deck.slice(1));
      expect(p.zone("hand")).toHaveLength(hand.length - 5);
      expect(q.zone("memory")).toHaveLength(0);
      if (own) advanceToMain(game, q.id);
      const owner = own ? p : q;
      reachMaterialization(game, owner.id);
      const memory = owner.zone("memory");
      owner.materialize(trainingSword);
      passEffectsStack(game);
      expect(owner.zone("memory")).toEqual(memory);
      expect(owner.card(trainingSword, { zone: "field" })).toBeDefined();
    });
});
