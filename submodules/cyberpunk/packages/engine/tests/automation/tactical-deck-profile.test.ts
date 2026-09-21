import { describe, expect, test } from "vite-plus/test";

const argString = (args: Record<string, unknown> | undefined, key: string): string => {
  const value = args?.[key];
  return typeof value === "string" ? value : "";
};
import {
  embracingPowerRetailStarterDeckGoroTakemuraHandsUnclean,
  theHeistRetailStarterDeckViktorVektorSitDownAndRelax,
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailHanakoArasakaInAGildedCage,
  welcomeToNightCityRetailOverwatchPanamSGift,
  welcomeToNightCityRetailRiotShield,
  welcomeToNightCityRetailSandevistan,
  welcomeToNightCityRetailTheRelicExperimentalBiochip,
  welcomeToNightCityRetailJudyAlvarezNothingToDoubt,
  welcomeToNightCityRetailKerryEurodyneTheLastRockerboy,
  welcomeToNightCityRetailMantisBlades,
  welcomeToNightCityRetailSwordwiseHuscle,
} from "@tcg/cyberpunk-cards";
import {
  buildDecisionContext,
  greedyStrategy,
  isTacticalAIStrategy,
  tacticalStrategy,
  withDeckProfile,
} from "../../src/automation/index.ts";
import type { DeckStrategyProfile } from "../../src/automation/deck-profile.ts";
import type { DecisionContext } from "../../src/automation/types.ts";
import type { AvailableMove } from "../../src/view/player-prompt.ts";
import type { FilteredCardView } from "../../src/view/filter.ts";
import type { PlayerId } from "../../src/types/branded.ts";
import { CyberpunkTestEngine, P1 } from "../../src/testing/index.ts";

type CardShape = Partial<
  Pick<FilteredCardView, "cardName" | "cost" | "type" | "power" | "hasSellTag" | "zone">
> & { id: string };

function makeCard(shape: CardShape): FilteredCardView {
  return {
    instanceId: shape.id,
    definitionId: `def-${shape.id}`,
    cardName: shape.cardName ?? shape.id,
    zone: shape.zone ?? "hand",
    faceDown: false,
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
    keywords: [],
    triggerHints: [],
    abilityHints: [],
  };
}

function makeCtx(availableMoves: AvailableMove[], cards: FilteredCardView[]): DecisionContext {
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
          gigCount: 0,
          fixerCount: 6,
          streetCred: 0,
        },
        p2: {
          zones: { hand: [], field: [] },
          eddies: 0,
          availableEddies: 0,
          gigCount: 0,
          fixerCount: 6,
          streetCred: 0,
        },
      },
    } as unknown as DecisionContext["view"],
    playerId: "p1" as PlayerId,
    prompt: { status: "action", availableMoves, choice: null },
    rng: () => 0,
  };
}

function relicProfile(overrides: Partial<DeckStrategyProfile> = {}): DeckStrategyProfile {
  return {
    deckId: "authored-relic-placide-surgical-reanimation",
    plan: "Relic a cheap Unit, then reanimate Placide.",
    coreCards: ["The Relic", "The Heist", "Live with the Aftermath"],
    gearHosts: { "The Relic": ["Secondhand Bombus", "Viktor Vektor"] },
    gearHostTypes: { "The Relic": "unit" },
    mulligan: {
      cheapUnitCost: 3,
      minCheapUnits: 1,
      minSellable: 1,
      congestionNames: ["Placide"],
      congestionMinCopies: 2,
    },
    ...overrides,
  };
}

