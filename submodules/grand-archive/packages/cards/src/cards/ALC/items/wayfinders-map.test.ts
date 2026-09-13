import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { reposition } from "../actions/reposition.ts";
import { strategicWarfare } from "../actions/strategic-warfare.ts";
import { palatialConcourse } from "../domains/palatial-concourse.ts";
import { sanctumOfEsotericTruth } from "../domains/sanctum-of-esoteric-truth.ts";
import { wayfindersMap } from "./wayfinders-map.ts";

/** @covers porhlq2kkv-a1 */
describe("Wayfinder's Map — Domain activation discount", () => {
  it("reduces a real Domain activation by one without reducing a non-Domain action", () => {
    const champion = createClassBonusTestChampion(wayfindersMap, true, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          field: [wayfindersMap],
          hand: [palatialConcourse, strategicWarfare, woodlandSquirrels, woodlandSquirrels],
          "main-deck": [woodlandSquirrels],
        },
      },
      playerTwo: { champion },
    });
    const player = game.player("player-one");
    const payments = player.cards(woodlandSquirrels, { zone: "hand" });
    const beforeNonDomain = game.state;
    expect(() =>
      player.activate(strategicWarfare, {
        reservePayment: [{ kind: "card", cardId: payments[0]!.objectId }],
      }),
    ).toThrow();
    expect(game.state).toEqual(beforeNonDomain);

    player.activate(palatialConcourse, {
      reservePayment: [{ kind: "card", cardId: payments[0]!.objectId }],
    });
    expect(player.cards(palatialConcourse, { zone: "hand" })).toHaveLength(0);
    expect(player.zone("memory")).toEqual([payments[0]]);
    passEffectsStack(game);
    expect(player.cards(palatialConcourse, { zone: "field" })).toHaveLength(1);
  });
});

/** @covers porhlq2kkv-a2 */
describe("Wayfinder's Map — three-Domain activation threshold", () => {
  for (const domainCount of [2, 3]) {
    it(`${domainCount} controlled Domains ${domainCount === 3 ? "allows" : "rejects"} the draw`, () => {
      const champion = createClassBonusTestChampion(wayfindersMap, true, "activation-discount");
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            field: [
              wayfindersMap,
              ...Array.from({ length: domainCount }, () => sanctumOfEsotericTruth),
            ],
            "main-deck": [reposition, woodlandSquirrels],
          },
        },
        playerTwo: {
          champion,
          zones: { field: [sanctumOfEsotericTruth, sanctumOfEsotericTruth] },
        },
      });
      const player = game.player("player-one");
      const map = player.card(wayfindersMap);
      const deck = player.zone("main-deck");
      if (domainCount === 2) {
        const before = game.state;
        expect(() => player.activateAbility(wayfindersMap, "porhlq2kkv-a2")).toThrow();
        expect(game.state).toEqual(before);
        expect(game.state.objects[map.objectId]!.zone).toBe("field");
        return;
      }

      player.activateAbility(wayfindersMap, "porhlq2kkv-a2");
      expect(game.state.objects[map.objectId]!.zone).toBe("banishment");
      expect(player.zone("hand")).toHaveLength(0);
      expect(player.zone("main-deck")).toEqual(deck);
      passEffectsStack(game);
      expect(player.zone("hand")).toEqual(deck.slice(0, 1));
      expect(player.zone("main-deck")).toEqual(deck.slice(1));
    });
  }
});
