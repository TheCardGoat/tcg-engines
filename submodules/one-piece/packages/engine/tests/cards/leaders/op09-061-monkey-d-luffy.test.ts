import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  op08CandyMaiden075,
  op09GumGumLightning077,
  op09MonkeyDLuffy061,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP09-061 Monkey.D.Luffy", () => {
  test("ignores one returned DON!!, then adds one active and one rested after two are returned", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op09MonkeyDLuffy061,
        hand: [op08CandyMaiden075, op09GumGumLightning077],
        character: [eb01Doma005],
        life: [eb01Doma005],
        activeDon: 8,
        donDeckCount: 2,
      },
      {},
    );
    const characterId = engine.findCardInZone("south", "character", eb01Doma005);

    engine.attachDon(engine.leader("south"), 1, "south");
    expect(
      engine
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === characterId)?.cost,
    ).toBe(2);

    engine.playCard(op08CandyMaiden075, "south");
    engine.resolveDecision("effectCostReturnDon", { selectedIds: ["rested-don:0"] }, "south");
    expect(engine.getView("south").prompts).toHaveLength(0);

    engine.playCard(op09GumGumLightning077, "south");
    engine.resolveDecision(
      "effectCostReturnDon",
      { selectedIds: ["rested-don:0", "rested-don:1"] },
      "south",
    );

    const active = engine.pendingDecision("effectAddDon", "south").steps[0];
    expect(active?.kind).toBe("chooseOption");
    engine.resolveDecision("effectAddDon", { optionId: "1" }, "south");
    const rested = engine.pendingDecision("effectAddDon", "south").steps[0];
    expect(rested?.kind).toBe("chooseOption");
    engine.resolveDecision("effectAddDon", { optionId: "1" }, "south");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({ activeDon: 5, restedDon: 1, donDeckCount: 3 });
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
  test("FAQ: two separate DON1 returns do not trigger the two-card reaction", () => {
    const e = OnePieceTestEngine.create({
      leaderCardId: "OP09-061",
      hand: ["OP08-075", "OP08-075"],
      activeDon: 2,
      donDeckCount: 8,
    });
    e.asSouth().play("OP08-075");
    e.resolveDecision("effectCostReturnDon", { selectedIds: ["rested-don:0"] }, "south");
    e.asSouth().play("OP08-075");
    e.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    expect(e.getView("south").players.south.activeDon).toBe(0);
    expect(e.getView("south").players.south.restedDon).toBe(0);
    expect(e.getView("south").players.south.donDeckCount).toBe(10);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
  test("FAQ: Black Maria end-turn return still activates Your Turn reaction", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "OP09-061", character: ["OP08-074"], donDeckCount: 10 },
      { restedDon: 3 },
    );
    e.asSouth().activateMain(e.findCardInZone("south", "character", "OP08-074"));
    e.resolveDecision("effectAddDon", { optionId: "5" }, "south");
    e.asSouth().endTurn();
    e.resolveDecision(
      "effectReturnDon",
      { selectedIds: ["rested-don:0", "rested-don:1"] },
      "south",
    );
    e.resolveDecision("effectAddDon", { optionId: "1" }, "south");
    e.resolveDecision("effectAddDon", { optionId: "1" }, "south");
    expect(e.getView("south").players.south.activeDon).toBe(1);
    expect(e.getView("south").players.south.restedDon).toBe(4);
    expect(e.getView("south").players.south.donDeckCount).toBe(5);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
  test("DON aura changes existing and later Characters and ends when Leader DON returns", () => {
    const e = OnePieceTestEngine.create({
      leaderCardId: "OP09-061",
      character: ["ST02-012"],
      hand: ["ST02-012", "OP08-075"],
      activeDon: 3,
    });
    expect(e.getView("south").players.south.characters[0]?.cost).toBe(1);
    e.asSouth().attachDon(e.leader("south"), 1);
    expect(e.getView("south").players.south.characters[0]?.cost).toBe(2);
    e.asSouth().play("ST02-012");
    expect(
      e
        .getView("south")
        .players.south.characters.filter((c) => c !== null)
        .map((c) => c.cost),
    ).toEqual([2, 2]);
    e.asSouth().play("OP08-075");
    e.resolveDecision(
      "effectCostReturnDon",
      { selectedIds: [`attached-don:${e.leader("south")}:0`] },
      "south",
    );
    expect(
      e
        .getView("south")
        .players.south.characters.filter((c) => c !== null)
        .map((c) => c.cost),
    ).toEqual([1, 1]);
    expect(e.getView("south").players.south.leader.attachedDon).toBe(0);
  });
});
