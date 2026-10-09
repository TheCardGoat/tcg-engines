import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";

describe("ST04-017 Onigashima Island", () => {
  test.each(["ST04-001", "ST10-001"])(
    "rests Stage before checking Leader trait %s",
    (leaderCardId) => {
      const e = OnePieceTestEngine.create({ leaderCardId, stage: "ST04-017", donDeckCount: 2 });
      const stage = e.findCardInZone("south", "stage", "ST04-017");
      e.asSouth().activateMain(stage);
      e.asSouth().acceptOptional();
      if (leaderCardId === "ST04-001") e.asSouth().chooseAddDon(1);
      expect(e.getView("south").players.south.stage?.rested).toBe(true);
      expect(e.getView("south").players.south.restedDon).toBe(leaderCardId === "ST04-001" ? 1 : 0);
      expect(e.getView("south").players.south.activeDon).toBe(0);
      e.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: stage,
        trigger: "activateMain",
      });
    },
  );
  test("decline leaves Stage active", () => {
    const e = OnePieceTestEngine.create({ leaderCardId: "ST04-001", stage: "ST04-017" });
    e.asSouth().activateMain(e.findCardInZone("south", "stage", "ST04-017"));
    e.asSouth().declineOptional();
    expect(e.getView("south").players.south.stage?.rested).toBe(false);
  });
});
