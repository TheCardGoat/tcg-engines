import { describe, expect, test } from "vite-plus/test";
import { op01PageOne112, op08BlackMaria074 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP08-074 Black Maria", () => {
  test("adds up to 5 rested DON!! once, then equalizes using live end-turn counts", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [op08BlackMaria074, op01PageOne112],
        activeDon: 1,
        donDeckCount: 5,
      },
      { activeDon: 3 },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const mariaId = engine.findCardInZone("south", "character", op08BlackMaria074);
    const pageOneId = engine.findCardInZone("south", "character", op01PageOne112);

    engine.activateEffect(mariaId, "activateMain", "south");
    const addDon = engine.pendingDecision("effectAddDon", "south").steps[0];
    expect(addDon?.kind).toBe("chooseOption");
    if (addDon?.kind !== "chooseOption") throw new Error("Expected Black Maria's DON!! choice.");
    expect(addDon.options.map((option) => option.id)).toEqual(["0", "1", "2", "3", "4", "5"]);
    engine.resolveDecision("effectAddDon", { optionId: "5" }, "south");

    expect(engine.getView("south").players.south).toMatchObject({
      activeDon: 1,
      restedDon: 5,
      donDeckCount: 0,
    });
    expect(
      engine.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: mariaId,
        trigger: "activateMain",
      }).accepted,
    ).toBe(false);

    engine.activateEffect(pageOneId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectCostReturnDon", { selectedIds: ["active-don:0"] }, "south");
    expect(engine.getView("south").players.south).toMatchObject({
      activeDon: 0,
      restedDon: 5,
      donDeckCount: 1,
    });
    expect(
      engine.getView("south").players.north.activeDon +
        engine.getView("south").players.north.restedDon,
    ).toBe(3);

    engine.endTurn("south");

    const returnDon = engine.pendingDecision("effectReturnDon", "south").steps[0];
    expect(returnDon?.kind).toBe("payCost");
    if (returnDon?.kind !== "payCost") {
      throw new Error("Expected Black Maria's DON!! return choice.");
    }
    expect(returnDon).toMatchObject({ min: 2, max: 2 });
    expect(returnDon.candidates.map((candidate) => candidate.ref.id)).toEqual([
      "rested-don:0",
      "rested-don:1",
      "rested-don:2",
      "rested-don:3",
      "rested-don:4",
    ]);
    engine.resolveDecision(
      "effectReturnDon",
      { selectedIds: ["rested-don:1", "rested-don:4"] },
      "south",
    );

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({ activeDon: 0, restedDon: 3, donDeckCount: 3 });
    expect(view.prompts).toHaveLength(0);
  });

  test("chooses which mixed active, rested, or attached DON!! to return", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op08BlackMaria074, attachedDon: 1 }],
        activeDon: 2,
        restedDon: 1,
        donDeckCount: 0,
      },
      { activeDon: 2 },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const mariaId = engine.findCardInZone("south", "character", op08BlackMaria074);

    engine.activateEffect(mariaId, "activateMain", "south");
    engine.endTurn("south");

    const choice = engine.pendingDecision("effectReturnDon", "south").steps[0];
    if (choice?.kind !== "payCost") throw new Error("Expected mixed DON!! choice.");
    expect(choice.candidates.map((candidate) => candidate.ref.id)).toEqual([
      "active-don:0",
      "active-don:1",
      "rested-don:0",
      `attached-don:${mariaId}:0`,
    ]);
    engine.resolveDecision(
      "effectReturnDon",
      { selectedIds: ["active-don:1", `attached-don:${mariaId}:0`] },
      "south",
    );

    expect(engine.getView("south").players.south).toMatchObject({
      activeDon: 1,
      restedDon: 1,
      donDeckCount: 2,
    });
    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === mariaId)
        ?.attachedDon,
    ).toBe(0);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("returns no DON!! at end of turn when already below the opponent's count", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op08BlackMaria074], activeDon: 1, donDeckCount: 5 },
      { activeDon: 3 },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const mariaId = engine.findCardInZone("south", "character", op08BlackMaria074);

    engine.activateEffect(mariaId, "activateMain", "south");
    engine.resolveDecision("effectAddDon", { optionId: "0" }, "south");
    engine.endTurn("south");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({ activeDon: 1, restedDon: 0, donDeckCount: 5 });
    expect(view.prompts).toHaveLength(0);
  });

  test("cannot activate while another Black Maria Character is on its field", () => {
    const engine = OnePieceTestEngine.create({
      character: [op08BlackMaria074, op08BlackMaria074],
      donDeckCount: 5,
    });
    const mariaId = engine.findCardInZone("south", "character", op08BlackMaria074);

    const failure = engine.expectFailure({
      type: "activateEffect",
      seat: "south",
      sourceInstanceId: mariaId,
      trigger: "activateMain",
    });

    expect(failure.accepted).toBe(false);
    expect(engine.getView("south").players.south).toMatchObject({ restedDon: 0, donDeckCount: 5 });
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
