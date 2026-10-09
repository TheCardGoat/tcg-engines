import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { hoarfrostHold } from "./hoarfrost-hold.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { glacialGuidance } from "../../DOA/actions/glacial-guidance.ts";
import { suitedTrickery } from "../../DTR/actions/suited-trickery.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
/** @covers DNe5dvCNA1-a1 */
describe("Hoarfrost Hold — Suited Spell choices from hand and memory", () => {
  for (const classBonus of [false, true])
    for (const selected of ["none", "hand", "memory", "both"] as const) {
      it(`banishes only own Suited Spells: class=${classBonus}, selected=${selected}`, () => {
        const champion = enableAllTestElements(
          createClassBonusTestChampion(hoarfrostHold, classBonus, "activation-discount"),
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              hand: [
                hoarfrostHold,
                hoarfrostHold,
                glacialGuidance,
                suitedTrickery,
                woodlandSquirrels,
                woodlandSquirrels,
              ],
              memory: [hoarfrostHold],
              graveyard: [hoarfrostHold],
            },
          },
          playerTwo: { champion, zones: { hand: [hoarfrostHold] } },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          source = p.cards(hoarfrostHold, { zone: "hand" })[0]!;
        p.activate(source, {
          reservePayment: p
            .cards(woodlandSquirrels, { zone: "hand" })
            .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
        });
        passEffectsStack(game);
        const hand = p.card(hoarfrostHold, { zone: "hand" }),
          memory = p.card(hoarfrostHold, { zone: "memory" });
        const chosen =
          selected === "both"
            ? [hand, memory]
            : selected === "hand"
              ? [hand]
              : selected === "memory"
                ? [memory]
                : [];
        if (classBonus) {
          expect(game.state.decision).toMatchObject({
            kind: "resolve-effect-choice",
            playerId: p.id,
          });
          for (const invalid of [
            p.card(glacialGuidance),
            p.card(suitedTrickery),
            p.card(hoarfrostHold, { zone: "graveyard" }),
            q.card(hoarfrostHold),
          ]) {
            const before = game.state;
            expect(() =>
              answerDecision(game, "resolve-effect-choice", [invalid.objectId]),
            ).toThrow();
            expect(game.state).toEqual(before);
          }
          answerDecision(
            game,
            "resolve-effect-choice",
            chosen.map((c) => c.objectId),
          );
          passEffectsStack(game);
        }
        expect(game.state.decision).toBeNull();
        expect(game.state.objects[source.objectId]!.counters["named:frost"] ?? 0).toBe(
          classBonus ? chosen.length : 0,
        );
        expect(p.zone("banishment")).toEqual(classBonus ? expect.arrayContaining(chosen) : []);
        expect(p.zone("banishment")).toHaveLength(classBonus ? chosen.length : 0);
        expect(game.state.objects[hand.objectId]!.zone).toBe(
          classBonus && chosen.includes(hand) ? "banishment" : "hand",
        );
        expect(game.state.objects[memory.objectId]!.zone).toBe(
          classBonus && chosen.includes(memory) ? "banishment" : "memory",
        );
      });
    }
});
