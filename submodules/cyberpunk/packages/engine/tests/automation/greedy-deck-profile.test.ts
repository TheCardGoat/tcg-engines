import { describe, expect, test } from "vite-plus/test";
import {
  createGreedyStrategy,
  DEFAULT_GREEDY_WEIGHTS,
  firstLegalStrategy,
  greedyStrategy,
  isGreedyAIStrategy,
  withDeckProfile,
} from "../../src/automation/index.ts";
import { shouldMulligan } from "../../src/automation/strategies/greedy.ts";
import type { DeckStrategyProfile } from "../../src/automation/deck-profile.ts";
import type { DecisionContext } from "../../src/automation/types.ts";
import type { AvailableMove } from "../../src/view/player-prompt.ts";
import type { FilteredCardView } from "../../src/view/filter.ts";
import type { PlayerId } from "../../src/types/branded.ts";

type CardShape = Partial<
  Pick<
    FilteredCardView,
    "cardName" | "cost" | "type" | "power" | "hasSellTag" | "zone" | "keywords"
  >
> & { id: string };

function makeCard(shape: CardShape): FilteredCardView {
  return {
    instanceId: shape.id,
    definitionId: `def-${shape.id}`,
    cardName: shape.cardName ?? shape.id,
    zone: shape.zone ?? "hand",
    faceDown: shape.cardName === null,
    revealed: false,
    spent: false,
    damage: 0,
    power: shape.power ?? 0,
    effectivePower: shape.power ?? 0,
    cost: shape.cost ?? 0,
    type: shape.type ?? "unit",
    classifications: [],
    hasSellTag: shape.hasSellTag ?? false,
    attachedGearIds: [],
    attachedToId: null,
    hasLag: false,
    hasAttackedThisTurn: false,
    grantedRules: [],
    keywords: shape.keywords ?? [],
    triggerHints: [],
    abilityHints: [],
  };
}

function makeCtx(
  availableMoves: AvailableMove[],
  cards: FilteredCardView[],
  opts: {
    p1GigCount?: number;
    p2GigCount?: number;
    attackState?: DecisionContext["view"]["attackState"];
  } = {},
): DecisionContext {
  return {
    view: {
      players: {
        p1: {
          zones: {
            hand: cards.filter((c) => c.zone === "hand"),
            field: cards.filter((c) => c.zone === "field"),
          },
          eddies: 0,
          availableEddies: 0,
          gigCount: opts.p1GigCount ?? 0,
          fixerCount: 6,
          streetCred: 0,
        },
        p2: {
          zones: { hand: [], field: [] },
          eddies: 0,
          availableEddies: 0,
          gigCount: opts.p2GigCount ?? 0,
          fixerCount: 6,
          streetCred: 0,
        },
      },
      attackState: opts.attackState,
    } as unknown as DecisionContext["view"],
    playerId: "p1" as PlayerId,
    prompt: { status: "action", availableMoves, choice: null },
    rng: () => 0,
  };
}

const HAND_ONLY: AvailableMove[] = [];

function controlProfile(overrides: Partial<DeckStrategyProfile> = {}): DeckStrategyProfile {
  return {
    deckId: "test-control",
    plan: "Build the engine, then pressure.",
    coreCards: ["Core Engine"],
    gearHosts: { Overwatch: ["Panam"] },
    weights: { defaultPriority: { playCard: 10, callLegend: 9, attackRival: 8, attackUnit: 7 } },
    ...overrides,
  };
}

describe("greedy deck profiles — withDeckProfile", () => {
  test("binds a profile onto a greedy strategy without mutating the original", () => {
    const profile = controlProfile();
    const base = createGreedyStrategy(DEFAULT_GREEDY_WEIGHTS, "greedy");
    const bound = withDeckProfile(base, profile);

    expect(isGreedyAIStrategy(bound)).toBe(true);
    expect(bound.name).toBe("greedy");
    if (!isGreedyAIStrategy(bound)) return;
    expect(bound.deckProfile).toBe(profile);
    expect(bound.greedyWeights).toEqual(DEFAULT_GREEDY_WEIGHTS);
    if (!isGreedyAIStrategy(base)) return;
    expect(base.deckProfile).toBeUndefined();
    expect(base).not.toBe(bound);
  });

  test("greedyStrategy is greedy-family; other strategies pass through untouched", () => {
    expect(isGreedyAIStrategy(greedyStrategy)).toBe(true);
    expect(withDeckProfile(firstLegalStrategy, controlProfile())).toBe(firstLegalStrategy);
  });

  test("rebinding replaces the previous profile instead of layering it", () => {
    const first = controlProfile();
    const second = controlProfile({ weights: undefined });
    const once = withDeckProfile(greedyStrategy, first);
    const twice = withDeckProfile(once, second);
    if (!isGreedyAIStrategy(twice)) return expect.fail("twice should be greedy-family");
    expect(twice.deckProfile).toBe(second);
    expect(twice.greedyWeights).toEqual(DEFAULT_GREEDY_WEIGHTS);
  });
});

