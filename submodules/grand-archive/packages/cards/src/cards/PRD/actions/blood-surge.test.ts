import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
  grantTestChampionLevel,
  requireSingleFace,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { singeingLeap } from "../../PTM/actions/singeing-leap.ts";
import { baubleOfAbundance } from "../../DEMO22/items/bauble-of-abundance.ts";
import { teardropDiadem } from "../../PTM/items/teardrop-diadem.ts";
import { bloodSurge } from "./blood-surge.ts";

/** @covers yHIeIwxWde-a1 @covers yHIeIwxWde-a2 @covers yHIeIwxWde-a3 @covers yHIeIwxWde-a4 */
describe("Blood Surge — draw thresholds and prohibition", () => {
  for (const matching of [false, true])
    for (const [level, damage] of [
      [4, 10],
      [5, 9],
      [5, 10],
      [5, 20],
      [8, 20],
      [9, 10],
      [9, 19],
      [9, 20],
      [10, 21],
    ]) {
      it(`class=${matching}, level=${level}, damage=${damage}`, () => {
        const base = enableAllTestElements(
          grantTestChampionLevel(
            createClassBonusTestChampion(bloodSurge, matching, "activation-discount"),
            level!,
          ),
        );
        const face = requireSingleFace(base);
        const champion = {
          ...base,
          layout: {
            kind: "single-faced" as const,
            face: { ...face, stats: { ...face.stats, life: 40 } },
          },
        };
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              field: [baubleOfAbundance, baubleOfAbundance, teardropDiadem],
              hand: [
                bloodSurge,
                ...Array.from({ length: damage! }, () => singeingLeap),
                ...Array.from({ length: damage! + 2 }, () => woodlandSquirrels),
              ],
              "main-deck": Array.from({ length: 10 }, () => woodlandSquirrels),
            },
          },
          playerTwo: {
            champion,
            zones: { "main-deck": Array.from({ length: 10 }, () => woodlandSquirrels) },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two");
        const pay = (amount: number) =>
          p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, amount)
            .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
        for (const leap of p.cards(singeingLeap, { zone: "hand" })) {
          p.activate(leap, { reservePayment: pay(1) });
          passEffectsStack(game);
        }
        expect(game.state.objects[p.card(champion).objectId]!.damage).toBe(damage);
        const deck = p.zone("main-deck");
        p.activate(bloodSurge, { reservePayment: pay(2) });
        expect(p.zone("main-deck")).toEqual(deck);
        passEffectsStack(game);
        const count =
          Number(matching) +
          Number(level! >= 5 && damage! >= 10) +
          Number(level! >= 9 && damage! >= 20);
        expect(p.zone("hand")).toEqual(deck.slice(0, count));
        expect(p.zone("main-deck")).toEqual(deck.slice(count));
        const heldDeck = p.zone("main-deck"),
          otherDeck = q.zone("main-deck"),
          memory = p.zone("memory");
        p.activateAbility(p.cards(baubleOfAbundance, { zone: "field" })[0]!, "Z9TCpaMJTc-a1");
        passEffectsStack(game);
        expect(p.zone("main-deck")).toEqual(heldDeck);
        expect(q.zone("hand")).toEqual(otherDeck.slice(0, 1));
        p.activateAbility(teardropDiadem, "K15jWbHAMY-a3");
        passEffectsStack(game);
        expect(p.zone("main-deck")).toEqual(heldDeck);
        expect(p.zone("memory")).toEqual(memory);
        advanceToMain(game, p.id, game.state.turn.number);
        const afterTurn = p.zone("main-deck"),
          hand = p.zone("hand");
        p.activateAbility(p.cards(baubleOfAbundance, { zone: "field" })[0]!, "Z9TCpaMJTc-a1");
        passEffectsStack(game);
        expect(p.zone("hand")).toEqual([...hand, afterTurn[0]!]);
        expect(p.zone("main-deck")).toEqual(afterTurn.slice(1));
      });
    }
});