describe("tactical deck profiles", () => {
  test("binds a profile onto tactical without renaming it or mutating the original", () => {
    const profile = relicProfile();
    const bound = withDeckProfile(tacticalStrategy, profile);
    expect(isTacticalAIStrategy(bound)).toBe(true);
    expect(bound.name).toBe("tactical");
    if (!isTacticalAIStrategy(bound)) return;
    expect(bound.deckProfile).toBe(profile);
    expect(isTacticalAIStrategy(tacticalStrategy) && tacticalStrategy.deckProfile).toBeUndefined();
  });

  test("without an engine, profiled tactical uses greedy fallback to Relic a Bombus", () => {
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
    ];
    const move: AvailableMove = {
      moveId: "playCard",
      inputSpec: {
        type: "playCard",
        candidates: [{ cardId: "relic", attachTargets: ["hanako", "bombus"] }],
      },
    };
    const bound = withDeckProfile(tacticalStrategy, relicProfile());
    const decision = bound.decideAction(makeCtx([move], cards));
    expect(decision.kind === "command" && decision.args?.attachToId).toBe("bombus");

    const unbound = tacticalStrategy.decideAction(makeCtx([move], cards));
    expect(unbound.kind === "command" && unbound.args?.attachToId).toBe("hanako");
  });

  test("profiled tactical mulligans a two-Placide opening with no cheap Unit", () => {
    const hand = [
      makeCard({ id: "p1", cardName: "Placide", cost: 8, type: "unit" }),
      makeCard({ id: "p2", cardName: "Placide", cost: 8, type: "unit" }),
      makeCard({ id: "g1", cost: 5, type: "gear", hasSellTag: true }),
      makeCard({ id: "g2", cost: 4, type: "gear", hasSellTag: true }),
      makeCard({ id: "pr1", cost: 1, type: "program", hasSellTag: true }),
      makeCard({ id: "pr2", cost: 1, type: "program", hasSellTag: true }),
    ];
    const ctx = makeCtx(
      [
        { moveId: "mulligan", inputSpec: { type: "none" } },
        { moveId: "keepHand", inputSpec: { type: "none" } },
      ],
      hand,
    );
    const bound = withDeckProfile(tacticalStrategy, relicProfile());
    const decision = bound.decideAction(ctx);
    expect(decision.kind === "command" && decision.move).toBe("mulligan");

    const unbound = greedyStrategy.decideAction(ctx);
    expect(unbound.kind === "command" && unbound.move).toBe("keepHand");
  });

  test("Overwatch Control does not put Sandevistan on Corpo when a face-up Legend is legal", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailSandevistan],
      field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: false, hasLag: false }],
      legendArea: [{ card: theHeistRetailStarterDeckViktorVektorSitDownAndRelax, faceDown: false }],
      eddies: 5,
      deck: [
        welcomeToNightCityRetailCorpoSecurity,
        welcomeToNightCityRetailCorpoSecurity,
        welcomeToNightCityRetailCorpoSecurity,
        welcomeToNightCityRetailCorpoSecurity,
        welcomeToNightCityRetailCorpoSecurity,
      ],
    });
    const profile: DeckStrategyProfile = {
      deckId: "authored-overwatch-recharge-control",
      plan: "Sandevistan and Overwatch on a face-up Legend.",
      coreCards: ["Sandevistan", "Overwatch"],
      gearHosts: { Sandevistan: ["Viktor Vektor"] },
      gearHostTypes: { Sandevistan: "legend" },
    };
    const ctx = buildDecisionContext(engine.getLocalEngine(), P1, () => 0.5);
    const play = ctx.prompt.availableMoves.find((move) => move.moveId === "playCard");
    expect(play?.inputSpec.type).toBe("playCard");
    if (play?.inputSpec.type !== "playCard") return;
    const sandevistan = play.inputSpec.candidates[0];
    expect(sandevistan?.attachTargets?.length).toBeGreaterThan(1);

    const bound = withDeckProfile(tacticalStrategy, profile);
    const decision = bound.decideAction(ctx);
    expect(decision.kind).toBe("command");
    if (decision.kind !== "command") return;
    expect(decision.move).toBe("playCard");
    const attachToId = argString(decision.args, "attachToId");
    const legends = ctx.view.players[P1 as string]?.zones.legendArea;
    const legendIds = Array.isArray(legends) ? legends.map((card) => card.instanceId) : [];
    expect(legendIds).toContain(attachToId);
    const attached = Array.isArray(legends)
      ? legends.find((card) => card.instanceId === attachToId)
      : undefined;
    expect(attached?.cardName).toBe("Viktor Vektor");
    expect(attached?.type).toBe("legend");

    const unbound = tacticalStrategy.decideAction(ctx);
    expect(unbound.kind).toBe("command");
    if (unbound.kind !== "command") return;
    expect(unbound.move).toBe("playCard");
    const unboundHostId = argString(unbound.args, "attachToId");
    const field = ctx.view.players[P1 as string]?.zones.field;
    const fieldIds = Array.isArray(field) ? field.map((card) => card.instanceId) : [];
    expect(fieldIds).toContain(unboundHostId);
  });

  test("Overwatch Control does not Go Solo Goro while he is the rifle carrier", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailSandevistan],
      field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: false, hasLag: false }],
      legendArea: [
        { card: embracingPowerRetailStarterDeckGoroTakemuraHandsUnclean, faceDown: false },
      ],
      eddies: 5,
      gigArea: [2],
      deck: [
        welcomeToNightCityRetailCorpoSecurity,
        welcomeToNightCityRetailCorpoSecurity,
        welcomeToNightCityRetailCorpoSecurity,
        welcomeToNightCityRetailCorpoSecurity,
        welcomeToNightCityRetailCorpoSecurity,
      ],
    });
    const profile: DeckStrategyProfile = {
      deckId: "authored-overwatch-recharge-control",
      plan: "Keep Goro as a Legend carrier for Overwatch/Sandevistan.",
      coreCards: ["Sandevistan", "Overwatch"],
      gearHosts: { Sandevistan: ["Goro Takemura"] },
      gearHostTypes: { Sandevistan: "legend" },
    };
    const ctx = buildDecisionContext(engine.getLocalEngine(), P1, () => 0.5);
    expect(ctx.prompt.availableMoves.some((move) => move.moveId === "goSolo")).toBe(true);

    const bound = withDeckProfile(tacticalStrategy, profile);
    const decision = bound.decideAction(ctx);
    expect(decision.kind).toBe("command");
    if (decision.kind !== "command") return;
    expect(decision.move).not.toBe("goSolo");
    expect(decision.move).toBe("playCard");
    const legends = ctx.view.players[P1 as string]?.zones.legendArea;
    const legendIds = Array.isArray(legends) ? legends.map((card) => card.instanceId) : [];
    expect(legendIds).toContain(argString(decision.args, "attachToId"));

    const unbound = tacticalStrategy.decideAction(ctx);
    expect(unbound.kind === "command" && unbound.move).toBe("goSolo");
  });

  test("Overwatch Control does not sell the rifle while Afterparty is sellable", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [
        welcomeToNightCityRetailOverwatchPanamSGift,
        welcomeToNightCityRetailRiotShield,
        welcomeToNightCityRetailCorpoSecurity,
      ],
      field: [],
      legendArea: [{ card: theHeistRetailStarterDeckViktorVektorSitDownAndRelax, faceDown: false }],
      eddies: 0,
      deck: [
        welcomeToNightCityRetailCorpoSecurity,
        welcomeToNightCityRetailCorpoSecurity,
        welcomeToNightCityRetailCorpoSecurity,
        welcomeToNightCityRetailCorpoSecurity,
        welcomeToNightCityRetailCorpoSecurity,
      ],
    });
    const profile: DeckStrategyProfile = {
      deckId: "authored-overwatch-recharge-control",
      plan: "Do not sell the rifle while a cheap Program can pay.",
      coreCards: ["Overwatch"],
      gearHosts: { Overwatch: ["Viktor Vektor"] },
      gearHostTypes: { Overwatch: "legend" },
    };
    const ctx = buildDecisionContext(engine.getLocalEngine(), P1, () => 0.5);
    const sell = ctx.prompt.availableMoves.find((move) => move.moveId === "sellCard");
    expect(sell?.inputSpec.type).toBe("selectCard");
    if (sell?.inputSpec.type !== "selectCard") return;
    expect(sell.inputSpec.candidates.length).toBeGreaterThan(1);

    const bound = withDeckProfile(tacticalStrategy, profile);
    const decision = bound.decideAction(ctx);
    expect(decision.kind).toBe("command");
    if (decision.kind !== "command") return;
    const soldName = (decision: { args?: Record<string, unknown> }) => {
      const soldId = argString(decision.args, "cardId");
      const hand = ctx.view.players[P1 as string]?.zones.hand;
      return Array.isArray(hand)
        ? hand.find((card) => card.instanceId === soldId)?.cardName
        : undefined;
    };
    if (decision.move === "sellCard") {
      expect(soldName(decision)).not.toBe("Overwatch");
    }

    const unbound = tacticalStrategy.decideAction(ctx);
    expect(unbound.kind).toBe("command");
    if (unbound.kind !== "command") return;
    if (unbound.move === "sellCard") {
      expect(soldName(unbound)).toBe("Overwatch");
    }
  });

  test("Overwatch Control refuses to sell the only Overwatch even if it is the sole sale", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailOverwatchPanamSGift, welcomeToNightCityRetailCorpoSecurity],
      field: [],
      legendArea: [{ card: theHeistRetailStarterDeckViktorVektorSitDownAndRelax, faceDown: false }],
      eddies: 0,
      deck: [
        welcomeToNightCityRetailCorpoSecurity,
        welcomeToNightCityRetailCorpoSecurity,
        welcomeToNightCityRetailCorpoSecurity,
        welcomeToNightCityRetailCorpoSecurity,
        welcomeToNightCityRetailCorpoSecurity,
      ],
    });
    const profile: DeckStrategyProfile = {
      deckId: "authored-overwatch-recharge-control",
      plan: "Keep the first Overwatch.",
      coreCards: ["Overwatch"],
    };
    const ctx = buildDecisionContext(engine.getLocalEngine(), P1, () => 0.5);
    const bound = withDeckProfile(tacticalStrategy, profile);
    const decision = bound.decideAction(ctx);
    expect(decision.kind).toBe("command");
    if (decision.kind !== "command") return;
    expect(decision.move).not.toBe("sellCard");
  });

  test("Relic attaches to a Unit, not a same-named Legend, when any Unit is legal", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailTheRelicExperimentalBiochip],
      field: [
        { card: welcomeToNightCityRetailHanakoArasakaInAGildedCage, spent: false, hasLag: false },
      ],
      legendArea: [{ card: theHeistRetailStarterDeckViktorVektorSitDownAndRelax, faceDown: false }],
      eddies: 6,
      deck: [
        welcomeToNightCityRetailCorpoSecurity,
        welcomeToNightCityRetailCorpoSecurity,
        welcomeToNightCityRetailCorpoSecurity,
        welcomeToNightCityRetailCorpoSecurity,
        welcomeToNightCityRetailCorpoSecurity,
      ],
    });
    const profile: DeckStrategyProfile = {
      deckId: "authored-relic-placide-surgical-reanimation",
      plan: "Relic a cheap Unit, not the Legend.",
      coreCards: ["The Relic"],
      gearHosts: { "The Relic": ["Secondhand Bombus", "Viktor Vektor"] },
      gearHostTypes: { "The Relic": "unit" },
    };
    const ctx = buildDecisionContext(engine.getLocalEngine(), P1, () => 0.5);
    const bound = withDeckProfile(tacticalStrategy, profile);
    const decision = bound.decideAction(ctx);
    expect(decision.kind).toBe("command");
    if (decision.kind !== "command") return;
    expect(decision.move).toBe("playCard");
    const hostId = argString(decision.args, "attachToId");
    const field = ctx.view.players[P1 as string]?.zones.field;
    const host = Array.isArray(field)
      ? field.find((card) => card.instanceId === hostId)
      : undefined;
    expect(host?.type).toBe("unit");
  });

  test("Judy profile spends Nothing to Doubt instead of attacking when the Spend is legal", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          {
            card: welcomeToNightCityRetailJudyAlvarezNothingToDoubt,
            spent: false,
            hasLag: false,
          },
        ],
        eddies: 2,
        deck: [
          welcomeToNightCityRetailCorpoSecurity,
          welcomeToNightCityRetailCorpoSecurity,
          welcomeToNightCityRetailCorpoSecurity,
          welcomeToNightCityRetailCorpoSecurity,
          welcomeToNightCityRetailCorpoSecurity,
        ],
      },
      { gigArea: [{ dieType: "d6", faceValue: 2 }] },
    );
    const profile: DeckStrategyProfile = {
      deckId: "authored-judy-top-deck-discount",
      plan: "Spend Nothing to Doubt before attacking.",
      coreCards: ["Judy Álvarez"],
      preferSpendOverAttack: ["Judy Álvarez"],
    };
    const ctx = buildDecisionContext(engine.getLocalEngine(), P1, () => 0.5);
    expect(ctx.prompt.availableMoves.some((move) => move.moveId === "activateAbility")).toBe(true);
    expect(ctx.prompt.availableMoves.some((move) => move.moveId === "attackRival")).toBe(true);

    const unbound = tacticalStrategy.decideAction(ctx);
    expect(unbound.kind === "command" && unbound.move).toBe("attackRival");

    const bound = withDeckProfile(tacticalStrategy, profile);
    const decision = bound.decideAction(ctx);
    expect(decision.kind).toBe("command");
    if (decision.kind !== "command") return;
    expect(decision.move).toBe("activateAbility");
  });

  test("Judy profile spends Nothing to Doubt before playing another body", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailCorpoSecurity],
        field: [
          {
            card: welcomeToNightCityRetailJudyAlvarezNothingToDoubt,
            spent: false,
            hasLag: false,
          },
        ],
        eddies: 6,
        deck: [
          welcomeToNightCityRetailCorpoSecurity,
          welcomeToNightCityRetailCorpoSecurity,
          welcomeToNightCityRetailCorpoSecurity,
          welcomeToNightCityRetailCorpoSecurity,
          welcomeToNightCityRetailCorpoSecurity,
        ],
      },
      { gigArea: [{ dieType: "d6", faceValue: 2 }] },
    );
    const profile: DeckStrategyProfile = {
      deckId: "authored-judy-top-deck-discount",
      plan: "Spend Nothing to Doubt before developing.",
      coreCards: ["Judy Álvarez"],
      preferSpendOverAttack: ["Judy Álvarez"],
    };
    const ctx = buildDecisionContext(engine.getLocalEngine(), P1, () => 0.5);
    const bound = withDeckProfile(tacticalStrategy, profile);
    const decision = bound.decideAction(ctx);
    expect(decision.kind).toBe("command");
    if (decision.kind !== "command") return;
    expect(decision.move).toBe("activateAbility");
  });

  test("RYG value puts Mantis on Huscle when Kerry is also a legal host", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailMantisBlades],
      field: [
        { card: welcomeToNightCityRetailSwordwiseHuscle, spent: false, hasLag: false },
        {
          card: welcomeToNightCityRetailKerryEurodyneTheLastRockerboy,
          spent: false,
          hasLag: false,
        },
      ],
      eddies: 2,
      deck: [
        welcomeToNightCityRetailCorpoSecurity,
        welcomeToNightCityRetailCorpoSecurity,
        welcomeToNightCityRetailCorpoSecurity,
        welcomeToNightCityRetailCorpoSecurity,
        welcomeToNightCityRetailCorpoSecurity,
      ],
    });
    const profile: DeckStrategyProfile = {
      deckId: "authored-ryg-low-cost-value",
      plan: "Huscle plus Mantis is the opening rate.",
      coreCards: ["Swordwise Huscle", "Mantis Blades", "Kerry Eurodyne"],
      gearHosts: { "Mantis Blades": ["Swordwise Huscle"] },
      gearHostTypes: { "Mantis Blades": "unit" },
    };
    const ctx = buildDecisionContext(engine.getLocalEngine(), P1, () => 0.5);
    const bound = withDeckProfile(tacticalStrategy, profile);
    const decision = bound.decideAction(ctx);
    expect(decision.kind).toBe("command");
    if (decision.kind !== "command") return;
    expect(decision.move).toBe("playCard");
    const hostId = argString(decision.args, "attachToId");
    const field = ctx.view.players[P1 as string]?.zones.field;
    const host = Array.isArray(field)
      ? field.find((card) => card.instanceId === hostId)
      : undefined;
    expect(host?.cardName).toBe("Swordwise Huscle");
  });
});
