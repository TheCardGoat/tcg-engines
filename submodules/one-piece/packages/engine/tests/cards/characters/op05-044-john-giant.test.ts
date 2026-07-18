import { describe, expect, test } from "vite-plus/test";
import { op05JohnGiant044 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP05-044 John Giant", () => {
  test("plays as the vanilla 8-cost 10000-power Giant and Navy Character", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op05JohnGiant044],
      activeDon: op05JohnGiant044.cost,
    });

    engine.playCard(op05JohnGiant044, "south");

    const johnId = engine.findCardInZone("south", "character", op05JohnGiant044);
    const john = engine
      .getView("south")
      .players.south.characters.find((card) => card?.instanceId === johnId);
    expect(john).toMatchObject({ power: 10000, rested: false });
    expect(engine.getView("south").players.south.restedDon).toBe(8);
    expect(op05JohnGiant044.traits).toEqual(["Giant", "Navy"]);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
