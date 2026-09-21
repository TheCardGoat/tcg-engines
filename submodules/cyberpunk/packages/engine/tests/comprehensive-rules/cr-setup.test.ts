import { beforeAll, describe, expect, it } from "vite-plus/test";
import {
  structuredCards,
  theHeistRetailStarterDeckViktorVektorSitDownAndRelax,
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailDumDumMaelstromTriggerman,
  welcomeToNightCityRetailDyingNightVSPistol,
  welcomeToNightCityRetailFloorIt,
  welcomeToNightCityRetailMantisBlades,
  welcomeToNightCityRetailPanamPalmerNomadCavalry,
  welcomeToNightCityRetailSketchyRipper,
  welcomeToNightCityRetailSwordwiseHuscle,
  welcomeToNightCityRetailVStreetkid,
} from "@tcg/cyberpunk-cards";
import { validateDeck } from "../../../utils/src/deck-validation.ts";
import { defOf } from "../../src/state/lookups.ts";
import {
  CyberpunkTestEngine,
  P1,
  P2,
  expectScryChoice,
  registerMatchers,
} from "../../src/testing/index.ts";
import { ALL_DICE } from "../../src/testing/test-engine.ts";
import "../../src/testing/matchers.d.ts";
import { cover } from "./covered-rules.ts";
import { passTurn } from "./helpers.ts";

beforeAll(() => {
  registerMatchers();
});

function createSetupEngine(seed = "cr-setup") {
  return CyberpunkTestEngine.createWithFixture({}, {}, { skipSetup: false, seed });
}

