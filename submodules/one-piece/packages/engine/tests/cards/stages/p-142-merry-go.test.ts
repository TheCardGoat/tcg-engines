import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("P-142", () => {
  test.each(["yes", "no"])("battle replacement %s trashes only the chosen payment", (choice) => {
    const e = OnePieceTestEngine.create(
      { stage: "P-142", character: [{ cardId: "OP05-065", rested: true }] },
      { character: ["OP16-003"] },
      { activeSeat: "north" },
    );
    const stage = e.findCardInZone("south", "stage", "P-142"),
      target = e.findCardInZone("south", "character", "OP05-065");
    e.asNorth().attack("OP16-003", target);
    e.resolveDecision("battleKoReplacement", { optionId: choice }, "south");
    expect(e.getView("south").players.south.trash.map((c) => c.instanceId)).toContain(
      choice === "yes" ? stage : target,
    );
    expect(e.getView("south").players.south.characters.some((c) => c?.instanceId === target)).toBe(
      choice === "yes",
    );
    expect(e.getView("south").prompts).toHaveLength(0);
  });
  test("declining leaves the Stage available", () => {
    const e = OnePieceTestEngine.create(
      { stage: "P-142", character: [{ cardId: "ST01-012", rested: true }] },
      { character: ["OP16-003"] },
      { activeSeat: "north" },
    );
    e.asNorth().attack("OP16-003", "ST01-012");
    e.resolveDecision("battleKoReplacement", { optionId: "no" }, "south");
    expect(e.getView("south").players.south.stage?.cardId).toBe("P-142");
    expect(e.getView("south").players.south.trash.map((c) => c.cardId)).toContain("ST01-012");
  });
  test.each(["OP06-118", "EB01-025"])("does not protect excluded basepower or trait %s", (card) => {
    const e = OnePieceTestEngine.create(
      { stage: "P-142", character: [{ cardId: card, rested: true }] },
      { character: ["OP16-003"] },
      { activeSeat: "north" },
    );
    e.asNorth().attack("OP16-003", card);
    expect(e.getView("south").players.south.trash.map((c) => c.cardId)).toContain(card);
    expect(e.getView("south").players.south.stage?.cardId).toBe("P-142");
    expect(e.getView("south").prompts).toHaveLength(0);
  });
  test("own effect K.O. can consume Stage while preserving a current10000 Character", () => {
    const e = OnePieceTestEngine.create({
      stage: "P-142",
      character: ["ST01-012", { cardId: "OP05-087", attachedDon: 1 }],
      activeDon: 4,
    });
    const id = e.findCardInZone("south", "character", "ST01-012");
    e.attachDon(id, 4, "south");
    e.asSouth().attack("OP05-087", e.leader("north"));
    e.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    e.resolveDecision("effectKoReplacement", { optionId: "yes" }, "south");
    expect(
      e.getView("south").players.south.characters.find((c) => c?.instanceId === id)?.power,
    ).toBe(10000);
    expect(e.getView("south").players.south.trash.map((c) => c.cardId)).toContain("P-142");
    expect(e.getView("south").prompts).toHaveLength(0);
  });
  test.each(["ST01-012", "OP06-118"])(
    "opponent effect K.O. checks printed basepower for %s",
    (card) => {
      const e = OnePieceTestEngine.create(
        { stage: "P-142", character: [card] },
        { leaderCardId: "OP01-061", hand: ["OP01-094"], activeDon: 10 },
        { activeSeat: "north" },
      );
      e.playCard("OP01-094", "north");
      e.resolveDecision("effectOptional", { optionId: "yes" }, "north");
      if (card === "ST01-012")
        e.resolveDecision("effectKoReplacement", { optionId: "yes" }, "south");
      expect(e.getView("south").players.south.characters.some((c) => c?.cardId === card)).toBe(
        card === "ST01-012",
      );
      expect(e.getView("south").players.south.trash.map((c) => c.cardId)).toContain(
        card === "ST01-012" ? "P-142" : card,
      );
      expect(e.getView("south").prompts).toHaveLength(0);
    },
  );
});
