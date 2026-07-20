import { eb01Doma005, op01Shanks120 } from "@tcg/op-cards";
import type { CharacterCard } from "@tcg/op-types";
import { describe, expect, test } from "vite-plus/test";
import { op14eb04Mr1DazBonez090 } from "../../../../../cards/src/cards/OP14EB04/characters/090-mr-1-daz-bonez.ts";
import { registerCards } from "../../../../../cards/src/runtime-catalog.ts";
import { OnePieceTestEngine } from "../../../index.ts";

const zeroCost: CharacterCard = {
  ...eb01Doma005,
  id: "TEST-OP14-090-ZERO",
  canonicalId: "TEST-OP14-090-ZERO",
  cost: 0,
};
registerCards([zeroCost]);

describe("OP14-090 Mr.1(Daz.Bonez)", () => {
  test("on play rests an opposing cost-0 Character and may attack it that turn", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op14eb04Mr1DazBonez090],
        character: [zeroCost],
        activeDon: op14eb04Mr1DazBonez090.cost,
      },
      { character: [zeroCost] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const target = engine.findCardInZone("north", "character", zeroCost);
    engine.playCard(op14eb04Mr1DazBonez090, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [target] }, "south");
    const source = engine.findCardInZone("south", "character", op14eb04Mr1DazBonez090);
    expect(() => engine.declareAttack(source, target, "south")).not.toThrow();
  });

  test("without a cost-0 or cost-8-plus Character cannot attack a Character on its play turn", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op14eb04Mr1DazBonez090], activeDon: op14eb04Mr1DazBonez090.cost },
      { character: [{ card: eb01Doma005, rested: true }] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    engine.playCard(op14eb04Mr1DazBonez090, "south");
    const source = engine.findCardInZone("south", "character", op14eb04Mr1DazBonez090);
    const target = engine.findCardInZone("north", "character", eb01Doma005);
    expect(() => engine.declareAttack(source, target, "south")).toThrow();
  });

  test("a cost-8-or-more Character independently grants same-turn Character attacks", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op14eb04Mr1DazBonez090],
        character: [op01Shanks120],
        activeDon: op14eb04Mr1DazBonez090.cost,
      },
      { character: [{ card: eb01Doma005, rested: true }] },
      { firstPlayer: "north", activeSeat: "south" },
    );

    engine.playCard(op14eb04Mr1DazBonez090, "south");
    const source = engine.findCardInZone("south", "character", op14eb04Mr1DazBonez090);
    const target = engine.findCardInZone("north", "character", eb01Doma005);

    expect(() => engine.declareAttack(source, target, "south")).not.toThrow();
  });
});
