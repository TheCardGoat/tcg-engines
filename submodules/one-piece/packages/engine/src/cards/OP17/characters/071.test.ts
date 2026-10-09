import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";
describe("OP17-071 Who's.Who", () => {
  test.each([0, 1, 2])(
    "Life Trigger plays itself, then returns DON and K.O.s %i eligible targets",
    (count) => {
      const e = OnePieceTestEngine.create(
        { life: ["OP17-071", "ST02-002"], activeDon: 1 },
        { character: ["ST01-006", "ST01-003", "EB01-018"] },
        { activeSeat: "north", firstPlayer: "south" },
      );
      const who = e.findCardInZone("south", "life", "OP17-071");
      const targets = [
        e.findCardInZone("north", "character", "ST01-006"),
        e.findCardInZone("north", "character", "ST01-003"),
      ];
      const before = e.getView("south").players.south.donDeckCount;
      e.asNorth().attack(e.leader("north"), e.leader("south"));
      e.asSouth().activateLifeTrigger();
      e.asSouth().acceptOptional();
      const step = e.pendingDecision("effectTargetSelection", "south").steps[0];
      if (step.kind !== "selectEntity") throw new Error("Expected cost-qualified K.O. selection");
      expect(step.candidates.filter((c) => c.legal).map((c) => c.ref.id)).toEqual(targets);
      e.asSouth().chooseTargets(...targets.slice(0, count));
      expect(e.getView("south").players.south.characters.some((c) => c?.instanceId === who)).toBe(
        true,
      );
      expect(e.getView("south").players.south.donDeckCount).toBe(before + 1);
      expect(e.getView("south").players.north.trash.map((c) => c.instanceId)).toEqual(
        targets.slice(0, count),
      );
      expect(e.getView("south").prompts).toHaveLength(0);
    },
  );
  test("normal play may decline the payable DON return and keep the opposing Character", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP17-071"], activeDon: 2 },
      { character: ["ST01-003"] },
    );
    const before = e.getView("south").players.south.donDeckCount;
    e.playCard("OP17-071");
    e.asSouth().declineOptional();
    expect(e.getView("south").players.south.restedDon).toBe(2);
    expect(e.getView("south").players.south.donDeckCount).toBe(before);
    expect(e.getView("south").players.north.characters[0]?.cardId).toBe("ST01-003");
    expect(e.getView("south").prompts).toHaveLength(0);
  });
});