describe("greedy deck profiles — pacing weights", () => {
  function playAndAttackCtx(): DecisionContext {
    return makeCtx(
      [
        { moveId: "attackRival", inputSpec: { type: "selectCard", candidates: ["a1"] } },
        { moveId: "playCard", inputSpec: { type: "playCard", candidates: [{ cardId: "c1" }] } },
        { moveId: "passPhase", inputSpec: { type: "none" } },
      ],
      [
        makeCard({ id: "c1", type: "program", cost: 1 }),
        makeCard({ id: "a1", type: "unit", power: 3, zone: "field" }),
      ],
      { p2GigCount: 1 },
    );
  }

  test("unbound greedy attacks before playing", () => {
    const decision = greedyStrategy.decideAction(playAndAttackCtx());
    expect(decision.kind === "command" && decision.move).toBe("attackRival");
  });

  test("develop-first profile plays the engine before attacking", () => {
    const decision = withDeckProfile(greedyStrategy, controlProfile()).decideAction(
      playAndAttackCtx(),
    );
    expect(decision.kind === "command" && decision.move).toBe("playCard");
  });
});

describe("greedy deck profiles — mulligan", () => {
  test("generic behavior is unchanged without a profile", () => {
    const hand = [
      makeCard({ id: "cheap-1", cost: 1, hasSellTag: true, type: "program" }),
      makeCard({ id: "cheap-2", cost: 2, hasSellTag: true, type: "program" }),
      makeCard({ id: "expensive-1", cost: 6, type: "unit" }),
      makeCard({ id: "expensive-2", cost: 7, type: "unit" }),
      makeCard({ id: "expensive-3", cost: 5, type: "gear" }),
      makeCard({ id: "expensive-4", cost: 4, type: "gear" }),
    ];
    expect(shouldMulligan(makeCtx(HAND_ONLY, hand))).toBe(false);
  });

  test("profile counts cheap Units only, so a Programs-only hand bricks", () => {
    const profile = controlProfile({
      mulligan: { cheapUnitCost: 3, minCheapUnits: 1, minSellable: 1 },
    });
    const programsOnly = [
      makeCard({ id: "p1", cost: 1, hasSellTag: true, type: "program" }),
      makeCard({ id: "p2", cost: 1, hasSellTag: true, type: "program" }),
      makeCard({ id: "p3", cost: 2, hasSellTag: true, type: "program" }),
      makeCard({ id: "g1", cost: 4, hasSellTag: true, type: "gear" }),
      makeCard({ id: "g2", cost: 5, hasSellTag: true, type: "gear" }),
      makeCard({ id: "g3", cost: 4, hasSellTag: true, type: "gear" }),
    ];
    expect(shouldMulligan(makeCtx(HAND_ONLY, programsOnly), DEFAULT_GREEDY_WEIGHTS, profile)).toBe(
      true,
    );

    const withCheapUnit = [
      ...programsOnly.slice(2),
      makeCard({ id: "u1", cost: 3, type: "unit" }),
      makeCard({ id: "u2", cost: 6, type: "unit" }),
    ];
    expect(shouldMulligan(makeCtx(HAND_ONLY, withCheapUnit), DEFAULT_GREEDY_WEIGHTS, profile)).toBe(
      false,
    );
  });

  test("an engine piece relieves one curve slot", () => {
    const profile = controlProfile({
      mulligan: {
        cheapUnitCost: 3,
        minCheapUnits: 1,
        minSellable: 1,
        engineNames: ["Draw Engine"],
        engineRelief: 1,
      },
    });
    const engineHand = [
      makeCard({ id: "engine", cardName: "Draw Engine", cost: 4, type: "gear", hasSellTag: true }),
      makeCard({ id: "sell-1", cost: 1, hasSellTag: true, type: "program" }),
      makeCard({ id: "sell-2", cost: 1, hasSellTag: true, type: "program" }),
      makeCard({ id: "big-1", cost: 6, type: "unit" }),
      makeCard({ id: "big-2", cost: 7, type: "unit" }),
      makeCard({ id: "big-3", cost: 5, type: "unit" }),
    ];
    expect(shouldMulligan(makeCtx(HAND_ONLY, engineHand), DEFAULT_GREEDY_WEIGHTS, profile)).toBe(
      false,
    );

    const engineless = engineHand.map((card) =>
      card.instanceId === "engine" ? makeCard({ id: "big-4", cost: 6, type: "unit" }) : card,
    );
    expect(shouldMulligan(makeCtx(HAND_ONLY, engineless), DEFAULT_GREEDY_WEIGHTS, profile)).toBe(
      true,
    );
  });

  test("congestion veto bounces hands stacked with expensive payoffs", () => {
    const profile = controlProfile({
      mulligan: {
        cheapUnitCost: 3,
        minCheapUnits: 1,
        minSellable: 1,
        congestionNames: ["Big Finisher"],
        congestionMinCopies: 2,
      },
    });
    const congested = [
      makeCard({ id: "u1", cost: 2, type: "unit" }),
      makeCard({ id: "sell-1", cost: 1, hasSellTag: true, type: "program" }),
      makeCard({ id: "finisher-a", cardName: "Big Finisher", cost: 9, type: "unit" }),
      makeCard({ id: "finisher-b", cardName: "Big Finisher", cost: 9, type: "unit" }),
      makeCard({ id: "mid-1", cost: 4, type: "unit" }),
      makeCard({ id: "mid-2", cost: 4, type: "gear" }),
    ];
    expect(shouldMulligan(makeCtx(HAND_ONLY, congested), DEFAULT_GREEDY_WEIGHTS, profile)).toBe(
      true,
    );

    const single = congested.filter((c) => c.instanceId !== "finisher-b");
    expect(shouldMulligan(makeCtx(HAND_ONLY, single), DEFAULT_GREEDY_WEIGHTS, profile)).toBe(false);
  });
});

