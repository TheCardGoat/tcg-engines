import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { vengefulParamour } from "./vengeful-paramour.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { spectralDiffusion } from "../actions/spectral-diffusion.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers 4vjkezn49t-a1 @covers 4vjkezn49t-a2 */
describe("Vengeful Paramour — Ephemerate and conditional entry spell", () => {
  for (const ephemerate of [false, true])
    for (const own of [false, true]) {
      it(`pays ${ephemerate ? 4 : 2} and checks ephemeral at entry (self target=${own})`, () => {
        const champion = createClassBonusTestChampion(
          vengefulParamour,
          false,
          "activation-discount",
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              hand: [
                ...(ephemerate ? [] : [vengefulParamour]),
                ...Array.from({ length: 4 }, () => woodlandSquirrels),
              ],
              graveyard: ephemerate ? [vengefulParamour] : [],
              "main-deck": [woodlandSquirrels],
            },
          },
          playerTwo: {
            champion,
            zones: { field: [woodlandSquirrels], "main-deck": [woodlandSquirrels] },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two");
        const source = p.card(vengefulParamour),
          target = (own ? p : q).card(champion);
        const payment = p
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, ephemerate ? 4 : 2)
          .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
        const before = game.state;
        expect(() =>
          p.activate(source, {
            activationMethod: ephemerate ? "ephemerate" : undefined,
            reservePayment: payment.slice(1),
          }),
        ).toThrow();
        expect(game.state).toEqual(before);
        if (ephemerate) {
          expect(() => p.activate(source, { reservePayment: payment })).toThrow();
          expect(game.state).toEqual(before);
        }
        p.activate(source, {
          activationMethod: ephemerate ? "ephemerate" : undefined,
          reservePayment: payment,
        });
        passEffectsStack(game);
        expect(game.state.objects[source.objectId]!.zone).toBe("field");
        expect(game.state.objects[source.objectId]!.states.has("ephemeral")).toBe(ephemerate);
        const announced = game.state;
        expect(() =>
          answerDecision(game, "announce-triggered-ability", {
            targets: { "target-1": [q.card(woodlandSquirrels, { zone: "field" }).objectId] },
          }),
        ).toThrow();
        expect(game.state).toEqual(announced);
        answerDecision(game, "announce-triggered-ability", {
          targets: { "target-1": [target.objectId] },
        });
        expect(game.state.objects[target.objectId]!.damage).toBe(0);
        passEffectsStack(game);
        expect(game.state.objects[target.objectId]!.damage).toBe(ephemerate ? 2 : 0);
        expect(game.state.objects[(own ? q : p).card(champion).objectId]!.damage).toBe(0);
        advanceToMain(game, q.id);
        q.declareAttack(q.card(woodlandSquirrels, { zone: "field" }), source);
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[source.objectId]!.zone).toBe(
          ephemerate ? "banishment" : "graveyard",
        );
      });
    }
});

/** @covers 4vjkezn49t-a2 */
it("announces its entry ability as a Spell and respects opposing Spellshroud", () => {
  const champion = enableAllTestElements(
    createClassBonusTestChampion(vengefulParamour, false, "activation-discount"),
  );
  const game = GrandArchiveTestEngine.startFixture({
    playerOne: {
      champion,
      zones: {
        graveyard: [vengefulParamour],
        hand: Array.from({ length: 4 }, () => woodlandSquirrels),
      },
    },
    playerTwo: {
      champion,
      zones: { hand: [spectralDiffusion, ...Array.from({ length: 4 }, () => woodlandSquirrels)] },
    },
  });
  const p = game.player("player-one"),
    q = game.player("player-two");
  p.pass();
  q.activate(spectralDiffusion, {
    reservePayment: q.cards(woodlandSquirrels).map((c) => ({ kind: "card", cardId: c.objectId })),
  });
  passEffectsStack(game);
  p.activate(p.card(vengefulParamour), {
    activationMethod: "ephemerate",
    reservePayment: p.cards(woodlandSquirrels).map((c) => ({ kind: "card", cardId: c.objectId })),
  });
  passEffectsStack(game);
  const before = game.state;
  expect(() =>
    answerDecision(game, "announce-triggered-ability", {
      targets: { "target-1": [q.card(champion).objectId] },
    }),
  ).toThrow();
  expect(game.state).toEqual(before);
  answerDecision(game, "announce-triggered-ability", {
    targets: { "target-1": [p.card(champion).objectId] },
  });
  passEffectsStack(game);
  expect(game.state.objects[p.card(champion).objectId]!.damage).toBe(2);
  expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(0);
});
