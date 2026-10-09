import { expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../src/index.ts";

// OP10-069 official FAQ: [DON!! x1] must still hold after DON!! -1.
test.each(["attached", "active"])(
  "saved DON payment rechecks attachment after paying %s DON",
  (payment) => {
    let e = OnePieceTestEngine.create(
      { character: [{ cardId: "OP10-069", attachedDon: 1, playedOnTurn: 0 }], activeDon: 1 },
      { character: ["OP10-065", "OP10-066"] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const fish = e.findCardInZone("south", "character", "OP10-069"),
      victim = e.findCardInZone("north", "character", "OP10-065");
    const before = e.getView("south").players.south.donDeckCount;
    e.asSouth().attack(fish, e.leader("north"));
    e.asSouth().acceptOptional();
    e = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(e.getState())));
    const prompt = e.pendingDecision("effectCostReturnDon", "south");
    const rejected = e.expectFailure({
      type: "resolvePrompt",
      seat: "south",
      promptId: prompt.id,
      selectedIds: ["active-don:9"],
    });
    e = OnePieceTestEngine.fromState(rejected.state);
    e.resolveDecision(
      "effectCostReturnDon",
      { selectedIds: [payment === "attached" ? `attached-don:${fish}:0` : "active-don:0"] },
      "south",
    );
    expect(e.getView("south").players.south.donDeckCount).toBe(before + 1);
    if (payment === "active") {
      e.asSouth().chooseTargets(victim);
      expect(e.getView("north").players.north.trash.some((c) => c.instanceId === victim)).toBe(
        true,
      );
    } else {
      expect(
        e.getView("north").players.north.characters.some((c) => c?.instanceId === victim),
      ).toBe(true);
      expect(e.getView("south").prompts).toHaveLength(0);
    }
  },
);

test("returning one of two attached DON preserves the DON x1 requirement", () => {
  const e = OnePieceTestEngine.create(
    { character: [{ cardId: "OP10-069", attachedDon: 2, playedOnTurn: 0 }] },
    { character: ["OP10-065", "OP10-066"] },
    { firstPlayer: "north", activeSeat: "south" },
  );
  const fish = e.findCardInZone("south", "character", "OP10-069"),
    victim = e.findCardInZone("north", "character", "OP10-065");
  e.asSouth().attack(fish, e.leader("north"));
  e.asSouth().acceptOptional();
  // Both DON!! cards have the same source, so this payment is automatic.
  e.asSouth().chooseTargets(victim);
  expect(
    e.getView("south").players.south.characters.find((c) => c?.instanceId === fish)?.attachedDon,
  ).toBe(1);
  expect(e.getView("north").players.north.trash.some((c) => c.instanceId === victim)).toBe(true);
});
