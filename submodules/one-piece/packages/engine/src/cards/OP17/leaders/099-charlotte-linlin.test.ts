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
    engine.asNorth().chooseCounter();

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
});
