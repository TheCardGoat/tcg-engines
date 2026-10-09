import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("P077 Ulti", () => {
  test("returning two DON adds one rested and readies purple Stage; payable second return does not repeat", () => {
    const e = OnePieceTestEngine.create({
      leaderCardId: "EB02-010",
      character: ["P-077", "ST05-011"],
      stage: "ST04-017",
      restedDon: 6,
      donDeckCount: 4,
    });
    const stage = e.findCardInZone("south", "stage", "ST04-017");
    e.asSouth().activateMain(stage);
    e.asSouth().acceptOptional();
    const fire = () => {
      e.asSouth().activateMain(e.leader("south"));
      e.asSouth().acceptOptional();
    };
    fire();
    e.resolveDecision("effectAddDon", { optionId: "1" }, "south");
    e.asSouth().chooseTargets(stage);
    expect(e.getView("south").players.south.restedDon).toBe(5);
    expect(e.getView("south").players.south.stage?.rested).toBe(false);
    e.asSouth().activateMain(stage);
    e.asSouth().acceptOptional();
    e.asSouth().activateMain(e.findCardInZone("south", "character", "ST05-011"));
    e.asSouth().acceptOptional();
    expect(e.getView("south").players.south.restedDon).toBe(1);
    expect(e.getView("south").players.south.stage?.rested).toBe(true);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
  test("zero optional ramp still permits Stage ready", () => {
    const e = OnePieceTestEngine.create({
      leaderCardId: "EB02-010",
      character: ["P-077", "ST05-011"],
      stage: "ST04-017",
      restedDon: 2,
    });
    const stage = e.findCardInZone("south", "stage", "ST04-017");
    e.asSouth().activateMain(stage);
    e.asSouth().acceptOptional();
    e.asSouth().activateMain(e.leader("south"));
    e.asSouth().acceptOptional();
    e.resolveDecision("effectAddDon", { optionId: "0" }, "south");
    e.asSouth().chooseTargets(stage);
    expect(e.getView("south").players.south.restedDon).toBe(0);
    expect(e.getView("south").players.south.stage?.rested).toBe(false);
  });
  test("one DON return does not trigger", () => {
    const e = OnePieceTestEngine.create(
      { character: ["P-077", "ST34-005"], restedDon: 1 },
      { character: ["ST01-006"] },
    );
    e.asSouth().attack(e.findCardInZone("south", "character", "ST34-005"), e.leader("north"));
    e.asSouth().acceptOptional();
    e.asSouth().chooseTargets();
    e.asNorth().chooseBlocker();
    expect(e.getView("south").players.south.restedDon).toBe(0);
    expect(e.getView("south").prompts).toHaveLength(0);
  });

  test("opponent turn own return qualifies and zero Stage selection is allowed", () => {
    const e = OnePieceTestEngine.create(
      {},
      {
        character: ["P-077"],
        stage: { cardId: "ST04-017", rested: true },
        hand: ["OP01-118"],
        activeDon: 2,
        donDeckCount: 8,
      },
    );
    e.asSouth().attack(e.leader("south"), e.leader("north"));
    e.resolveDecision(
      "battleCounter",
      { selectedIds: [e.findCardInZone("north", "hand", "OP01-118")] },
      "north",
    );
    e.asNorth().acceptOptional();
    e.asNorth().chooseTargets();
    e.resolveDecision("effectAddDon", { optionId: "1" }, "north");
    e.asNorth().chooseTargets();
    expect(e.getView("north").players.north.restedDon).toBe(1);
    expect(e.getView("north").players.north.stage?.rested).toBe(true);
  });
  test("nonpurple Stage cannot be readied after valid return", () => {
    const e = OnePieceTestEngine.create({
      leaderCardId: "EB02-010",
      character: ["P-077"],
      stage: { cardId: "ST01-017", rested: true },
      restedDon: 2,
    });
    e.asSouth().activateMain(e.leader("south"));
    e.asSouth().acceptOptional();
    e.resolveDecision("effectAddDon", { optionId: "0" }, "south");
    expect(e.getView("south").players.south.stage?.rested).toBe(true);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
});
