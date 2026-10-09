import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import {
  enableAllTestElements,
  grantTestChampionLevel,
} from "../../../testing/class-bonus-test-champion.ts";
import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { favorableWinds } from "../../DOA/actions/favorable-winds.ts";
import { reclaim } from "../../DOA/actions/reclaim.ts";
import { fireball } from "../../DOA/actions/fireball.ts";
import { advantageousPerch } from "../../PTM/actions/advantageous-perch.ts";
import { maidenOfReverentGale } from "./maiden-of-reverent-gale.ts";
/** @covers 5wdysg327b-a2 */
describe("Maiden of Reverent Gale — Diao Chan death recovery", () => {
  for (const matching of [false, true])
    for (const choice of ["none", "wind", "reclaim"])
      it(`Diao Chan=${matching}, eligible=${choice}`, () => {
        const champion = grantTestChampionLevel(
          enableAllTestElements(lineageTestChampion(matching ? "Diao Chan" : "Other", 0)),
          1,
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              field: [maidenOfReverentGale],
              hand: [
                fireball,
                favorableWinds,
                ...Array.from({ length: 4 }, () => woodlandSquirrels),
              ],
              graveyard: [
                advantageousPerch,
                fireball,
                ...(choice === "none" ? [] : [favorableWinds, reclaim]),
              ],
            },
          },
          playerTwo: { champion, zones: { graveyard: [favorableWinds] } },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          maiden = p.card(maidenOfReverentGale);
        p.activate(fireball, {
          reservePayment: p
            .cards(woodlandSquirrels, { zone: "hand" })
            .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
          targets: { "target-1": [maiden.objectId] },
        });
        passEffectsStack(game);
        expect(game.state.objects[maiden.objectId]?.zone).toBe("graveyard");
        const memory = p.zone("memory"),
          hand = p.zone("hand");
        if (matching && choice !== "none") {
          expect(game.state.decision?.kind).toBe("announce-triggered-ability");
          const before = game.state;
          for (const ids of [
            [],
            [p.card(advantageousPerch).objectId],
            [p.cards(fireball, { zone: "graveyard" })[0]!.objectId],
            [q.card(favorableWinds).objectId],
            [p.card(favorableWinds, { zone: "hand" }).objectId],
            [maiden.objectId],
          ]) {
            expect(() =>
              answerDecision(game, "announce-triggered-ability", {
                targets: { "target-card": ids },
              }),
            ).toThrow();
            expect(game.state).toEqual(before);
          }
          const target = p.card(choice === "wind" ? favorableWinds : reclaim, {
            zone: "graveyard",
          });
          answerDecision(game, "announce-triggered-ability", {
            targets: { "target-card": [target.objectId] },
          });
          passEffectsStack(game);
          expect(p.zone("memory")).toEqual([...memory, target]);
          expect(game.state.objects[target.objectId]?.zone).toBe("memory");
        } else {
          expect(game.state.decision).toBeNull();
          expect(p.zone("memory")).toEqual(memory);
        }
        expect(p.zone("hand")).toEqual(hand);
        expect(q.cards(favorableWinds, { zone: "graveyard" })).toHaveLength(1);
      });
});