describe("greedy deck profiles — sell protection", () => {
  function sellCtx(candidateIds: string[], cards: FilteredCardView[]): DecisionContext {
    return makeCtx(
      [{ moveId: "sellCard", inputSpec: { type: "selectCard", candidates: candidateIds } }],
      cards,
    );
  }

  test("never volunteers a core card while a non-core sellable exists", () => {
    const cards = [
      makeCard({ id: "core", cardName: "Core Engine", cost: 1, type: "program" }),
      makeCard({ id: "junk", cost: 3, type: "unit", power: 2 }),
    ];
    const bound = withDeckProfile(greedyStrategy, controlProfile());
    const decision = bound.decideAction(sellCtx(["core", "junk"], cards));
    expect(decision.kind === "command" && decision.args?.cardId).toBe("junk");
  });

  test("without a profile the weakest card (the core one) is sold", () => {
    const cards = [
      makeCard({ id: "core", cardName: "Core Engine", cost: 1, type: "program" }),
      makeCard({ id: "junk", cost: 3, type: "unit", power: 2 }),
    ];
    const decision = greedyStrategy.decideAction(sellCtx(["core", "junk"], cards));
    expect(decision.kind === "command" && decision.args?.cardId).toBe("core");
  });

  test("does not sell the first uninstalled core card even if it is the only sale", () => {
    const cards = [makeCard({ id: "core", cardName: "Core Engine", cost: 1, type: "program" })];
    const bound = withDeckProfile(greedyStrategy, controlProfile());
    const decision = bound.decideAction(sellCtx(["core"], cards));
    expect(decision.kind === "command" && decision.args?.cardId).not.toBe("core");
  });

  test("extra core copies may sell once one is already in play", () => {
    const cards = [
      makeCard({ id: "core", cardName: "Core Engine", cost: 1, type: "program", zone: "hand" }),
      makeCard({
        id: "installed",
        cardName: "Core Engine",
        cost: 1,
        type: "program",
        zone: "field",
      }),
    ];
    const bound = withDeckProfile(greedyStrategy, controlProfile());
    const decision = bound.decideAction(sellCtx(["core"], cards));
    expect(decision.kind === "command" && decision.args?.cardId).toBe("core");
  });

  test("among equal-value sellables the cheapest card is sold, not the expensive payoff", () => {
    // Programs with no power/keywords tie in strategic value; the tiebreak
    // must keep the expensive payoff and cash the cheap cantrip.
    const cards = [
      makeCard({ id: "towerfall", cardName: "Towerfall", cost: 6, type: "program" }),
      makeCard({ id: "cantrip", cardName: "Trust No One", cost: 1, type: "program" }),
      makeCard({ id: "song", cardName: "Pyramid Song", cost: 3, type: "program" }),
    ];
    const decision = greedyStrategy.decideAction(sellCtx(["towerfall", "cantrip", "song"], cards));
    expect(decision.kind === "command" && decision.args?.cardId).toBe("cantrip");
  });
});

