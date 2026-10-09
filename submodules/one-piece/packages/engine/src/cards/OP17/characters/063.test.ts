import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

// Auto-verified: Kaido (OP17-063) cost=10 power=12000 counter=0
describe("OP17-063 Kaido", () => {
  test("[Activate: Main] resolves its activated ability", () => {
    const engine = OnePieceTestEngine.create(
      { character: ["OP17-063", "EB01-005"], activeDon: 14 },
      { character: ["OP13-013"], activeDon: 5 },
    );
    const cardId = engine.findCardInZone("south", "character", "OP17-063");

    engine.activateEffect(cardId, "activateMain", "south");
    engine.acceptLeadingOptional("south");

    for (let i = 0; i < 3; i++) {
      const remaining = engine.getView("south").prompts;
      if (remaining.length === 0) break;
      const d = (engine.getView("south").decisions ?? [])[0];
      if (!d) break;
      const intent = (d as { extensions?: { resolutionIntent?: any } }).extensions
        ?.resolutionIntent as any;
      if (intent === "effectTargetSelection" || intent === "effectPlaySelection") {
        const step = engine.pendingDecision(intent, "south").steps[0];
        if (step?.kind === "selectEntity" && step.candidates.length > 0) {
          engine.resolveDecision(
            intent as Parameters<typeof engine.resolveDecision>[0],
            { selectedIds: [step.candidates[0]!.ref.id] },
            "south",
          );
        } else {
          engine.resolveDecision(
            intent as Parameters<typeof engine.resolveDecision>[0],
            { selectedIds: [] },
            "south",
          );
        }
      } else {
        engine.resolveDecision(
          intent as Parameters<typeof engine.resolveDecision>[0],
          { optionId: "no" },
          "south",
        );
      }
    }

    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[Continuous] survives the turn handoff", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "OP17-063", attachedDon: 1 }], activeDon: 5 },
      { activeDon: 5 },
    );
    const northBefore = engine.getView("south").players.north;

    engine.endTurn("south");
    const after = engine.getView("south").players.north;

    expect(after.activeDon).toBe(northBefore.activeDon + 2);
    expect(after.lifeCount).toBe(northBefore.lifeCount);
    expect(engine.getView("south").players.south.characters.map((c) => c?.cardId)).toContain(
      "OP17-063",
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
  test("negates a cost-five Character's KO protection before K.O.ing that same Character", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "OP17-063", playedOnTurn: 3 }], activeDon: 1 },
      { character: ["OP06-086", "OP02-114"] },
      { turnNumber: 3 },
    );
    const target = e.findCardInZone("north", "character", "OP02-114");
    e.asSouth().activateMain("OP17-063");
    e.asSouth().acceptOptional();
    e.resolveDecision("effectTargetSelection", { selectedIds: [target] }, "south");
    expect(e.getView("south").players.north.trash.map((c) => c.instanceId)).toContain(target);
    expect(e.getView("south").players.north.characters.some((c) => c?.cardId === "OP06-086")).toBe(
      true,
    );
  });
  test("after a real turn cycle the DON cost is paid but the played-this-turn effect does not apply", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "OP17-058", hand: ["OP17-063"], activeDon: 10 },
      { character: ["EB01-005"] },
    );
    const target = e.findCardInZone("north", "character", "EB01-005");
    e.asSouth().play("OP17-063");
    e.endTurn("south");
    e.endTurn("north");
    const before = e.getView("south").players.south;
    e.asSouth().activateMain("OP17-063");
    e.asSouth().acceptOptional();
    const after = e.getView("south");
    expect(after.players.south.activeDon).toBe(before.activeDon - 1);
    expect(after.players.south.donDeckCount).toBe(before.donDeckCount + 1);
    expect(after.players.north.characters.some((c) => c?.instanceId === target)).toBe(true);
    expect(after.players.north.trash).toHaveLength(0);
    expect(after.prompts).toHaveLength(0);
  });
});
