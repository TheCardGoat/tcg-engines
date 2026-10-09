import { describe } from "vitest";

import { proveOnEnterDraw } from "../../../testing/on-enter-draw.ts";
import { stiflingGyre } from "./stifling-gyre.ts";

/** @covers OADTyAUBZt-a2 */
describe("Stifling Gyre — entry draw", () => {
  proveOnEnterDraw({
    card: stiflingGyre,
    abilityId: "OADTyAUBZt-a2",
    cost: { kind: "reserve", amount: 3 },
    asEntersChoice: "Woodland Squirrels",
    destination: "memory",
  });
});

import { proveAsEntersChoice } from "../../../testing/as-enters-choice.ts";
/** @covers OADTyAUBZt-a1 */
describe("stiflingGyre — entry choice", () => {
  proveAsEntersChoice(stiflingGyre, "ally");
});

import { expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { driftingRogue } from "../../AMB/allies/drifting-rogue.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers OADTyAUBZt-a3 */
describe("Stifling Gyre — named entry trigger tax", () => {
  for (const own of [false, true])
    for (const matching of [false, true])
      for (const pay of [false, true]) {
        it(`taxes the entry trigger: own=${own}, named=${matching}, pay=${pay}`, () => {
          const champion = enableAllTestElements(
            createClassBonusTestChampion(stiflingGyre, false, "activation-discount"),
          );
          const game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion,
              zones: {
                hand: [
                  stiflingGyre,
                  driftingRogue,
                  ...Array.from({ length: 10 }, () => woodlandSquirrels),
                ],
                "main-deck": [giantTortoise, giantTortoise, giantTortoise],
              },
            },
            playerTwo: {
              champion,
              zones: {
                hand: [driftingRogue, ...Array.from({ length: 7 }, () => woodlandSquirrels)],
                "main-deck": [giantTortoise, giantTortoise, giantTortoise],
              },
            },
          });
          const p = game.player("player-one"),
            q = game.player("player-two");
          p.activate(stiflingGyre, {
            reservePayment: p
              .cards(woodlandSquirrels, { zone: "hand" })
              .slice(0, 3)
              .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
          });
          passEffectsStack(game);
          answerDecision(
            game,
            "resolve-effect-choice",
            matching ? "Drifting Rogue" : "Woodland Squirrels",
          );
          passEffectsStack(game);
          if (!own) advanceToMain(game, q.id);
          const player = own ? p : q,
            other = own ? q : p,
            source = player.card(driftingRogue);
          player.activate(source, {
            reservePayment: player
              .cards(woodlandSquirrels, { zone: "hand" })
              .slice(0, 3)
              .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
          });
          passEffectsStack(game);
          const memory = player.zone("memory").length;
          if (matching) {
            expect(game.state.decision).toMatchObject({
              kind: "resolve-effect-payment",
              playerId: player.id,
            });
            expect(
              game.state.objects[player.card(champion).objectId]!.counters.preparation ?? 0,
            ).toBe(0);
            if (pay) {
              const payment = player
                .cards(woodlandSquirrels, { zone: "hand" })
                .slice(0, 4)
                .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
              const before = game.state;
              expect(() =>
                answerDecision(game, "resolve-effect-payment", {
                  reservePayment: payment.slice(1),
                }),
              ).toThrow();
              expect(game.state).toEqual(before);
              answerDecision(game, "resolve-effect-payment", { reservePayment: payment });
            } else answerDecision(game, "resolve-effect-payment", false);
            passEffectsStack(game);
          }
          expect(game.state.decision).toBeNull();
          expect(game.state.stack).toHaveLength(0);
          expect(player.zone("field")).toContainEqual(source);
          expect(player.zone("memory")).toHaveLength(memory + (matching && pay ? 4 : 0));
          expect(
            game.state.objects[player.card(champion).objectId]!.counters.preparation ?? 0,
          ).toBe(!matching || pay ? 1 : 0);
          expect(game.state.objects[other.card(champion).objectId]!.counters.preparation ?? 0).toBe(
            0,
          );
        });
      }
});