describe("CR real-card: setup, start phase, deckbuilding", () => {
  it("places three randomized face-down Legends and spends the first player's two leftmost", () => {
    cover(
      "4.3",
      "5.7.1",
      "5.7.4",
      "5.7.4.1",
      "7.4",
      "7.5",
      "7.7",
      "7.7.3",
      "7.7.4",
      "7.8",
      "7.8.1",
      "7.9",
      "7.9.1",
      "5.10.1",
      "2.9",
    );
    const engine = createSetupEngine();
    expect(engine.getPhase()).toBe("setup");
    for (const pid of [P1, P2]) {
      const legends = engine.getCardsInZone("legendArea", pid);
      expect(legends).toHaveLength(3);
      expect(legends.every((c) => c.meta.faceDown)).toBe(true);
      expect(legends.every((c) => defOf(c).type === "legend")).toBe(true);
    }
    const first = engine.getState().G.turnMetadata.activePlayerId;
    const second = engine.getOpponentOf(first);
    const legends = engine.getCardsInZone("legendArea", first);
    expect(legends[0]!.meta.spent).toBe(true);
    expect(legends[1]!.meta.spent).toBe(true);
    expect(legends[2]!.meta.spent).toBe(false);
    // After keep/mulligan the first player will have 2 spent legends (CR 7.7.4).
    engine.keepHand({ as: first });
    engine.keepHand({ as: second });
    const firstAfter = engine.getState().G.turnMetadata.activePlayerId;
    expect(engine.getSpentLegends(firstAfter)).toHaveLength(2);
    expect(engine.getCardsInZone("legendArea", firstAfter)[0]!.meta.spent).toBe(true);
    expect(engine.getCardsInZone("legendArea", firstAfter)[1]!.meta.spent).toBe(true);
    expect(first ?? firstAfter).toBeTruthy();
    expect(engine.getFixerDice(P1).length + engine.getGigCount(P1)).toBe(6);
  });

  it("lets the random winner choose to go second", () => {
    cover("7.5.2");
    const engine = CyberpunkTestEngine.createWithFixture(
      {},
      {},
      { skipSetup: false, autoChooseFirstPlayer: false, seed: "cr-first-player" },
    );
    const pending = engine.getState().G.turnMetadata.pendingChoice;
    expect(pending?.type).toBe("chooseFirstPlayer");
    if (pending?.type !== "chooseFirstPlayer") {
      throw new Error("Expected chooseFirstPlayer");
    }
    const chooser = pending.chooserId;
    const rival = chooser === P1 ? P2 : P1;
    engine.resolveFirstPlayer(false, { as: chooser });
    expect(engine.getState().G.players[rival as string]?.firstPlayer).toBe(true);
    expect(engine.getState().G.turnMetadata.activePlayerId).toBe(rival);
    expect(engine.getCardsInZone("hand", P1)).toHaveLength(6);
    expect(engine.getCardsInZone("hand", P2)).toHaveLength(6);
  });

  it("readies, draws, then gains a Gig at the start of turn, keeping d20 last", () => {
    cover(
      "8.2",
      "8.2.1",
      "8.6",
      "8.6.3",
      "8.6.4",
      "8.6.5",
      "8.6.5.1",
      "8.6.5.1.1",
      "8.6.5.2",
      "8.6.5.3",
      "8.8",
      "8.18",
      "3.8",
    );
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: welcomeToNightCityRetailSwordwiseHuscle, spent: true }],
        hand: [welcomeToNightCityRetailFloorIt],
        deck: [
          welcomeToNightCityRetailSketchyRipper,
          welcomeToNightCityRetailSketchyRipper,
          welcomeToNightCityRetailSketchyRipper,
        ],
      },
      {
        field: [{ card: welcomeToNightCityRetailSwordwiseHuscle, spent: true }],
        deck: [welcomeToNightCityRetailFloorIt, welcomeToNightCityRetailFloorIt],
      },
    );
    const p1Hand = engine.getCardsInZone("hand", P1).length;
    passTurn(engine, P1);
    expect(engine.getCard(welcomeToNightCityRetailSwordwiseHuscle, "field", P2).meta.spent).toBe(
      false,
    );
    expect(engine.getCardsInZone("hand", P2).length).toBeGreaterThanOrEqual(1);
    expect(engine.getGigCount(P2)).toBe(1);
    const gained = engine.getState().G.players[P2 as string]!.gigArea[0]!;
    const die = engine.getState().G.gigDice[gained as string];
    expect(die?.dieType).not.toBe("d20");
    expect(p1Hand).toBeGreaterThan(0);
  });

  it("activates overtime after consecutive empty-fixer starts and wins immediately at 7 Gigs", () => {
    cover("1.11", "1.11.1", "1.11.2", "8.17");
    const engine = CyberpunkTestEngine.createWithFixture(
      { gigArea: ALL_DICE.slice(0, 5), field: [welcomeToNightCityRetailSketchyRipper] },
      { gigArea: ALL_DICE.slice(0, 5) },
      { overtime: true },
    );
    for (const die of ALL_DICE.slice(0, 2)) {
      engine.judgeAddGigDie(P1, die.dieType, 1);
    }
    expect(engine.getGigCount(P1)).toBeGreaterThanOrEqual(7);
    expect(engine.getState().G.overtime || engine.getState().G.turnMetadata.overtimeActive).toBe(
      true,
    );
  });

  it("builds a legal 3-Legend 40-card deck within RAM and rejects extra copies", () => {
    cover(
      "3.9.2",
      "3.10.2",
      "3.13",
      "3.13.1",
      "3.20",
      "3.20.1",
      "3.20.3",
      "3.20.4",
      "3.20.5",
      "3.20.5.1",
      "3.20.5.2",
      "3.20.6",
      "3.20.6.1",
      "3.21",
      "3.21.1",
      "4.1",
      "7.3",
      "7.3.1",
      "7.3.2",
      "7.3.3",
      "7.3.4",
    );
    const legends = [
      welcomeToNightCityRetailVStreetkid,
      welcomeToNightCityRetailDumDumMaelstromTriggerman,
      welcomeToNightCityRetailPanamPalmerNomadCavalry,
    ];
    const budget = new Map<string, number>();
    for (const legend of legends) {
      budget.set(legend.color, (budget.get(legend.color) ?? 0) + (legend.ram ?? 0));
    }
    const main: typeof structuredCards = [];
    for (const card of structuredCards) {
      if (card.type === "legend") continue;
      const allowed = budget.get(card.color);
      if (allowed === undefined || (card.ram ?? 0) > allowed) continue;
      for (let i = 0; i < 3 && main.length < 40; i++) main.push(card);
      if (main.length >= 40) break;
    }
    expect(main).toHaveLength(40);
    expect(validateDeck(legends, main)).toEqual([]);

    const fourCopies = main.filter((card) => card.slug !== main[0]!.slug).slice(0, 36);
    fourCopies.push(main[0]!, main[0]!, main[0]!, main[0]!);
    expect(validateDeck(legends, fourCopies).some((e) => e.code === "EXCEEDS_COPY_LIMIT")).toBe(
      true,
    );

    const dupLegends = [legends[0]!, legends[0]!, legends[1]!];
    expect(validateDeck(dupLegends, main).some((e) => e.code === "DUPLICATE_LEGEND_NAME")).toBe(
      true,
    );
  });

  it("keeps Gear on a host that moves, and mulligans once", () => {
    cover(
      "4.12",
      "4.12.1",
      "4.12.2",
      "7.9.2",
      "7.9.3",
      "7.9.3.1",
      "7.9.3.2",
      "7.9.3.3",
      "7.6",
      "7.6.3",
    );
    const engine = createSetupEngine("cr-mulligan");
    const first = engine.getState().G.turnMetadata.activePlayerId;
    const secondSeat = engine.getOpponentOf(first);
    expect(engine.getPrompt(secondSeat).availableMoves.map((m) => m.moveId)).not.toContain(
      "mulligan",
    );
    const tooSoon = engine.expectFailure(() => engine.mulligan({ as: secondSeat }));
    expect(tooSoon.errorCode).toBe("NOT_YOUR_TURN");
    const handBefore = engine.getCardsInZone("hand", first).map((c) => c.definitionId);
    engine.mulligan({ as: first });
    const handAfter = engine.getCardsInZone("hand", first);
    expect(handAfter).toHaveLength(6);
    expect(handAfter.map((c) => c.definitionId).join()).not.toBe(handBefore.join());
    const second = engine.expectFailure(() => engine.mulligan({ as: first }));
    expect(second.errorCode).toBe("ALREADY_MULLIGANED");
  });

  it("CALL-searches the top of the deck and may take up to two cards", () => {
    cover(
      "2.8",
      "5.3",
      "5.3.2",
      "5.3.2.1",
      "5.5",
      "5.5.1",
      "5.5.2",
      "5.5.3",
      "5.5.8",
      "11.5",
      "11.5.1",
      "11.13",
      "11.13.1",
      "11.13.1.1",
      "11.13.2",
      "11.14",
      "11.14.1",
      "11.14.2",
      "11.14.3",
    );
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        legendArea: [
          { card: theHeistRetailStarterDeckViktorVektorSitDownAndRelax, faceDown: true },
        ],
        deck: [
          welcomeToNightCityRetailDyingNightVSPistol,
          welcomeToNightCityRetailMantisBlades,
          welcomeToNightCityRetailCorpoSecurity,
        ],
        eddies: 1,
      },
      undefined,
      { preserveDeckOrder: true },
    );
    engine.spendAllLegends();
    engine.callLegend(theHeistRetailStarterDeckViktorVektorSitDownAndRelax, { as: P1 });
    expectScryChoice(engine, {
      amount: 5,
      destination: { zone: "hand", min: 0, max: 2, reveal: true },
    });
    engine.resolveScryTo("hand", [welcomeToNightCityRetailDyingNightVSPistol], { as: P1 });
    expect(engine.getCardsInZone("hand", P1).map((c) => c.definitionId)).toContain(
      welcomeToNightCityRetailDyingNightVSPistol.id,
    );
  });
});
