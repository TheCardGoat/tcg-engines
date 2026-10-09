import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { proveLookRevealAndReturn } from "../../../testing/look-reveal-and-return.ts";
import { modulatingCadence } from "./modulating-cadence.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { eagerPage } from "../../DOA/allies/eager-page.ts";
import { grayWolf } from "../../DOA/allies/gray-wolf.ts";
import { attuneWithTheWinds } from "../../DOA/actions/attune-with-the-winds.ts";
import { songOfNurturing } from "../../DOA/actions/song-of-nurturing.ts";
import { slySongstress } from "../allies/sly-songstress.ts";

/** @covers p5p0azskw4-a1 */
describe("Modulating Cadence — own Animal allies reduce reserve cost with Class Bonus", () => {
  for (const matching of [false, true])
    for (const animals of [0, 1, 3, 4, 5])
      it(`matching=${matching}, animals=${animals}`, () => {
        const champion = createClassBonusTestChampion(
          modulatingCadence,
          matching,
          "activation-discount",
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              hand: [modulatingCadence, ...Array.from({ length: 5 }, () => woodlandSquirrels)],
              field: [
                ...Array.from({ length: animals }, () => woodlandSquirrels),
                eagerPage,
                grayWolf,
              ],
              graveyard: [woodlandSquirrels],
            },
          },
          playerTwo: { champion, zones: { field: [woodlandSquirrels, woodlandSquirrels] } },
        });
        const p = game.player("player-one");
        const payment = p
          .cards(woodlandSquirrels, { zone: "hand" })
          .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
        const cost = matching ? Math.max(0, 4 - animals) : 4;
        const before = game.state;
        for (const invalid of [cost + 1, ...(cost ? [cost - 1] : [])]) {
          expect(() =>
            p.activate(modulatingCadence, { reservePayment: payment.slice(0, invalid) }),
          ).toThrow();
          expect(game.state).toEqual(before);
        }
        p.activate(modulatingCadence, { reservePayment: payment.slice(0, cost) });
        passEffectsStack(game);
        expect(p.zone("memory").map((c) => c.objectId)).toEqual(
          payment.slice(0, cost).map((c) => c.cardId),
        );
        expect(p.card(modulatingCadence, { zone: "graveyard" })).toBeDefined();
        expect(game.state.decision).toBeNull();
      });
});
/** @covers p5p0azskw4-a2 */
describe("Modulating Cadence — reveal Harmony or Melody from the top eight", () => {
  proveLookRevealAndReturn(modulatingCadence, 8, 4, [
    attuneWithTheWinds,
    songOfNurturing,
    slySongstress,
  ]);
});
