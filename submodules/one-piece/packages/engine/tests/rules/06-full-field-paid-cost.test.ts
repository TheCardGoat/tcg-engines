import "../../../cards/src/index.ts";
import { expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../src/testing/test-engine.ts";

test("2-7-2 pays Uta's discounted cost before the full-field rule trash removes Shanks", () => {
  let engine = OnePieceTestEngine.create({
    leaderCardId: "OP01-002",
    hand: ["ST23-001"],
    character: ["OP01-120", "ST01-003", "ST01-004", "ST01-005", "ST01-006"],
    activeDon: 2,
    donDeckCount: 0,
  });
  const shanks = engine.asSouth().findOnField("OP01-120");
  engine.asSouth().play("ST23-001");
  engine.pendingDecision("playCharacterReplacement", "south");
  expect(engine.getView("south").players.south).toMatchObject({ activeDon: 0, restedDon: 2 });
  engine = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(engine.getState())));
  engine.resolveDecision("playCharacterReplacement", { selectedIds: [shanks] }, "south");
  expect(engine.asSouth().findOnField("ST23-001")).toBeTruthy();
  expect(engine.findCardInZone("south", "trash", "OP01-120")).toBe(shanks);
  expect(engine.getView("south").players.south).toMatchObject({ activeDon: 0, restedDon: 2 });
  expect(engine.getView("south").prompts).toHaveLength(0);
});
