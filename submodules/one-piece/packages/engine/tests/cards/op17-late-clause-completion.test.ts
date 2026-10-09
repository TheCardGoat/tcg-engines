import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../src/index.ts";

describe("OP17 late Character clause completion", () => {
  test.each(["1", "0"])(
    "OP17-062 adds %s active DON!! before readying one, once per turn",
    (amount) => {
      const e = OnePieceTestEngine.create(
        {
          character: ["OP17-062", "OP16-063", "OP16-063"],
          activeDon: 2,
          restedDon: 3,
          donDeckCount: 5,
        },
        {},
      );
      const kuzans = e
        .getView("south")
        .players.south.characters.flatMap((c) =>
          c?.cardId === "OP16-063" && c.instanceId ? [c.instanceId] : [],
        );
      e.asSouth().activateMain(kuzans[0]!);
      e.resolveDecision("effectCostReturnDon", { selectedIds: ["active-don:0"] }, "south");
      e.resolveDecision("effectAddDon", { optionId: amount }, "south");
      e.resolveDecision("effectSetActiveDon", { optionId: "1" }, "south");
      const first = e.getView("south").players.south;
      expect(first.activeDon).toBe(2 + Number(amount));
      expect(first.restedDon).toBe(2);
      expect(first.donDeckCount).toBe(6 - Number(amount));
      e.asSouth().activateMain(kuzans[1]!);
      e.resolveDecision("effectCostReturnDon", { selectedIds: ["active-don:0"] }, "south");
      expect(e.getView("south").players.south.activeDon).toBe(first.activeDon - 1);
      expect(e.getView("south").prompts).toHaveLength(0);
    },
  );

  test("OP17-062 does not add or ready DON!! on the opponent's turn", () => {
    const e = OnePieceTestEngine.create(
      { character: ["OP17-062"], hand: ["OP17-077"], activeDon: 2, restedDon: 3, donDeckCount: 5 },
      { character: ["OP16-004"] },
      { activeSeat: "north" },
    );
    e.asNorth().attack("OP16-004", e.leader("south"));
    e.resolveDecision("battleBlocker", { optionId: "skip" }, "south");
    e.asSouth().chooseCounter("OP17-077");
    e.asSouth().acceptOptional();
    e.resolveDecision("effectCostReturnDon", { selectedIds: ["active-don:0"] }, "south");
    const view = e.getView("south");
    expect(view.players.south.activeDon).toBe(0);
    expect(view.players.south.restedDon).toBe(4);
    expect(view.players.south.donDeckCount).toBe(6);
    expect(view.prompts).toHaveLength(0);
  });

  test("OP17-111 reveals exactly two Trigger cards without trashing them before K.O.", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP17-111", "OP17-107", "OP17-108", "OP17-109", "EB01-005"], activeDon: 3 },
      { character: ["OP13-013", "OP13-013", "EB01-005"] },
    );
    e.asSouth().play("OP17-111");
    e.asSouth().acceptOptional();
    const choice = e.pendingDecision("effectCostRevealFromHand", "south").steps[0];
    if (choice?.kind !== "payCost") throw new Error("Expected reveal cost selection");
    expect(choice).toMatchObject({ min: 2, max: 2 });
    expect(choice.candidates).toHaveLength(3);
    const ids = [
      e.findCardInZone("south", "hand", "OP17-107"),
      e.findCardInZone("south", "hand", "OP17-108"),
    ];
    e.resolveDecision("effectCostRevealFromHand", { selectedIds: ids }, "south");
    const targets = e
      .getView("north")
      .players.north.characters.flatMap((c) =>
        c?.cardId === "OP13-013" && c.instanceId ? [c.instanceId] : [],
      );
    e.resolveDecision("effectTargetSelection", { selectedIds: targets }, "south");
    const view = e.getView("south");
    expect(view.players.south.handCount).toBe(4);
    expect(view.players.south.trash).toHaveLength(0);
    expect(view.players.north.trash.map((c) => c.instanceId)).toEqual(targets);
    expect(view.players.north.characters.filter(Boolean)).toHaveLength(1);
    expect(view.prompts).toHaveLength(0);
  });

  test.each([0, 1])("OP17-111 cannot pay with %s Trigger cards", (count) => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP17-111", ...["OP17-107"].slice(0, count), "EB01-005"], activeDon: 3 },
      { character: ["OP13-013"] },
    );
    e.asSouth().play("OP17-111");
    expect(e.getView("south").prompts).toHaveLength(0);
    expect(e.getView("south").players.north.characters.filter(Boolean)).toHaveLength(1);
  });

  test("OP17-111 can decline its reveal cost", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP17-111", "OP17-107", "OP17-108"], activeDon: 3 },
      { character: ["OP13-013"] },
    );
    e.asSouth().play("OP17-111");
    e.asSouth().declineOptional();
    expect(e.getView("south").players.south.handCount).toBe(2);
    expect(e.getView("south").players.north.trash).toHaveLength(0);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
});
