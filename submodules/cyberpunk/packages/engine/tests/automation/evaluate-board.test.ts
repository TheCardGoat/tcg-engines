import { describe, expect, test } from "vite-plus/test";
import { evaluateBoard, extractBoardFeatures } from "../../src/automation/search/evaluate-board.ts";
import type { FilteredCardView, FilteredMatchView } from "../../src/view/filter.ts";

function card(
  instanceId: string,
  power: number,
  options: Partial<FilteredCardView> = {},
): FilteredCardView {
  return {
    instanceId,
    definitionId: instanceId,
    cardName: instanceId,
    zone: "field",
    faceDown: false,
    spent: false,
    damage: 0,
    power,
    effectivePower: power,
    cost: 1,
    type: "unit",
    classifications: [],
    hasSellTag: false,
    attachedGearIds: [],
    attachedToId: null,
    hasLag: false,
    hasAttackedThisTurn: false,
    grantedRules: [],
    keywords: [],
    triggerHints: [],
    abilityHints: [],
    ...options,
  };
}

function view(input?: {
  ownGigs?: number;
  rivalGigs?: number;
  ownField?: FilteredCardView[];
  rivalField?: FilteredCardView[];
  winnerId?: string | null;
}): FilteredMatchView {
  const player = (field: FilteredCardView[], gigCount: number) => ({
    zones: {
      field,
      hand: 4,
      deck: 20,
      trash: [],
      legendArea: [],
      eddieArea: [],
      gigArea: [],
      fixerArea: [],
    },
    eddies: 2,
    availableEddies: 3,
    gigCount,
    fixerCount: 5,
    streetCred: gigCount * 4,
  });
  return {
    players: {
      p1: player(input?.ownField ?? [], input?.ownGigs ?? 3),
      p2: player(input?.rivalField ?? [], input?.rivalGigs ?? 3),
    },
    gamePhase: "main",
    turnNumber: 4,
    activePlayerId: "p1",
    playedCardTypesThisTurn: { p1: [], p2: [] },
    attackState: null,
    gameEnded: input?.winnerId !== undefined,
    winnerId: input?.winnerId ?? null,
    winReason: input?.winnerId !== undefined ? "winCondition" : null,
    stateID: 1,
    prompt: { status: "waiting", availableMoves: [], choice: null },
  };
}

describe("public board evaluator", () => {
  test("strongly prefers a terminal win and rejects a terminal loss", () => {
    expect(evaluateBoard(view({ winnerId: "p1" }), "p1")).toBeGreaterThan(500_000);
    expect(evaluateBoard(view({ winnerId: "p2" }), "p1")).toBeLessThan(-500_000);
  });

  test("values the late Gig race non-linearly", () => {
    const ahead = evaluateBoard(view({ ownGigs: 6, rivalGigs: 4 }), "p1");
    const early = evaluateBoard(view({ ownGigs: 4, rivalGigs: 2 }), "p1");
    expect(ahead).toBeGreaterThan(early);
  });

  test("accounts for ready blockers, material, and attack pressure", () => {
    const blocker = card("blocker", 6, { keywords: ["blocker"] });
    const spent = card("spent", 8, { spent: true });
    const features = extractBoardFeatures(
      view({ ownField: [blocker], rivalField: [spent], rivalGigs: 5 }),
      "p1",
    );
    expect(features.blockerCoverage).toBeGreaterThan(1);
    expect(features.readyPower).toBe(6);
    expect(features.attackPressure).toBe(1);
  });

  test("counts a Lagged blocker as defense but not ordinary attack pressure", () => {
    const laggedBlocker = card("lagged-blocker", 4, {
      hasLag: true,
      keywords: ["blocker"],
    });
    const features = extractBoardFeatures(view({ ownField: [laggedBlocker] }), "p1");

    expect(features.blockerCoverage).toBeGreaterThan(1);
    expect(features.readyPower).toBe(0);
    expect(features.attackPressure).toBe(0);
  });

  test("does not inspect hidden opponent hand identities", () => {
    const numericHand = view();
    expect(extractBoardFeatures(numericHand, "p2").handSize).toBe(4);
  });
});
