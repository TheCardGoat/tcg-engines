import { describe, expect, it } from "vite-plus/test";
import { welcomeToNightCityRetailSketchyRipper } from "@tcg/cyberpunk-cards";
import { welcomeToNightCityRetailSecondhandBombus } from "@tcg/cyberpunk-cards";
import { welcomeToNightCityRetailTBugAmateurPhilosopher } from "@tcg/cyberpunk-cards";
import { embracingPowerRetailStarterDeckMinotaur } from "@tcg/cyberpunk-cards";
import { theHeistRetailStarterDeckVCorporateExile } from "@tcg/cyberpunk-cards";
import { welcomeToNightCityRetailJackieWellesRideOrDieChoom } from "@tcg/cyberpunk-cards";
import { welcomeToNightCityRetailKiroshiOptics } from "@tcg/cyberpunk-cards";
import { welcomeToNightCityRetailMandibularUpgrade } from "@tcg/cyberpunk-cards";
import { welcomeToNightCityRetailSatoriSwordOfSaburo } from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../src/testing/index.ts";
import { defOf } from "../src/state/lookups.ts";

describe("CyberpunkTestEngine.createWithFixture", () => {
  it("starts in main phase by default", () => {
    const engine = CyberpunkTestEngine.createWithFixture({});

    expect(engine.getPhase()).toBe("main");
  });

  it("starts in setup phase when skipSetup is false", () => {
    const engine = CyberpunkTestEngine.createWithFixture({}, {}, { skipSetup: false });

    expect(engine.getPhase()).toBe("setup");
  });

  it("places cards in hand from fixture", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailSketchyRipper, welcomeToNightCityRetailSecondhandBombus],
    });

    const hand = engine.getCardsInZone("hand", P1);
    expect(hand).toHaveLength(2);
    expect(hand[0]!.definitionId).toBe(welcomeToNightCityRetailSketchyRipper.id);
    expect(hand[1]!.definitionId).toBe(welcomeToNightCityRetailSecondhandBombus.id);
  });

  it("places cards on field from fixture", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      field: [
        embracingPowerRetailStarterDeckMinotaur,
        welcomeToNightCityRetailTBugAmateurPhilosopher,
      ],
    });

    const field = engine.getCardsInZone("field", P1);
    expect(field).toHaveLength(2);
    expect(field[0]!.definitionId).toBe(embracingPowerRetailStarterDeckMinotaur.id);
    expect(field[1]!.definitionId).toBe(welcomeToNightCityRetailTBugAmateurPhilosopher.id);
  });

  it("places attached gears on the field from fixture card state", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      field: [
        {
          card: welcomeToNightCityRetailTBugAmateurPhilosopher,
          spent: false,
          attachedGears: [
            welcomeToNightCityRetailSatoriSwordOfSaburo,
            welcomeToNightCityRetailKiroshiOptics,
          ],
        },
      ],
    });

    const host = engine.getCard(welcomeToNightCityRetailTBugAmateurPhilosopher, "field", P1);
    const satori = engine.getCard(welcomeToNightCityRetailSatoriSwordOfSaburo, "field", P1);
    const kiroshi = engine.getCard(welcomeToNightCityRetailKiroshiOptics, "field", P1);

    expect(host.meta.attachedGearIds).toEqual([satori.instanceId, kiroshi.instanceId]);
    expect(satori.meta.attachedToId).toBe(host.instanceId);
    expect(kiroshi.meta.attachedToId).toBe(host.instanceId);
  });

  it("keeps duplicate field card slots aligned when one has attached gear", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {},
      {
        field: [
          {
            card: embracingPowerRetailStarterDeckMinotaur,
            spent: false,
            attachedGears: [welcomeToNightCityRetailMandibularUpgrade],
          },
          { card: embracingPowerRetailStarterDeckMinotaur, spent: true },
        ],
      },
      { seed: "duplicate-field-card-gear" },
    );

    const field = engine.getCardsInZone("field", P2);
    const minotaurs = field.filter(
      (card) => card.definitionId === embracingPowerRetailStarterDeckMinotaur.id,
    );
    const gear = field.find(
      (card) => card.definitionId === welcomeToNightCityRetailMandibularUpgrade.id,
    );

    expect(field.slice(0, 2).map((card) => card.definitionId)).toEqual([
      embracingPowerRetailStarterDeckMinotaur.id,
      embracingPowerRetailStarterDeckMinotaur.id,
    ]);
    expect(minotaurs).toHaveLength(2);
    expect(minotaurs[0]!.meta.spent).toBe(false);
    expect(minotaurs[1]!.meta.spent).toBe(true);
    expect(minotaurs[0]!.meta.attachedGearIds).toEqual([gear!.instanceId]);
    expect(minotaurs[1]!.meta.attachedGearIds).toEqual([]);
    expect(gear!.meta.attachedToId).toBe(minotaurs[0]!.instanceId);
  });

  it("sets eddies from fixture", () => {
    const engine = CyberpunkTestEngine.createWithFixture({ eddies: 42 });

    expect(engine.getEddies(P1)).toBe(42);
  });

  it("sets eddies for both players independently", () => {
    const engine = CyberpunkTestEngine.createWithFixture({ eddies: 10 }, { eddies: 25 });

    expect(engine.getEddies(P1)).toBe(10);
    expect(engine.getEddies(P2)).toBe(25);
  });

  it("gives player two a default deck when p2 fixture is omitted", () => {
    const engine = CyberpunkTestEngine.createWithFixture({});

    const p2Deck = engine.getCardsInZone("deck", P2);
    expect(p2Deck.length).toBeGreaterThan(0);
  });

  it("places cards in legendArea from fixture", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      legendArea: [
        theHeistRetailStarterDeckVCorporateExile,
        welcomeToNightCityRetailJackieWellesRideOrDieChoom,
      ],
    });

    const legends = engine.getCardsInZone("legendArea", P1);
    expect(legends.length).toBeGreaterThanOrEqual(2);

    const ids = legends.map((c) => c.definitionId);
    expect(ids).toContain(theHeistRetailStarterDeckVCorporateExile.id);
    expect(ids).toContain(welcomeToNightCityRetailJackieWellesRideOrDieChoom.id);
  });

  it("initializes card instance properties correctly", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      field: [embracingPowerRetailStarterDeckMinotaur],
    });

    const card = engine.getCard(embracingPowerRetailStarterDeckMinotaur, "field", P1);
    expect(card.zone).toBe("field");
    expect(card.definitionId).toBe(embracingPowerRetailStarterDeckMinotaur.id);
    expect(defOf(card).cost).toBe(embracingPowerRetailStarterDeckMinotaur.cost);
    expect(defOf(card).power).toBe(embracingPowerRetailStarterDeckMinotaur.power);
    expect(card.meta.spent).toBe(false);
    expect(card.meta.damage).toBe(0);
  });

  it("places cards for player two from fixture", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {},
      { field: [welcomeToNightCityRetailSketchyRipper], eddies: 5 },
    );

    const p2Field = engine.getCardsInZone("field", P2);
    expect(p2Field).toHaveLength(1);
    expect(p2Field[0]!.definitionId).toBe(welcomeToNightCityRetailSketchyRipper.id);
    expect(engine.getEddies(P2)).toBe(5);
  });

  it("has an active player after initialization", () => {
    const engine = CyberpunkTestEngine.createWithFixture({});

    const activeId = engine.getActivePlayerId();
    expect([P1 as string, P2 as string]).toContain(activeId as string);
  });

  it("game is not over after initialization", () => {
    const engine = CyberpunkTestEngine.createWithFixture({});

    expect(engine.isGameOver()).toBe(false);
    expect(engine.getWinnerId()).toBeNull();
  });
});
