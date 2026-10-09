import { describe, expect, test } from "vite-plus/test";
import type { CardType } from "@tcg/cyberpunk-types";
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
    revealed: false,
    spent: false,
    damage: 0,
    power,
    effectivePower: power,
    cost: 1,
    effectiveCost: 1,
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
  ownGigValues?: number[];
  ownHand?: FilteredCardView[];
  ownField?: FilteredCardView[];
  ownLegendArea?: FilteredCardView[];
  rivalField?: FilteredCardView[];
  rivalGigValues?: number[];
  playedCardTypesThisTurn?: Record<string, CardType[]>;
  winnerId?: string | null;
}): FilteredMatchView {
  const player = (
    field: FilteredCardView[],
    gigCount: number,
    hand: FilteredCardView[] | number = 4,
    gigValues: number[] = [],
    legendArea: FilteredCardView[] = [],
    firstPlayer = false,
  ) => ({
    firstPlayer,
    zones: {
      field,
      hand,
      deck: 20,
      trash: [],
      legendArea,
      eddieArea: [],
      gigArea: gigValues.map((value, index) =>
        card(`gig-${value}-${index}`, value, { zone: "gigArea", type: null, cost: null }),
      ),
      fixerArea: [],
    },
    eddies: 2,
    availableEddies: 3,
    gigCount,
    fixerCount: 5,
    streetCred: gigCount * 4,
    activeEffects: [],
    soldThisTurn: false,
    calledLegendThisTurn: false,
    calledLegendThisRivalTurn: false,
  });
  return {
    players: {
      p1: player(
        input?.ownField ?? [],
        input?.ownGigs ?? 3,
        input?.ownHand ?? 4,
        input?.ownGigValues ?? [],
        input?.ownLegendArea ?? [],
        true,
      ),
      p2: player(input?.rivalField ?? [], input?.rivalGigs ?? 3, 4, input?.rivalGigValues ?? []),
    },
    gamePhase: "main",
    turnNumber: 4,
    activePlayerId: "p1",
    overtimeActive: false,
    previousTurnBeganWithEmptyFixer: false,
    turnBeganWithEmptyFixer: false,
    playedCardTypesThisTurn: input?.playedCardTypesThisTurn ?? { p1: [], p2: [] },
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

  test("does not count a rival-only restriction as direct attack pressure", () => {
    const unitOnly = card("unit-only", 7, { grantedRules: ["cantAttackRival"] });
    const features = extractBoardFeatures(view({ ownField: [unitOnly] }), "p1");

    expect(features.readyPower).toBe(7);
    expect(features.attackPressure).toBe(0);
  });

  test("requires the Program precondition before counting attack pressure", () => {
    const conditional = card("conditional", 7, {
      grantedRules: ["requiresProgramPlayedThisTurn"],
    });
    const blocked = extractBoardFeatures(view({ ownField: [conditional] }), "p1");
    const enabled = extractBoardFeatures(
      view({
        ownField: [conditional],
        playedCardTypesThisTurn: { p1: ["program"], p2: [] },
      }),
      "p1",
    );

    expect(blocked.readyPower).toBe(0);
    expect(blocked.attackPressure).toBe(0);
    expect(enabled.readyPower).toBe(7);
    expect(enabled.attackPressure).toBe(1);
  });

  test("does not inspect hidden opponent hand identities", () => {
    const numericHand = view();
    expect(extractBoardFeatures(numericHand, "p2").handSize).toBe(4);
  });

  test("values a Gig pair when it enables a visible card in hand", () => {
    const payoff = card("pair-payoff", 6, {
      zone: "hand",
      cost: 3,
      effectiveCost: 3,
      abilityHints: [
        {
          abilityIndex: 0,
          timing: "play",
          event: null,
          reactive: false,
          effects: ["draw"],
          conditions: ["hasGigPair"],
          conditionThresholds: [],
          requiredHostNames: [],
          roles: ["cardAdvantage"],
          requirements: [],
        },
      ],
    });
    const paired = extractBoardFeatures(view({ ownHand: [payoff], ownGigValues: [3, 3] }), "p1");
    const unpaired = extractBoardFeatures(view({ ownHand: [payoff], ownGigValues: [3, 5] }), "p1");

    expect(paired.gigSetup).toBeGreaterThan(unpaired.gigSetup);
    expect(unpaired.gigSetup).toBe(0);
  });

  test("keeps mixed Gig conditions when their public condition is satisfied", () => {
    const payoff = card("mixed-payoff", 6, {
      zone: "hand",
      abilityHints: [
        {
          abilityIndex: 0,
          timing: "play",
          event: null,
          reactive: false,
          effects: ["draw"],
          conditions: ["hasGigPair", "hasEquippedUnitsOrLegends", "cardName"],
          conditionThresholds: [],
          requiredHostNames: ["mixed-payoff"],
          roles: ["cardAdvantage"],
          requirements: [],
        },
      ],
    });
    const equipped = card("equipped", 3, { attachedGearIds: ["gear"] });

    expect(
      extractBoardFeatures(
        view({ ownHand: [payoff], ownField: [equipped], ownGigValues: [3, 3] }),
        "p1",
      ).gigSetup,
    ).toBeGreaterThan(0);
    expect(
      extractBoardFeatures(view({ ownHand: [payoff], ownGigValues: [3, 3] }), "p1").gigSetup,
    ).toBe(0);
  });

  test("does not value a Gig payoff whose public target requirement is unmet", () => {
    const payoff = card("rival-gig-payoff", 6, {
      zone: "hand",
      abilityHints: [
        {
          abilityIndex: 0,
          timing: "play",
          event: null,
          reactive: false,
          effects: ["stealGig"],
          conditions: ["hasGigPair"],
          conditionThresholds: [],
          requiredHostNames: [],
          roles: ["gigPressure"],
          requirements: ["rivalGig"],
        },
      ],
    });

    expect(
      extractBoardFeatures(view({ ownHand: [payoff], ownGigValues: [3, 3] }), "p1").gigSetup,
    ).toBe(0);
    expect(
      extractBoardFeatures(
        view({ ownHand: [payoff], ownGigValues: [3, 3], rivalGigValues: [2] }),
        "p1",
      ).gigSetup,
    ).toBeGreaterThan(0);
  });

  test("values a Gig payoff that targets a friendly face-down Legend", () => {
    const payoff = card("chrome-reverie", 0, {
      zone: "hand",
      type: "program",
      abilityHints: [
        {
          abilityIndex: 0,
          timing: "play",
          event: null,
          reactive: false,
          effects: ["callLegend", "grantRule"],
          conditions: ["hasMinGig"],
          conditionThresholds: [],
          requiredHostNames: [],
          roles: ["combat", "development"],
          requirements: ["friendlyFaceDownLegend", "rivalBoard"],
        },
      ],
    });
    const faceDownLegend = card("legend", 0, {
      zone: "legendArea",
      type: "legend",
      faceDown: true,
    });
    const rivalUnit = card("rival", 3);

    expect(
      extractBoardFeatures(
        view({
          ownHand: [payoff],
          ownField: [],
          rivalField: [rivalUnit],
          ownGigValues: [1],
        }),
        "p1",
      ).gigSetup,
    ).toBe(0);
    expect(
      extractBoardFeatures(
        view({
          ownHand: [payoff],
          ownField: [],
          rivalField: [rivalUnit],
          ownGigValues: [1],
          ownLegendArea: [faceDownLegend],
        }),
        "p1",
      ).gigSetup,
    ).toBeGreaterThan(0);
  });
});
