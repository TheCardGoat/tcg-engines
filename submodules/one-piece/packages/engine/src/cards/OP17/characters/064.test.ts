import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

// Auto-verified: King (OP17-064) cost=9 power=10000 counter=0
describe("OP17-064 King", () => {
  test("[On Opponent's Attack] resolves its trigger during an opposing attack", () => {
    const engine = OnePieceTestEngine.create(
      { character: ["OP17-064"], hand: ["EB01-005"], activeDon: 5 },
      { character: ["OP16-003"], activeDon: 5 },
    );
    const cardId = engine.findCardInZone("south", "character", "OP17-064");

    engine.endTurn("south");
    engine.asNorth().attack("OP16-003", engine.asSouth().leader());
    engine.acceptLeadingOptional("south");

    expect(engine.getView("south").players.south.characters.map((c) => c?.instanceId)).toContain(
      cardId,
    );
  });

  test("[Continuous] survives the turn handoff", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "OP17-064", attachedDon: 1 }], activeDon: 5 },
      { activeDon: 5 },
    );
    const northBefore = engine.getView("south").players.north;

    engine.endTurn("south");
    const after = engine.getView("south").players.north;

    expect(after.activeDon).toBe(northBefore.activeDon + 2);
    expect(after.lifeCount).toBe(northBefore.lifeCount);
    expect(engine.getView("south").players.south.characters.map((c) => c?.cardId)).toContain(
      "OP17-064",
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
  test("paid battle power protects the Leader without blocking and expires after battle", () => {
    const e = OnePieceTestEngine.create(
      { character: ["OP17-064"], hand: ["EB01-005"] },
      { activeDon: 1 },
      { activeSeat: "north" },
    );
    e.asNorth().attachDon(e.leader("north"), 1);
    const life = e.getView("south").players.south.lifeCount;
    e.asNorth().attack(e.leader("north"), e.leader("south"));
    e.asSouth().acceptOptional();
    e.resolveDecision("effectTargetSelection", { selectedIds: [e.leader("south")] }, "south");
    e.resolveDecision("battleBlocker", { selectedIds: [] }, "south");
    expect(e.getView("south").players.south.lifeCount).toBe(life);
    expect(e.getView("south").players.south.leader?.power).toBe(5000);
  });
  test("Blocker redirects a real attack and protects Life", () => {
    const e = OnePieceTestEngine.create(
      { character: ["OP17-064"], hand: [] },
      {},
      { activeSeat: "north" },
    );
    const life = e.getView("south").players.south.lifeCount;
    e.asNorth().attack(e.leader("north"), e.leader("south"));
    e.resolveDecision(
      "battleBlocker",
      { selectedIds: [e.findCardInZone("south", "character", "OP17-064")] },
      "south",
    );
    expect(e.getView("south").players.south.lifeCount).toBe(life);
    expect(e.getView("south").players.south.characters[0]?.rested).toBe(true);
  });
  test.each([true, false])(
    "first attack paid=%s: only an unspent effect can boost the second attack",
    (payFirst) => {
      const e = OnePieceTestEngine.create(
        {
          leaderCardId: "OP17-058",
          character: [{ cardId: "OP17-064", rested: true }],
          hand: ["EB01-005", "EB01-005"],
        },
        {
          character: [
            { cardId: "ST02-006", playedOnTurn: 0 },
            { cardId: "ST02-006", playedOnTurn: 0 },
          ],
        },
        { activeSeat: "north" },
      );
      const attackers = e
        .getView("north")
        .players.north.characters.flatMap((c) => (c ? [c.instanceId] : []));
      const pay = () => {
        e.asSouth().acceptOptional();
        const fodder = e.getView("south").players.south.hand[0]!.instanceId;
        if (!fodder) throw new Error("Expected a visible hand card");
        e.resolveDecision("effectCostTrashFromHand", { selectedIds: [fodder] }, "south");
        e.resolveDecision("effectTargetSelection", { selectedIds: [e.leader("south")] }, "south");
        expect(e.getView("south").players.south.leader?.power).toBe(7000);
      };
      e.asNorth().attack(attackers[0]!, e.leader("south"));
      if (payFirst) pay();
      else e.asSouth().declineOptional();
      e.asSouth().chooseCounter();
      expect(e.getView("south").players.south.leader?.power).toBe(5000);
      expect(e.getView("south").players.south.handCount).toBeGreaterThan(0);
      e.asNorth().attack(attackers[1]!, e.leader("south"));
      if (!payFirst) pay();
      else
        expect(
          e
            .getView("south")
            .decisions?.some((d) => d.extensions?.resolutionIntent === "effectOptional"),
        ).toBe(false);
      e.asSouth().chooseCounter();
      expect(
        e.getView("south").players.south.trash.filter((c) => c.cardId === "EB01-005"),
      ).toHaveLength(1);
      expect(e.getView("south").players.south.leader?.power).toBe(5000);
      expect(e.getView("south").prompts).toHaveLength(0);
    },
  );
});
