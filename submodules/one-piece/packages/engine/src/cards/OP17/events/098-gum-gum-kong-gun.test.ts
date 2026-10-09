import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP17-098 Gum-Gum Kong Gun", () => {
  test("[Main] Shinobu raises Momonosuke above cost 12 and enables two K.O.s", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: "OP01-031",
        hand: ["OP16-087", "OP17-098"],
        character: ["OP16-084"],
        activeDon: 10,
      },
      { character: ["OP16-012", "OP16-002", "OP16-003"] },
    );
    const momo = engine.findCardInZone("south", "character", "OP16-084");
    const targets = ["OP16-012", "OP16-002"].map((id) =>
      engine.findCardInZone("north", "character", id),
    );
    engine.playCard("OP16-087");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [momo] }, "south");
    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === momo)
        ?.cost,
    ).toBe(25);
    engine.playCard("OP17-098");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: targets }, "south");
    expect(engine.getView("south").players.north.trash.map((card) => card.cardId)).toEqual(
      expect.arrayContaining(["OP16-012", "OP16-002"]),
    );
    expect(
      engine
        .getView("south")
        .players.north.characters.filter(Boolean)
        .map((card) => card?.cardId),
    ).toEqual(["OP16-003"]);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[Main] no cost-12 Character means no K.O.", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["OP17-098"], character: ["OP17-118"], activeDon: 7 },
      { character: ["OP16-002"] },
    );
    engine.playCard("OP17-098");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    expect(
      engine
        .getView("south")
        .players.north.characters.filter(Boolean)
        .map((card) => card?.cardId),
    ).toEqual(["OP16-002"]);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[Counter] +3000 saves the Leader against 7000 without the Main condition", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["OP17-098"], activeDon: 1 },
      { activeDon: 2 },
    );
    const life = engine.getView("south").players.south.lifeCount;
    engine.endTurn("south");
    engine.asNorth().attachDon(engine.leader("north"), 2);
    engine.asNorth().attack(engine.leader("north"), engine.leader("south"));
    engine.asSouth().chooseCounter("OP17-098");
    expect(engine.getView("south").players.south.lifeCount).toBe(life);
    expect(engine.getView("south").players.south.trash.map((card) => card.cardId)).toContain(
      "OP17-098",
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[Optional] declining an affordable activation pays only the Event play cost", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["OP17-098"], activeDon: 7 },
      { character: ["OP16-002"] },
    );
    engine.playCard("OP17-098");
    engine.asSouth().declineOptional();
    const south = engine.getView("south").players.south;
    expect(south.activeDon).toBe(6);
    expect(south.restedDon).toBe(1);
    expect(south.trash.map((card) => card.cardId)).toContain("OP17-098");
    expect(
      engine
        .getView("south")
        .players.north.characters.filter(Boolean)
        .map((card) => card?.cardId),
    ).toEqual(["OP16-002"]);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
  test("opponent-only cost18 Loki enables the Main after payment", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP17-098"], activeDon: 7 },
      { character: ["OP17-119", "EB01-005"] },
    );
    const id = e.findCardInZone("north", "character", "EB01-005");
    e.playCard("OP17-098");
    e.acceptLeadingOptional("south");
    e.resolveDecision("effectTargetSelection", { selectedIds: [id] }, "south");
    expect(e.getView("south").players.south.activeDon).toBe(0);
    expect(e.getView("south").players.north.trash.map((c) => c.instanceId)).toContain(id);
    expect(e.getView("south").players.north.characters.filter(Boolean)).toHaveLength(1);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
});
