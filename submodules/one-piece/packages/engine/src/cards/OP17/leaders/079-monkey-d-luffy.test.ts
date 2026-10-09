import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

describe("OP17-079 Monkey.D.Luffy", () => {
  test("Saul's real +12 cost effect grants Blocker and protects Life", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: "OP17-079", character: ["OP17-089", "OP17-118"] },
      {},
      { activeSeat: "north" },
    );
    const saul = engine.findCardInZone("south", "character", "OP17-089");
    const life = engine.getView("south").players.south.lifeCount;
    expect(engine.getView("south").players.south.characters[0]?.cost).toBe(16);
    engine.declareAttack(engine.leader("north"), engine.leader("south"), "north");
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Blocker selection");
    expect(
      blocker.candidates.filter((card) => card.ref.kind === "card").map((card) => card.ref.id),
    ).toEqual([saul]);
    engine.resolveDecision("battleBlocker", { selectedIds: [saul] }, "south");
    expect(engine.getView("south").players.south.lifeCount).toBe(life);
    expect(engine.getView("south").players.south.characters[0]?.rested).toBe(true);
    expect(engine.getView("south").players.south.trash).toHaveLength(0);
  });

  test("Sabo's real cost increase grants Blocker at exactly cost 12", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: "OP17-079", character: ["OP17-118", "OP13-120"] },
      {},
    );
    const xebec = engine.findCardInZone("south", "character", "OP17-118");
    const sabo = engine.findCardInZone("south", "character", "OP13-120");
    engine.activateEffect(sabo, "activateMain", "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [xebec] }, "south");
    expect(engine.getView("south").players.south.characters[0]?.cost).toBe(12);
    engine.endTurn("south");
    const life = engine.getView("south").players.south.lifeCount;
    engine.declareAttack(engine.leader("north"), engine.leader("south"), "north");
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Blocker selection");
    expect(
      blocker.candidates.filter((card) => card.ref.kind === "card").map((card) => card.ref.id),
    ).toEqual([xebec, sabo]);
    engine.resolveDecision("battleBlocker", { selectedIds: [xebec] }, "south");
    expect(engine.getView("south").players.south.lifeCount).toBe(life);
    expect(engine.getView("south").players.south.characters[0]?.rested).toBe(true);
    engine.endTurn("north");
    expect(engine.getView("south").players.south.characters[0]?.cost).toBe(10);
  });

  test("cost-10 Xebec has no Blocker and cannot protect Life", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: "OP17-079", character: ["OP17-118"] },
      {},
      { activeSeat: "north" },
    );
    const life = engine.getView("south").players.south.lifeCount;
    engine.declareAttack(engine.leader("north"), engine.leader("south"), "north");
    expect(engine.getView("south").players.south.lifeCount).toBe(life - 1);
    expect(engine.getView("south").players.south.characters[0]?.rested).toBe(false);
    expect(
      engine
        .getView("south")
        .decisions.some((d) => d.extensions?.resolutionIntent === "battleBlocker"),
    ).toBe(false);
  });
  test.each(["leader", "character", "saul"])(
    "negating %s applies the FAQ distinction for externally granted Blocker",
    (mode) => {
      const e = OnePieceTestEngine.create(
        { leaderCardId: "OP17-079", character: ["OP13-120", "OP17-089", "OP17-118"], hand: [] },
        { leaderCardId: "OP09-081", character: [{ cardId: "OP09-093", playedOnTurn: 4 }] },
        { activeSeat: "south", turnNumber: 3 },
      );
      const sabo = e.findCardInZone("south", "character", "OP13-120");
      const saul = e.findCardInZone("south", "character", "OP17-089");
      const xebec = e.findCardInZone("south", "character", "OP17-118");
      e.asSouth().activateMain(sabo);
      e.resolveDecision("effectTargetSelection", { selectedIds: [xebec] }, "south");
      e.endTurn("south");
      e.asNorth().activateMain("OP09-093");
      e.resolveDecision(
        "effectTargetSelection",
        { selectedIds: mode === "leader" ? [e.leader("south")] : [] },
        "north",
      );
      e.resolveDecision(
        "effectTargetSelection",
        { selectedIds: mode === "leader" ? [] : [mode === "saul" ? saul : xebec] },
        "north",
      );
      const life = e.getView("south").players.south.lifeCount;
      e.asNorth().attack(e.leader("north"), e.leader("south"));
      if (mode === "leader") {
        const step = e.pendingDecision("battleBlocker", "south").steps[0];
        if (step.kind !== "selectEntity") throw new Error("Expected intrinsic Sabo Blocker");
        expect(step.candidates.filter((c) => c.ref.kind === "card").map((c) => c.ref.id)).toEqual([
          sabo,
        ]);
        e.resolveDecision("battleBlocker", { selectedIds: [] }, "south");
        expect(e.getView("south").players.south.lifeCount).toBe(life - 1);
        expect(e.getView("south").prompts).toHaveLength(0);
      } else {
        const step = e.pendingDecision("battleBlocker", "south").steps[0];
        if (step.kind !== "selectEntity") throw new Error("Expected Blocker choice");
        const ids = step.candidates.map((c) => c.ref.id);
        expect(ids).toContain(xebec);
        if (mode === "saul") expect(ids).not.toContain(saul);
        e.resolveDecision("battleBlocker", { selectedIds: [xebec] }, "south");
        expect(e.getView("south").players.south.lifeCount).toBe(life);
      }
    },
  );
});