describe("greedy deck profiles — deny-steal blocking", () => {
  function blockerCtx(): DecisionContext {
    return makeCtx(
      [
        { moveId: "useBlocker", inputSpec: { type: "selectCard", candidates: ["bombus"] } },
        { moveId: "passPhase", inputSpec: { type: "none" } },
      ],
      [
        makeCard({ id: "raider", cardName: "Raider", type: "unit", power: 4, zone: "field" }),
        makeCard({
          id: "bombus",
          cardName: "Bombus",
          type: "unit",
          power: 1,
          zone: "field",
          keywords: ["blocker"],
        }),
      ],
      {
        p1GigCount: 2,
        attackState: {
          attackerId: "raider",
          defenderId: null,
          kind: "direct",
          step: "react",
          redirectedByBlocker: false,
        },
      },
    );
  }

  test("profile trades a chump blocker to deny a 1-Gig direct attack", () => {
    const profile = controlProfile({ blockDirectStealsAtLeast: 1 });
    const decision = withDeckProfile(greedyStrategy, profile).decideAction(blockerCtx());
    expect(decision.kind === "command" && decision.move).toBe("useBlocker");
    expect(decision.kind === "command" && decision.args?.blockerId).toBe("bombus");
  });

  test("without the knob the unurgent 1-Gig attack passes through", () => {
    const decision = greedyStrategy.decideAction(blockerCtx());
    expect(decision.kind === "command" && decision.move).toBe("passPhase");
  });
});

