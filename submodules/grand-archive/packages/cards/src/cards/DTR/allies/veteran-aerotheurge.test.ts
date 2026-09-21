import { veteranAerotheurge } from "./veteran-aerotheurge.ts";
import { describe } from "vitest";
import { proveRangedAlly } from "../../../testing/ranged-ally.ts";

/** @covers fta5isdgrk-a1 @covers fta5isdgrk-a2 */
describe("veteran-aerotheurge — Ranged combat", () => {
  proveRangedAlly({
    card: veteranAerotheurge,
    power: 2,
    ranged: 2,
    classBonus: false,
    additionalClassRanged: 2,
  });
});

import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { resonantAether } from "../actions/resonant-aether.ts";
import { backdash } from "../actions/backdash.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers fta5isdgrk-a3 */
describe("Veteran Aerotheurge — first Aethercharge each turn", () => {
  for (const matching of [false, true]) {
    it(`discounts only its controller's first charge and resets next turn, class=${matching}`, () => {
      const champion = createClassBonusTestChampion(
        veteranAerotheurge,
        matching,
        "activation-discount",
      );
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            field: [veteranAerotheurge],
            hand: [
              backdash,
              resonantAether,
              resonantAether,
              resonantAether,
              ...Array.from({ length: 4 }, () => woodlandSquirrels),
            ],
            "main-deck": Array.from({ length: 6 }, () => woodlandSquirrels),
          },
        },
        playerTwo: {
          champion,
          zones: {
            hand: [resonantAether, woodlandSquirrels],
            "main-deck": Array.from({ length: 6 }, () => woodlandSquirrels),
          },
        },
      });
      const p = game.player("player-one"),
        q = game.player("player-two");
      const charges = p.cards(resonantAether);
      const pay = () => [
        {
          kind: "card" as const,
          cardId: p.cards(woodlandSquirrels, { zone: "hand" })[0]!.objectId,
        },
      ];
      const unchanged = game.state;
      expect(() =>
        p.activate(backdash, { targets: { "target-1": [p.card(veteranAerotheurge).objectId] } }),
      ).toThrow();
      expect(game.state).toEqual(unchanged);
      p.activate(backdash, {
        targets: { "target-1": [p.card(veteranAerotheurge).objectId] },
        reservePayment: pay(),
      });
      passEffectsStack(game);
      const memory = p.zone("memory").length;
      p.activate(charges[0]!);
      passEffectsStack(game);
      expect(game.state.objects[charges[0]!.objectId]!.zone).toBe("graveyard");
      expect(p.zone("memory")).toHaveLength(memory);
      const beforeSecond = game.state;
      expect(() => p.activate(charges[1]!)).toThrow();
      expect(game.state).toEqual(beforeSecond);
      p.activate(charges[1]!, { reservePayment: pay() });
      passEffectsStack(game);
      expect(p.zone("memory")).toHaveLength(memory + 1);
      advanceToMain(game, q.id);
      const beforeOpponent = game.state;
      expect(() => q.activate(resonantAether)).toThrow();
      expect(game.state).toEqual(beforeOpponent);
      q.activate(resonantAether, {
        reservePayment: [
          { kind: "card", cardId: q.cards(woodlandSquirrels, { zone: "hand" })[0]!.objectId },
        ],
      });
      passEffectsStack(game);
      advanceToMain(game, p.id);
      const nextMemory = p.zone("memory").length;
      p.activate(charges[2]!);
      passEffectsStack(game);
      expect(p.zone("memory")).toHaveLength(nextMemory);
      expect(game.state.objects[charges[2]!.objectId]!.zone).toBe("graveyard");
    });
  }

  it("counts an earlier charge even when Veteran enters later in that turn", () => {
    const champion = createClassBonusTestChampion(veteranAerotheurge, false, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          hand: [
            veteranAerotheurge,
            resonantAether,
            resonantAether,
            ...Array.from({ length: 7 }, () => woodlandSquirrels),
          ],
        },
      },
      playerTwo: { champion },
    });
    const p = game.player("player-one"),
      charges = p.cards(resonantAether);
    const payment = (count: number) =>
      p
        .cards(woodlandSquirrels, { zone: "hand" })
        .slice(0, count)
        .map((card) => ({ kind: "card" as const, cardId: card.objectId }));
    p.activate(charges[0]!, { reservePayment: payment(1) });
    passEffectsStack(game);
    p.activate(veteranAerotheurge, { reservePayment: payment(4) });
    passEffectsStack(game);
    expect(game.state.objects[p.card(veteranAerotheurge).objectId]!.zone).toBe("field");
    const before = game.state;
    expect(() => p.activate(charges[1]!)).toThrow();
    expect(game.state).toEqual(before);
    p.activate(charges[1]!, { reservePayment: payment(1) });
    passEffectsStack(game);
    expect(p.zone("memory")).toHaveLength(6);
    expect(game.state.objects[charges[1]!.objectId]!.zone).toBe("graveyard");
  });
});
