import { describe, expect, it } from "vite-plus/test";
import type { CardType } from "@tcg/cyberpunk-types";
import { hasReadyUnitAdvantage } from "../../src/automation/util/board-presence.ts";
import type { FilteredCardView, FilteredMatchView } from "../../src/view/filter.ts";

function unit(id: string, grantedRules: string[] = [], keywords: string[] = []): FilteredCardView {
  return {
    instanceId: id,
    definitionId: id,
    cardName: id,
    zone: "field",
    faceDown: false,
    revealed: false,
    spent: false,
    damage: 0,
    power: 3,
    effectivePower: 3,
    cost: 2,
    effectiveCost: 2,
    costEffects: [],
    activeEffects: [],
    type: "unit",
    classifications: [],
    hasSellTag: false,
    attachedGearIds: [],
    attachedToId: null,
    hasLag: false,
    hasAttackedThisTurn: false,
    hasStolenGigThisTurn: false,
    grantedRules,
    keywords,
    triggerHints: [],
    abilityHints: [],
  };
}

function view(
  ownField: FilteredCardView[],
  rivalField: FilteredCardView[],
  playedCardTypesThisTurn: Record<string, CardType[]> = { p1: [], p2: [] },
): FilteredMatchView {
  const player = (field: FilteredCardView[], firstPlayer: boolean) => ({
    firstPlayer,
    zones: {
      field,
      hand: [],
      deck: 20,
      trash: [],
      legendArea: [],
      eddieArea: [],
      gigArea: [],
      fixerArea: [],
    },
    eddies: 0,
    availableEddies: 0,
    gigCount: 0,
    fixerCount: 6,
    streetCred: 0,
    activeEffects: [],
    soldThisTurn: false,
    calledLegendThisTurn: false,
    calledLegendThisRivalTurn: false,
  });
  return {
    players: { p1: player(ownField, true), p2: player(rivalField, false) },
    gamePhase: "main",
    turnNumber: 1,
    activePlayerId: "p1",
    overtimeActive: false,
    previousTurnBeganWithEmptyFixer: false,
    turnBeganWithEmptyFixer: false,
    playedCardTypesThisTurn,
    attackState: null,
    gameEnded: false,
    winnerId: null,
    winReason: null,
    stateID: 1,
    prompt: { status: "waiting", availableMoves: [], choice: null },
  };
}

describe("ready Unit advantage", () => {
  it("compares direct attackers only with ready rival Blockers", () => {
    expect(
      hasReadyUnitAdvantage(
        view(
          [unit("first"), unit("second")],
          [unit("blocker", [], ["blocker"]), unit("non-blocker")],
        ),
        "p1",
      ),
    ).toBe(true);
  });

  it("does not count a Unit that cannot attack the rival Gig area", () => {
    expect(
      hasReadyUnitAdvantage(
        view(
          [unit("legal"), unit("unit-only", ["cantAttackRival"])],
          [unit("blocker", [], ["blocker"])],
        ),
        "p1",
      ),
    ).toBe(false);
  });

  it("counts a conditional attacker only after a Program was played", () => {
    const own = [unit("legal"), unit("conditional", ["requiresProgramPlayedThisTurn"])];
    const rival = [unit("blocker", [], ["blocker"])];

    expect(hasReadyUnitAdvantage(view(own, rival), "p1")).toBe(false);
    expect(hasReadyUnitAdvantage(view(own, rival, { p1: ["program"], p2: [] }), "p1")).toBe(true);
  });
});
