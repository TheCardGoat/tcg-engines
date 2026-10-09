import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST26-003 Robin", () => {
  test.each([0, 1])("returns two rested DON then adds %s active DON", (count) => {
    const e = OnePieceTestEngine.create({ hand: ["ST26-003"], activeDon: 3, donDeckCount: 7 });
    e.asSouth().play("ST26-003");
    e.asSouth().acceptOptional();
    e.resolveDecision("effectAddDon", { optionId: String(count) }, "south");
    expect(e.getView("south").players.south.activeDon).toBe(count);
    expect(e.getView("south").players.south.restedDon).toBe(1);
    expect(e.getView("south").players.south.donDeckCount).toBe(9 - count);
  });
  test("declines optional DON return", () => {
    const e = OnePieceTestEngine.create({ hand: ["ST26-003"], activeDon: 3, donDeckCount: 7 });
    e.asSouth().play("ST26-003");
    e.asSouth().declineOptional();
    expect(e.getView("south").players.south.restedDon).toBe(3);
    expect(e.getView("south").players.south.donDeckCount).toBe(7);
    expect(e.getView("south").players.south.activeDon).toBe(0);
  });
});
