import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

describe("EB04-057", () => {
  test.each(
    [2, 3].flatMap((life) =>
      ["EB04-057", "OP07-100", "OP01-069", "EB01-005"].map((card) => ({ life, card })),
    ),
  )("protects only yellow Scientists at $life Life when $card is selected", ({ life, card }) => {
    const e = OnePieceTestEngine.create(
      { life, character: ["EB04-057", "OP07-100", "OP01-069", "EB01-005"] },
      { hand: ["ST01-015"], activeDon: 4 },
      { activeSeat: "north" },
    );
    const selectedId = e.findCardInZone("south", "character", card);
    e.playCard("ST01-015", "north");
    const target = e.pendingDecision("effectTargetSelection", "north").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected KO choices");
    expect(target.candidates.map((c) => c.ref.id)).toContain(selectedId);
    e.resolveDecision("effectTargetSelection", { selectedIds: [selectedId] }, "north");
    const protectedCard = life === 2 && ["EB04-057", "OP07-100"].includes(card);
    const view = e.getView("south");
    expect(view.players.south.characters.some((c) => c?.instanceId === selectedId)).toBe(
      protectedCard,
    );
    expect(view.players.south.trash.some((c) => c.instanceId === selectedId)).toBe(!protectedCard);
    expect(view.prompts).toHaveLength(0);
  });

  test("[DON!! x1] grants [Blocker] to intercept an attack", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "EB04-057", attachedDon: 1 }], activeDon: 5, life: 2 },
      { character: ["OP16-003"], activeDon: 5 },
    );
    const selfId = engine.findCardInZone("south", "character", "EB04-057");

    engine.endTurn("south");
    engine.asNorth().attack("OP16-003", engine.asSouth().leader());
    engine.asSouth().chooseBlocker(selfId);

    expect(engine.getView("south").players.south.trash.map((c) => c.instanceId)).toContain(selfId);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("without a DON!! attached no [Blocker] is offered", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "EB04-057", attachedDon: 0 }], activeDon: 5 },
      { character: ["OP16-003"], activeDon: 5 },
    );

    engine.endTurn("south");
    const lifeBefore = engine.getView("south").players.south.lifeCount;
    engine.asNorth().attack("OP16-003", engine.asSouth().leader());

    // Without the blocker the Leader takes the damage directly.
    expect(engine.getView("south").players.south.lifeCount).toBe(lifeBefore - 1);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
