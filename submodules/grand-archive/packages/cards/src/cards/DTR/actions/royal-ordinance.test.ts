import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { royalOrdinance } from "./royal-ordinance.ts";
import { reckoningsWake } from "./reckonings-wake.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
  requireSingleFace,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers UnOkglGVMN-a1 */
describe("Royal Ordinance — Exalted requires another advanced element", () => {
  for (const element of [
    "NORM",
    "FIRE",
    "WATER",
    "WIND",
    "EXALTED",
    "UMBRA",
    "ASTRA",
    "CRUX",
  ] as const)
    it(`uses ${element} from its controller's champion`, () => {
      const base = createClassBonusTestChampion(royalOrdinance, false, "activation-discount");
      const champion = {
        ...base,
        layout: {
          kind: "single-faced" as const,
          face: { ...requireSingleFace(base), elements: [element] as const },
        },
      };
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            hand: [royalOrdinance, woodlandSquirrels, woodlandSquirrels],
            "main-deck": [woodlandSquirrels],
          },
        },
        playerTwo: {
          champion: enableAllTestElements(
            createClassBonusTestChampion(reckoningsWake, false, "activation-discount"),
          ),
        },
      });
      const p = game.player("player-one");
      const payment = p
        .cards(woodlandSquirrels)
        .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
      if (["UMBRA", "ASTRA", "CRUX"].includes(element)) {
        p.activate(royalOrdinance, { reservePayment: payment });
        expect(p.zone("hand")).toHaveLength(0);
        passEffectsStack(game);
        expect(p.zone("hand")).toHaveLength(1);
        expect(p.cards(royalOrdinance, { zone: "graveyard" })).toHaveLength(1);
      } else {
        const before = game.state;
        expect(() => p.activate(royalOrdinance, { reservePayment: payment })).toThrow();
        expect(game.state).toEqual(before);
      }
    });
});

/** @covers UnOkglGVMN-a2 */
describe("Royal Ordinance — recover then draw", () => {
  for (const damage of [0, 1, 5])
    it(`recovers at most three from ${damage} damage and draws on resolution`, () => {
      const champion = createClassBonusTestChampion(reckoningsWake, false, "activation-discount");
      const game = GrandArchiveTestEngine.startFixture({
        firstPlayer: "playerTwo",
        playerOne: {
          champion,
          zones: {
            hand: [royalOrdinance, woodlandSquirrels, woodlandSquirrels],
            "main-deck": [woodlandSquirrels, woodlandSquirrels],
          },
        },
        playerTwo: {
          champion,
          zones: {
            field: Array.from({ length: damage }, () => woodlandSquirrels),
            "main-deck": [woodlandSquirrels],
          },
        },
      });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        hero = p.card(champion);
      for (const attacker of q.cards(woodlandSquirrels, { zone: "field" })) {
        q.declareAttack(attacker, hero);
        game.resolveCombatWithoutRetaliation();
      }
      q.pass();
      const outsideMain = game.state;
      expect(() =>
        p.activate(royalOrdinance, {
          reservePayment: p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, 2)
            .map((c) => ({ kind: "card", cardId: c.objectId })),
        }),
      ).toThrow();
      expect(game.state).toEqual(outsideMain);
      advanceToMain(game, p.id);
      const payment = p
        .cards(woodlandSquirrels, { zone: "hand" })
        .slice(0, 2)
        .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
      const before = game.state,
        top = p.zone("main-deck")[0]!;
      expect(() => p.activate(royalOrdinance, { reservePayment: payment.slice(0, 1) })).toThrow();
      expect(game.state).toEqual(before);
      p.activate(royalOrdinance, { reservePayment: payment });
      expect(game.state.objects[hero.objectId]!.damage).toBe(damage);
      expect(game.state.objects[top.objectId]!.zone).toBe("main-deck");
      const hand = p.zone("hand").length;
      passEffectsStack(game);
      expect(game.state.objects[hero.objectId]!.damage).toBe(Math.max(0, damage - 3));
      expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(0);
      expect(p.zone("hand")).toHaveLength(hand + 1);
      expect(game.state.objects[top.objectId]!.zone).toBe("hand");
      expect(p.zone("memory")).toHaveLength(2);
    });
});
