import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import {
  createClassBonusTestChampion,
  grantTestChampionLevel,
  requireSingleFace,
} from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "./woodland-squirrels.ts";
import { giantTortoise } from "./giant-tortoise.ts";
import { mistboundCutthroat } from "./mistbound-cutthroat.ts";
import { setTheTraps } from "../actions/set-the-traps.ts";
/** @covers C7zFV2K7bL-a1 */
describe("Mistbound Cutthroat returns rested only from its graveyard after another ally is milled", () => {
  for (const level of [2, 3])
    for (const actor of ["self", "opponent"] as const)
      for (const sourceZone of ["graveyard", "field", "main-deck"] as const)
        for (const allyMilled of [false, true])
          it(`LV=${level}, actor=${actor}, source=${sourceZone}, ally=${allyMilled}`, () => {
            const champion = grantTestChampionLevel(
              createClassBonusTestChampion(mistboundCutthroat, false, "activation-discount"),
              level,
            );
            const deck =
              sourceZone === "main-deck"
                ? [mistboundCutthroat, setTheTraps]
                : [allyMilled ? woodlandSquirrels : setTheTraps, setTheTraps];
            const game = GrandArchiveTestEngine.startFixture({
              firstPlayer: actor === "self" ? "playerOne" : "playerTwo",
              playerOne: {
                champion,
                zones: {
                  ...(sourceZone === "graveyard"
                    ? { graveyard: [mistboundCutthroat] }
                    : sourceZone === "field"
                      ? { field: [mistboundCutthroat] }
                      : {}),
                  "main-deck": deck,
                  hand: [setTheTraps, woodlandSquirrels, woodlandSquirrels],
                },
              },
              playerTwo: {
                champion,
                zones: {
                  hand: [setTheTraps, woodlandSquirrels, woodlandSquirrels],
                  "main-deck": [woodlandSquirrels, woodlandSquirrels],
                },
              },
            });
            const p = game.player("player-one"),
              q = game.player("player-two"),
              source = p.card(mistboundCutthroat, { zone: sourceZone }),
              caster = actor === "self" ? p : q;
            caster.activate(setTheTraps, {
              reservePayment: caster
                .cards(woodlandSquirrels, { zone: "hand" })
                .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
              targets: { "target-player": [p.id] },
            });
            passEffectsStack(game);
            const returns = level === 3 && sourceZone === "graveyard" && allyMilled;
            expect(game.state.objects[source.objectId]!.zone).toBe(
              returns || sourceZone === "field" ? "field" : "graveyard",
            );
            expect(game.state.objects[source.objectId]!.states.has("rested")).toBe(returns);
            expect(p.zone("main-deck")).toHaveLength(0);
            expect(q.zone("main-deck")).toHaveLength(2);
          });
});
