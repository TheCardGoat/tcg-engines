import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";

describe("ST04-001 Kaido", () => {
  test.each([0, 1])(
    "pays seven DON and trashes up to one Life without defeating at zero Life: %s",
    (life) => {
      const e = OnePieceTestEngine.create(
        { leaderCardId: "ST04-001", activeDon: 7, restedDon: 1 },
        { life },
      );
      e.asSouth().activateMain(e.leader("south"));
      e.asSouth().acceptOptional();
      e.resolveDecision(
        "effectCostReturnDon",
        { selectedIds: Array.from({ length: 7 }, (_, i) => `active-don:${i}`) },
        "south",
      );
      e.resolveDecision("effectRemoveFromLifeCount", { optionId: String(life) }, "south");
      expect(e.getView("south").players.north.lifeCount).toBe(0);
      expect(e.getView("south").players.north.trash).toHaveLength(life);
      expect(e.getView("south").players.south.restedDon).toBe(1);
      expect(e.getView("south").status).not.toBe("finished");
      const repeat = e.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: e.leader("south"),
        trigger: "activateMain",
      });
      expect(repeat.reason).toBe("This effect has already been used this turn.");
    },
  );
  test("decline keeps seven DON and allows another activation", () => {
    const e = OnePieceTestEngine.create({ leaderCardId: "ST04-001", activeDon: 7 });
    e.asSouth().activateMain(e.leader("south"));
    e.asSouth().declineOptional();
    expect(e.getView("south").players.south.activeDon).toBe(7);
    e.asSouth().activateMain(e.leader("south"));
    e.asSouth().declineOptional();
  });
});
