import { describe, expect, test } from "vite-plus/test";
import { eb01MountainGod018, op08ItSToDieFor076 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP08-076 It's to Die For", () => {
  test("Main adds both optional active DON!! when the opponent has a 6000-or-more Character", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op08ItSToDieFor076], activeDon: 3, donDeckCount: 2 },
      { character: [eb01MountainGod018] },
    );

    engine.playCard(op08ItSToDieFor076);
    engine.resolveDecision("effectAddDon", { optionId: "1" }, "south");
    engine.resolveDecision("effectAddDon", { optionId: "1" }, "south");

    expect(engine.getView("south").players.south).toMatchObject({
      activeDon: 2,
      restedDon: 3,
      donDeckCount: 0,
    });
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
    expect(engine.getView("south").players.south.leader).toBeTruthy();
  });
  test("declines first optional add but independent6000boundary permits second", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP08-076"], activeDon: 3, donDeckCount: 2 },
      { character: ["ST02-006"] },
    );
    e.asSouth().play("OP08-076");
    e.resolveDecision("effectAddDon", { optionId: "0" }, "south");
    e.resolveDecision("effectAddDon", { optionId: "1" }, "south");
    expect(e.getView("south").players.south.activeDon).toBe(1);
    expect(e.getView("south").players.south.donDeckCount).toBe(1);
  });
  test("5000 Character does not enable second add even with stronger Leader", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP08-076"], activeDon: 3, donDeckCount: 2 },
      { leaderCardId: "ST30-001", character: ["ST01-005"] },
    );
    e.asSouth().play("OP08-076");
    e.resolveDecision("effectAddDon", { optionId: "1" }, "south");
    expect(e.getView("south").players.south.activeDon).toBe(1);
    expect(e.getView("south").players.south.donDeckCount).toBe(1);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
  test("declines both optional additions with6000Character and DON available", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP08-076"], activeDon: 3, donDeckCount: 2 },
      { character: ["ST02-006"] },
    );
    e.asSouth().play("OP08-076");
    e.resolveDecision("effectAddDon", { optionId: "0" }, "south");
    e.resolveDecision("effectAddDon", { optionId: "0" }, "south");
    expect(e.getView("south").players.south.activeDon).toBe(0);
    expect(e.getView("south").players.south.restedDon).toBe(3);
    expect(e.getView("south").players.south.donDeckCount).toBe(2);
  });
});
