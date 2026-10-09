import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";

function pay(engine: OnePieceTestEngine) {
  engine.activateEffect(engine.leader("south"), "activateMain", "south");
  engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
  engine.resolveDecision(
    "effectCostReturnDon",
    { selectedIds: ["active-don:0", "active-don:1", "active-don:2"] },
    "south",
  );
}

describe("ST10-001 Trafalgar Law", () => {
  test("pays DON!! -3, bottom-decks only an opposing 3000-or-less Character, and plays a cost-4 Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: "ST10-001",
        hand: ["OP06-094", "EB01-018", "ST01-015"],
        character: ["ST01-006"],
        activeDon: 3,
        restedDon: 3,
      },
      { character: ["OP06-085", "OP06-094"] },
    );
    const removedId = engine.findCardInZone("north", "character", "OP06-085");
    const highPowerId = engine.findCardInZone("north", "character", "OP06-094");
    const playedId = engine.findCardInZone("south", "hand", "OP06-094");
    const deckBefore = engine.getView("north").players.north.deckCount;
    const donBefore = engine.getView("south").players.south.donDeckCount;
    pay(engine);
    const removal = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (removal?.kind !== "selectEntity") throw new Error("Expected Law's removal choice");
    expect(removal.candidates.map((c) => c.ref.id)).toEqual([removedId]);
    expect(removal.candidates.map((c) => c.ref.id)).not.toContain(highPowerId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [removedId] }, "south");
    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    if (play?.kind !== "selectEntity") throw new Error("Expected Law's play choice");
    expect(play.candidates.map((c) => c.ref.id)).toEqual([playedId]);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [playedId] }, "south");
    const view = engine.getView("south");
    expect(view.players.north.deckCount).toBe(deckBefore + 1);
    expect(engine.findCardInZone("north", "deck", "OP06-085")).toBe(removedId);
    expect(view.players.north.characters.some((c) => c?.instanceId === highPowerId)).toBe(true);
    expect(view.players.south.characters.find((c) => c?.instanceId === playedId)?.rested).toBe(
      false,
    );
    expect(view.players.south).toMatchObject({
      activeDon: 0,
      restedDon: 3,
      donDeckCount: donBefore + 3,
    });
    expect(view.prompts).toHaveLength(0);
    engine.expectFailure({
      type: "activateEffect",
      seat: "south",
      sourceInstanceId: engine.leader("south"),
      trigger: "activateMain",
    });
  });

  test("declining payment keeps DON!! and once-per-turn use available", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: "ST10-001",
      activeDon: 3,
      restedDon: 3,
    });
    engine.activateEffect(engine.leader("south"), "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");
    expect(engine.getView("south").players.south).toMatchObject({ activeDon: 3, restedDon: 3 });
    pay(engine);
    expect(engine.getView("south").players.south).toMatchObject({ activeDon: 0, restedDon: 3 });
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test.each([false, true])(
    "plays from hand even with no removal: declining target=%s",
    (hasTarget) => {
      const engine = OnePieceTestEngine.create(
        { leaderCardId: "ST10-001", hand: ["OP06-094"], activeDon: 3, restedDon: 3 },
        { character: hasTarget ? ["OP06-085"] : ["EB01-018"] },
      );
      const playedId = engine.findCardInZone("south", "hand", "OP06-094");
      const opposingId = engine.getView("north").players.north.characters.find(Boolean)?.instanceId;
      pay(engine);
      if (hasTarget) engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");
      engine.resolveDecision("effectPlaySelection", { selectedIds: [playedId] }, "south");
      expect(engine.getView("south").players.south.characters.map((c) => c?.instanceId)).toContain(
        playedId,
      );
      expect(engine.getView("north").players.north.characters.map((c) => c?.instanceId)).toContain(
        opposingId,
      );
      expect(engine.getView("south").prompts).toHaveLength(0);
    },
  );

  test("cannot activate with fewer than three DON!! on the field", () => {
    const engine = OnePieceTestEngine.create({ leaderCardId: "ST10-001", activeDon: 2 });
    engine.expectFailure({
      type: "activateEffect",
      seat: "south",
      sourceInstanceId: engine.leader("south"),
      trigger: "activateMain",
    });
    expect(engine.getView("south").players.south.activeDon).toBe(2);
  });
});
