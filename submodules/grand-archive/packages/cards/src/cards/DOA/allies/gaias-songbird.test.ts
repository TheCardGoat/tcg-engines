import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { gaiasSongbird } from "./gaias-songbird.ts";
import { woodlandSquirrels } from "./woodland-squirrels.ts";
import { eagerPage } from "./eager-page.ts";
import { grayWolf } from "./gray-wolf.ts";
import { blitzMage } from "./blitz-mage.ts";
import { acceptedContract } from "../actions/accepted-contract.ts";
/** @covers sHzSmygjWY-a1 */
describe("Gaia's Songbird reveals through the first Beast ally only with class bonus", () => {
  for (const classBonus of [false, true])
    for (const found of [false, true])
      it(`class=${classBonus}, Beast exists=${found}`, () => {
        const champion = createClassBonusTestChampion(
            gaiasSongbird,
            classBonus,
            "activation-discount",
          ),
          game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion,
              zones: {
                hand: [gaiasSongbird, woodlandSquirrels],
                "main-deck": [
                  eagerPage,
                  woodlandSquirrels,
                  acceptedContract,
                  ...(found ? [grayWolf] : []),
                  blitzMage,
                ],
              },
            },
            playerTwo: { champion, zones: { "main-deck": [grayWolf] } },
          });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          deck = p.zone("main-deck"),
          match = found ? deck.find((c) => c.definitionId === grayWolf.canonicalId) : undefined,
          index = match ? deck.findIndex((c) => c.objectId === match.objectId) : deck.length,
          revealed = classBonus ? deck.slice(0, index + (match ? 1 : 0)) : [],
          random = game.state.random;
        p.activate(gaiasSongbird, {
          reservePayment: [
            { kind: "card", cardId: p.card(woodlandSquirrels, { zone: "hand" }).objectId },
          ],
        });
        passEffectsStack(game);
        expect(game.state.decision).toBeNull();
        expect(p.zone("hand")).toEqual(classBonus && match ? [match] : []);
        expect(
          game.state.eventHistory.filter((e) => e.type === "card-revealed").map((e) => e.objectId),
        ).toEqual(revealed.map((c) => c.objectId));
        if (!classBonus) expect(p.zone("main-deck")).toEqual(deck);
        else {
          const untouched = match ? deck.slice(index + 1) : [];
          expect(p.zone("main-deck").slice(0, untouched.length)).toEqual(untouched);
          expect(
            p
              .zone("main-deck")
              .slice(untouched.length)
              .map((c) => c.objectId)
              .sort(),
          ).toEqual(
            deck
              .slice(0, index)
              .map((c) => c.objectId)
              .sort(),
          );
          expect(game.state.random).not.toEqual(random);
        }
        expect(q.zone("main-deck")).toHaveLength(1);
        expect(q.zone("hand")).toHaveLength(0);
        expect(p.card(gaiasSongbird, { zone: "field" })).toBeDefined();
      });
});
