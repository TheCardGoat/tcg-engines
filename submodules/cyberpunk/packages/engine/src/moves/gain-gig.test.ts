import { describe, expect, it } from "vite-plus/test";
import { CyberpunkTestEngine, P1, P2, createMockLegend, createMockUnit } from "../testing/index.ts";

function spendFirstLegend(engine: CyberpunkTestEngine) {
  const legend = engine.getCardsInZone("legendArea", P1)[0];
  if (!legend) throw new Error("Expected P1 legend");
  engine.judgeSpendCard(legend, { as: P1 });
  return legend.instanceId;
}

function resolvePendingGainGig(engine: CyberpunkTestEngine) {
  const choice = engine.getState().G.turnMetadata.pendingChoice;
  expect(choice?.type).toBe("gainGig");
  if (!choice || choice.type !== "gainGig") throw new Error("Expected gainGig choice");
  return engine.gainGig(choice.payload.allowedDieIds[0]!, { as: choice.chooserId });
}

describe("gainGig step", () => {
  it("keeps the turn in start phase until the active player gains a gig", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      { deck: 10 },
      { deck: 10 },
      { autoGainGig: false },
    );

    const result = engine.completeTurn({ as: P1 });
    const choice = engine.getState().G.turnMetadata.pendingChoice;

    expect(engine.getPhase()).toBe("start");
    expect(choice?.type).toBe("gainGig");
    expect(result.gameEvents).toContainEqual(
      expect.objectContaining({ type: "phaseChanged", from: "main", to: "start" }),
    );
    expect(result.moveLogs).toContainEqual(
      expect.objectContaining({ type: "phaseChanged", fromPhase: "main", toPhase: "start" }),
    );

    const gainResult = resolvePendingGainGig(engine);

    expect(engine.getPhase()).toBe("main");
    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
    expect(gainResult.gameEvents).toContainEqual(
      expect.objectContaining({ type: "phaseChanged", from: "start", to: "main" }),
    );
    expect(gainResult.moveLogs).toContainEqual(
      expect.objectContaining({ type: "phaseChanged", fromPhase: "start", toPhase: "main" }),
    );
  });

  it("readies spent face-down legends at the start of the active player's turn", () => {
    const unit = createMockUnit({ cost: 2 });
    const legends = [
      createMockLegend({ name: "Legend A" }),
      createMockLegend({ name: "Legend B" }),
      createMockLegend({ name: "Legend C" }),
    ];
    const engine = CyberpunkTestEngine.createWithFixture(
      { hand: [unit], legendArea: legends, eddies: 1, deck: 10 },
      { deck: 10 },
      { autoGainGig: false },
    );

    engine.judgeSpendCard(engine.getCardsInZone("legendArea", P1)[0]!, { as: P1 });
    engine.judgeSpendCard(engine.getCardsInZone("legendArea", P1)[1]!, { as: P1 });
    engine.playCard(unit);

    expect(engine.getSpentLegends(P1)).toHaveLength(3);

    engine.completeTurn({ as: P1 });
    resolvePendingGainGig(engine);
    engine.completeTurn({ as: P2 });
    resolvePendingGainGig(engine);

    expect(engine.getSpentLegends(P1)).toHaveLength(0);
    expect(engine.getFaceDownLegends(P1)).toHaveLength(3);
  });

  it("readies spent face-down legends even when no fixer die can be gained (empty fixer)", () => {
    const legends = [
      createMockLegend({ name: "Legend A" }),
      createMockLegend({ name: "Legend B" }),
      createMockLegend({ name: "Legend C" }),
    ];
    const engine = CyberpunkTestEngine.createWithFixture(
      { legendArea: legends, deck: 10 },
      { deck: 10 },
      { activePlayerId: P2, autoGainGig: false },
    );
    const spentLegendId = spendFirstLegend(engine);

    engine.getState().G.players[P1]!.fixerArea = [];

    engine.completeTurn({ as: P2 });

    const legend = engine.getState().G.cardIndex[spentLegendId as string];
    expect(legend?.meta.spent).toBe(false);
    expect(legend?.meta.faceDown).toBe(true);
    expect(engine.getPhase()).toBe("main");
  });
});