describe("greedy deck profiles — playing and attaching", () => {
  function playCtx(candidates: AvailableMove[], cards: FilteredCardView[]): DecisionContext {
    return makeCtx(candidates, cards);
  }

  test("prefers the core engine card over an otherwise-better comparable card", () => {
    // Core bias is tie-break scale: it flips comparable plays toward the
    // engine but must not outrank real board development (a stronger Unit).
    const cards = [
      makeCard({ id: "core", cardName: "Core Engine", cost: 2, type: "gear", power: 1 }),
      makeCard({ id: "generic", cost: 2, type: "gear", power: 2 }),
    ];
    const move: AvailableMove = {
      moveId: "playCard",
      inputSpec: {
        type: "playCard",
        candidates: [{ cardId: "core" }, { cardId: "generic" }],
      },
    };
    const bound = withDeckProfile(greedyStrategy, controlProfile());
    const decision = bound.decideAction(playCtx([move], cards));
    expect(decision.kind === "command" && decision.args?.cardId).toBe("core");

    const unbound = greedyStrategy.decideAction(playCtx([move], cards));
    expect(unbound.kind === "command" && unbound.args?.cardId).toBe("generic");
  });

  test("core bias never outranks board development", () => {
    const cards = [
      makeCard({ id: "core", cardName: "Core Engine", cost: 1, type: "program" }),
      makeCard({ id: "unit", cost: 3, type: "unit", power: 3 }),
    ];
    const move: AvailableMove = {
      moveId: "playCard",
      inputSpec: {
        type: "playCard",
        candidates: [{ cardId: "core" }, { cardId: "unit" }],
      },
    };
    const bound = withDeckProfile(greedyStrategy, controlProfile());
    const decision = bound.decideAction(playCtx([move], cards));
    expect(decision.kind === "command" && decision.args?.cardId).toBe("unit");
  });

  test("attaches Gear to the profile's preferred host over the strongest board", () => {
    const cards = [
      makeCard({ id: "gear", cardName: "Overwatch", cost: 2, type: "gear", zone: "hand" }),
      makeCard({ id: "panam", cardName: "Panam", cost: 5, type: "unit", power: 4, zone: "field" }),
      makeCard({
        id: "bruiser",
        cardName: "Bruiser",
        cost: 4,
        type: "unit",
        power: 7,
        zone: "field",
      }),
    ];
    const move: AvailableMove = {
      moveId: "playCard",
      inputSpec: {
        type: "playCard",
        candidates: [{ cardId: "gear", attachTargets: ["panam", "bruiser"] }],
      },
    };
    const bound = withDeckProfile(greedyStrategy, controlProfile());
    const decision = bound.decideAction(playCtx([move], cards));
    expect(decision.kind === "command" && decision.args?.attachToId).toBe("panam");

    const unbound = greedyStrategy.decideAction(playCtx([move], cards));
    expect(unbound.kind === "command" && unbound.args?.attachToId).toBe("bruiser");
  });

  test("prefers a Legend host over a Unit that shares the engine-visible name", () => {
    const cards = [
      makeCard({ id: "gear", cardName: "Overwatch", cost: 4, type: "gear", zone: "hand" }),
      makeCard({
        id: "goro-legend",
        cardName: "Goro Takemura",
        cost: 0,
        type: "legend",
        power: 0,
        zone: "field",
      }),
      makeCard({
        id: "goro-unit",
        cardName: "Goro Takemura",
        cost: 6,
        type: "unit",
        power: 9,
        zone: "field",
      }),
    ];
    const move: AvailableMove = {
      moveId: "playCard",
      inputSpec: {
        type: "playCard",
        candidates: [{ cardId: "gear", attachTargets: ["goro-unit", "goro-legend"] }],
      },
    };
    const profile = controlProfile({
      gearHosts: { Overwatch: ["Goro Takemura"] },
      gearHostTypes: { Overwatch: "legend" },
    });
    const bound = withDeckProfile(greedyStrategy, profile);
    const decision = bound.decideAction(playCtx([move], cards));
    expect(decision.kind === "command" && decision.args?.attachToId).toBe("goro-legend");
  });

  test("Relic prefers a cheap Unit host over a stronger Unit and a named Legend", () => {
    const cards = [
      makeCard({ id: "relic", cardName: "The Relic", cost: 5, type: "gear", zone: "hand" }),
      makeCard({
        id: "bombus",
        cardName: "Secondhand Bombus",
        cost: 2,
        type: "unit",
        power: 0,
        zone: "field",
      }),
      makeCard({
        id: "hanako",
        cardName: "Hanako Arasaka",
        cost: 4,
        type: "unit",
        power: 5,
        zone: "field",
      }),
      makeCard({
        id: "viktor-legend",
        cardName: "Viktor Vektor",
        cost: 0,
        type: "legend",
        power: 0,
        zone: "field",
      }),
    ];
    const move: AvailableMove = {
      moveId: "playCard",
      inputSpec: {
        type: "playCard",
        candidates: [{ cardId: "relic", attachTargets: ["hanako", "viktor-legend", "bombus"] }],
      },
    };
    const profile = controlProfile({
      gearHosts: { "The Relic": ["Secondhand Bombus", "Viktor Vektor"] },
      gearHostTypes: { "The Relic": "unit" },
    });
    const bound = withDeckProfile(greedyStrategy, profile);
    const decision = bound.decideAction(playCtx([move], cards));
    expect(decision.kind === "command" && decision.args?.attachToId).toBe("bombus");
  });

  test("falls back to the strongest host when no preferred host is on the board", () => {
    const cards = [
      makeCard({ id: "gear", cardName: "Overwatch", cost: 2, type: "gear", zone: "hand" }),
      makeCard({
        id: "bruiser",
        cardName: "Bruiser",
        cost: 4,
        type: "unit",
        power: 7,
        zone: "field",
      }),
      makeCard({ id: "small", cardName: "Small", cost: 2, type: "unit", power: 2, zone: "field" }),
    ];
    const move: AvailableMove = {
      moveId: "playCard",
      inputSpec: {
        type: "playCard",
        candidates: [{ cardId: "gear", attachTargets: ["small", "bruiser"] }],
      },
    };
    const bound = withDeckProfile(greedyStrategy, controlProfile());
    const decision = bound.decideAction(playCtx([move], cards));
    expect(decision.kind === "command" && decision.args?.attachToId).toBe("bruiser");
  });
});
