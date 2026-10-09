import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

describe("OP17-099", () => {
  test("[When Attacking] trashing a hand card makes the opponent choose a branch", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: "OP17-099",
        hand: ["EB01-005", "EB01-007"],
        life: ["OP12-013"],
        activeDon: 5,
        deck: ["OP12-017", "OP13-013"],
      },
      { hand: ["OP13-013"], activeDon: 5 },
    );
    const trashId = engine.findCardInZone("south", "hand", "EB01-005");
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.asSouth().attack(engine.leader("south"), engine.asNorth().leader());
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectCostTrashFromHand", { selectedIds: [trashId] }, "south");
    // Opponent branch 1: trash one of Big Mom's cards; she adds a deck card to Life.
    engine.resolveDecision("effectActionChoice", { optionId: "0" }, "north");
    engine.resolveDecision("effectAddToLifeFromDeck", { optionId: "1" }, "south");
    // No usable Counter remains, so the Counter Step ends automatically.

    expect(engine.getView("south").players.south.lifeCount).toBe(lifeBefore + 1);
    expect(engine.getView("south").players.south.trash.map((c) => c.instanceId)).toContain(trashId);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[When Attacking] declined trashes nothing", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: "OP17-099",
        hand: ["EB01-005", "EB01-007"],
        life: ["OP12-013"],
        activeDon: 5,
        deck: ["OP12-017", "OP13-013"],
      },
      { hand: ["OP13-013"], activeDon: 5 },
    );
    const handBefore = engine.getView("south").players.south.handCount;

    engine.asSouth().attack(engine.leader("south"), engine.asNorth().leader());
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    expect(engine.getView("south").players.south.handCount).toBe(handBefore);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
  test.each([0, 1])(
    "the Life branch still offers %i Life after the last hand card pays activation",
    (amount) => {
      let e = OnePieceTestEngine.create(
        { leaderCardId: "OP17-099", hand: ["EB01-005"], deck: ["EB01-007", "EB01-005"] },
        {},
      );
      const life = e.getView("south").players.south.lifeCount;
      e.asSouth().attack(e.leader("south"), e.leader("north"));
      e.asSouth().acceptOptional();
      e.resolveDecision("effectActionChoice", { optionId: "0" }, "north");
      e = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(e.getState())));
      e.resolveDecision("effectAddToLifeFromDeck", { optionId: String(amount) }, "south");
      expect(e.getView("south").players.south.lifeCount).toBe(life + amount);
      expect(e.getView("south").players.south.handCount).toBe(0);
    },
  );
  test("Linlin's controller chooses an opposing hand card without seeing its identity", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "OP17-099", hand: ["EB01-005"] },
      { hand: ["ST02-002", "ST02-006"] },
    );
    e.asSouth().attack(e.leader("south"), e.leader("north"));
    e.asSouth().acceptOptional();
    e.resolveDecision("effectActionChoice", { optionId: "1" }, "north");
    const step = e.pendingDecision("effectTrashFromHandSelection", "south").steps[0];
    if (step.kind !== "selectEntity") throw new Error("Expected private hand selection");
    expect(step.candidates).toHaveLength(2);
    expect(step.candidates.every((c) => !c.publicInfo?.cardId)).toBe(true);
    const id = step.candidates[0]!.ref.id;
    e.resolveDecision("effectTrashFromHandSelection", { selectedIds: [id] }, "south");
    expect(e.getView("south").players.north.trash).toHaveLength(1);
    expect(e.getView("south").players.north.trash[0]?.cardId).toBe("ST02-002");
  });
});
