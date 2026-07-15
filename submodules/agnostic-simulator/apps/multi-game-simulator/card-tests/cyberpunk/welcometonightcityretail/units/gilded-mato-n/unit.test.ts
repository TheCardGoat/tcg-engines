import { describe, expect, it } from "vite-plus/test";
import {
  CyberpunkTestEngine,
  P1,
  P2,
  createMockUnit,
  createMockGear,
  expectEligibleTargets,
  expectNoPendingChoice,
  expectPendingChoice,
} from "@cyberpunk-engine/testing/index.ts";
import {
  welcomeToNightCityRetailGildedMatoN,
  welcomeToNightCityRetailSwordwiseHuscle,
} from "@tcg/cyberpunk-cards";

const maton = welcomeToNightCityRetailGildedMatoN; // unit, cost 4, power 3
const friendlyHost = welcomeToNightCityRetailSwordwiseHuscle; // a real unit to attach gear to
const friendlyGear = createMockGear({ id: "maton-friendly-gear", name: "Friendly Gear" });
const rivalCost3 = createMockUnit({
  id: "maton-rival-cost-3",
  name: "Rival cost3",
  cost: 3,
  power: 2,
});
const rivalCost4 = createMockUnit({
  id: "maton-rival-cost-4",
  name: "Rival cost4",
  cost: 4,
  power: 4,
});

function withGearAttached() {
  return {
    card: friendlyHost,
    attachedGears: [friendlyGear],
  };
}

function expectCardInZone(
  engine: CyberpunkTestEngine,
  card: { id: string },
  zone: string,
  player: typeof P1 | typeof P2,
): void {
  const ids = engine.getCardsInZone(zone, player).map((c) => c.definitionId);
  expect(ids, `expected ${card.id} to be in ${zone} for ${player}`).toContain(card.id);
}

function expectCardNotInZone(
  engine: CyberpunkTestEngine,
  card: { id: string },
  zone: string,
  player: typeof P1 | typeof P2,
): void {
  const ids = engine.getCardsInZone(zone, player).map((c) => c.definitionId);
  expect(ids, `expected ${card.id} NOT to be in ${zone} for ${player}`).not.toContain(card.id);
}

describe("Gilded Matón", () => {
  describe("[PLAY] You may defeat a friendly Gear. If you do, defeat a rival Unit with cost 3 or less", () => {
    it("offers the attached friendly Gear as a chooseCardToMove (defeat) choice", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        { hand: [maton], eddies: maton.cost, field: [withGearAttached()] },
        { field: [{ card: rivalCost3 }] },
      );
      engine.playCard(maton);
      // The optional gear defeat surfaces as a chooseCardToMove pending choice.
      expectPendingChoice(engine, "chooseCardToMove");
    });

    it("defeats the friendly Gear, then offers rival Units with cost <= 3 (excludes cost 4)", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        { hand: [maton], eddies: maton.cost, field: [withGearAttached()] },
        { field: [{ card: rivalCost3 }, { card: rivalCost4 }] },
      );
      engine.playCard(maton);
      engine.resolveCardToMove(friendlyGear);

      // Now a rival-unit target choice: only cost-3 is eligible, cost-4 excluded.
      expectEligibleTargets(engine, [rivalCost3]);
    });

    it("defeats the chosen rival Unit after defeating the Gear (full ifYouDo chain)", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        { hand: [maton], eddies: maton.cost, field: [withGearAttached()] },
        { field: [{ card: rivalCost3 }, { card: rivalCost4 }] },
      );
      engine.playCard(maton);
      engine.resolveCardToMove(friendlyGear);
      engine.resolveEffectTarget(rivalCost3);

      // Gear defeated -> friendly trash; rival cost-3 defeated -> rival trash.
      expectCardInZone(engine, friendlyGear, "trash", P1);
      expectCardInZone(engine, rivalCost3, "trash", P2);
      // cost-4 rival survives on the field.
      expectCardInZone(engine, rivalCost4, "field", P2);
      // No stray pending choice.
      expectNoPendingChoice(engine);
    });

    it("declining the Gear defeat (pass) skips the rival defeat entirely", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        { hand: [maton], eddies: maton.cost, field: [withGearAttached()] },
        { field: [{ card: rivalCost3 }] },
      );
      engine.playCard(maton);
      engine.resolveCardToMove(undefined, { pass: true });

      // Gear NOT defeated (stays on field), rival NOT defeated, no pending choice.
      expectCardInZone(engine, rivalCost3, "field", P2);
      expectNoPendingChoice(engine);
    });

    it("with no friendly Gear, the optional is auto-declined and no rival choice is offered", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        { hand: [maton], eddies: maton.cost, field: [{ card: friendlyHost }] }, // no gear
        { field: [{ card: rivalCost3 }] },
      );
      engine.playCard(maton);
      expectNoPendingChoice(engine);
      expectCardInZone(engine, rivalCost3, "field", P2);
    });
  });
});
