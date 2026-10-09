import { describe, expect, it } from "vite-plus/test";
import type { CardTargetDSL } from "@tcg/cyberpunk-types";
import { legendsInPlay, unitsAndLegendsInPlay } from "@tcg/cyberpunk-types";
import {
  theHeistRetailStarterDeckVCorporateExile,
  welcomeToNightCityRetailAdamSmasherEnderOfLegends,
  welcomeToNightCityRetailGoroTakemuraVengefulBodyguard,
  welcomeToNightCityRetailKiroshiOptics,
  welcomeToNightCityRetailSketchyRipper,
  welcomeToNightCityRetailSwordwiseHuscle,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../testing/index.ts";
import type { CardInstanceId } from "../types/branded.ts";
import type { ResolutionContext } from "./target-resolver.ts";
import { evaluateCondition, resolveNumericValue, resolveTarget } from "./target-resolver.ts";

const hostUnit = welcomeToNightCityRetailSwordwiseHuscle;
const unequippedUnit = welcomeToNightCityRetailSketchyRipper;
const gear = welcomeToNightCityRetailKiroshiOptics;

function createContext(engine: CyberpunkTestEngine, sourceCardId?: CardInstanceId) {
  const fallbackSource = engine.getCardsInZone("field", P1)[0]!;
  return {
    state: engine.getState(),
    sourceCardId: sourceCardId ?? fallbackSource.instanceId,
    sourcePlayerId: P1,
    abilityIndex: 0,
    contextTargets: {},
    boundTargets: {},
  } satisfies ResolutionContext;
}

describe("target resolver DSL additions", () => {
  it("counts exactly the friendly Gigs with value 8 or higher", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: hostUnit }],
        gigArea: [
          { dieType: "d4", faceValue: 2 },
          { dieType: "d12", faceValue: 9 },
          { dieType: "d8", faceValue: 7 },
          { dieType: "d10", faceValue: 10 },
          { dieType: "d20", faceValue: 11 },
        ],
      },
      { gigArea: [{ dieType: "d8", faceValue: 8 }] },
    );

    expect(
      resolveTarget(
        { selector: "gig", controller: "friendly", amount: "all", minValue: 8 },
        createContext(engine),
      ),
    ).toHaveLength(3);
  });

  it("uses the same in-play membership for selection, numeric counts, and equipped conditions", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          { card: hostUnit, attachedGears: [gear] },
          {
            card: welcomeToNightCityRetailAdamSmasherEnderOfLegends,
            faceDown: false,
            attachedGears: [gear],
          },
        ],
        legendArea: [
          {
            card: welcomeToNightCityRetailGoroTakemuraVengefulBodyguard,
            faceDown: false,
            attachedGears: [gear],
          },
          { card: theHeistRetailStarterDeckVCorporateExile, faceDown: true },
        ],
      },
      {
        field: [
          {
            card: welcomeToNightCityRetailAdamSmasherEnderOfLegends,
            faceDown: false,
            attachedGears: [gear],
          },
        ],
      },
    );
    const context = createContext(engine);
    const faceUpLegends = legendsInPlay("friendly", "faceUp");

    expect(resolveTarget(faceUpLegends, context)).toHaveLength(2);
    expect(
      resolveNumericValue({ type: "perCount", multiplier: 1, target: faceUpLegends }, context),
    ).toBe(2);
    // A field Legend satisfies both types, but is still one equipped card.
    expect(
      resolveTarget({ ...unitsAndLegendsInPlay("friendly"), hasAttachedCards: true }, context),
    ).toHaveLength(3);
    expect(
      evaluateCondition(
        { condition: "hasEquippedUnitsOrLegends", controller: "friendly", minCount: 3 },
        context,
      ),
    ).toBe(true);
    expect(
      evaluateCondition(
        { condition: "hasEquippedUnitsOrLegends", controller: "friendly", minCount: 4 },
        context,
      ),
    ).toBe(false);
    expect(evaluateCondition({ condition: "allFriendlyLegendsFaceUp" }, context)).toBe(false);
    expect(resolveTarget({ ...faceUpLegends, zones: ["legendArea"] }, context)).toHaveLength(1);
  });

  it("applies the same target filters when checking a fight opponent", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      { field: [{ card: hostUnit, spent: false, hasLag: false }] },
      { field: [{ card: welcomeToNightCityRetailAdamSmasherEnderOfLegends, spent: true }] },
    );
    engine.attackUnit(hostUnit, welcomeToNightCityRetailAdamSmasherEnderOfLegends, { as: P1 });
    const context = createContext(engine);
    const opponent = legendsInPlay("rival");

    expect(
      evaluateCondition(
        { condition: "fightKind", target: { selector: "self" }, kind: "fight", opponent },
        context,
      ),
    ).toBe(true);
    expect(
      evaluateCondition(
        {
          condition: "fightKind",
          target: { selector: "self" },
          kind: "fight",
          opponent: { ...opponent, minPower: 100 },
        },
        context,
      ),
    ).toBe(false);
  });

  describe("effective card type", () => {
    it("treats a Legend on the field as both a Unit and a Legend", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        field: [{ card: welcomeToNightCityRetailAdamSmasherEnderOfLegends, spent: false }],
      });
      const context = createContext(engine);
      const unitTarget = {
        selector: "card",
        controller: "friendly",
        zones: ["field"],
        cardTypes: ["unit"],
      } satisfies CardTargetDSL;
      const legendTarget = {
        ...unitTarget,
        cardTypes: ["legend"],
      } satisfies CardTargetDSL;

      expect(resolveTarget(unitTarget, context)).toEqual(resolveTarget(legendTarget, context));
      expect(resolveTarget(unitTarget, context)).toHaveLength(1);
    });

    it("does not treat a Legend in the Legends area as a Unit", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        field: [{ card: hostUnit, spent: false }],
        legendArea: [{ card: welcomeToNightCityRetailAdamSmasherEnderOfLegends, faceDown: false }],
      });
      const target = {
        selector: "card",
        controller: "friendly",
        zones: ["legendArea"],
        cardTypes: ["unit"],
      } satisfies CardTargetDSL;

      expect(resolveTarget(target, createContext(engine))).toEqual([]);
    });
  });

  describe("hasDistinctGigValues condition", () => {
    it("passes when the controller has at least the required number of distinct Gig values", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        field: [{ card: hostUnit, spent: false }],
        gigArea: [
          { dieType: "d4", faceValue: 1 },
          { dieType: "d6", faceValue: 2 },
          { dieType: "d8", faceValue: 4 },
        ],
      });

      expect(
        evaluateCondition(
          { condition: "hasDistinctGigValues", controller: "friendly", minCount: 3 },
          createContext(engine),
        ),
      ).toBe(true);
    });

    it("fails when duplicate values leave fewer distinct Gig values than required", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        field: [{ card: hostUnit, spent: false }],
        gigArea: [
          { dieType: "d4", faceValue: 1 },
          { dieType: "d6", faceValue: 1 },
          { dieType: "d8", faceValue: 2 },
        ],
      });

      expect(
        evaluateCondition(
          { condition: "hasDistinctGigValues", controller: "friendly", minCount: 3 },
          createContext(engine),
        ),
      ).toBe(false);
    });
  });

  describe("Null Street Cred ordering", () => {
    it("orders Null below numeric zero", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        field: [{ card: hostUnit, spent: false }],
      });

      expect(
        evaluateCondition(
          {
            condition: "streetCred",
            controller: "friendly",
            comparison: "lt",
            value: 0,
          },
          createContext(engine),
        ),
      ).toBe(true);
    });

    it("treats two Null Street Cred values as equal", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        { field: [{ card: hostUnit, spent: false }] },
        { field: [{ card: unequippedUnit, spent: false }] },
      );

      expect(
        evaluateCondition(
          {
            condition: "streetCredComparison",
            controller: "friendly",
            comparison: "eq",
            other: "rival",
          },
          createContext(engine),
        ),
      ).toBe(true);
    });
  });

  describe("hasMinGig condition", () => {
    it("passes when the controller has any Gig at face value 1", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        field: [{ card: hostUnit, spent: false }],
        gigArea: [
          { dieType: "d4", faceValue: 1 },
          { dieType: "d6", faceValue: 5 },
        ],
      });

      expect(
        evaluateCondition(
          { condition: "hasMinGig", controller: "friendly" },
          createContext(engine),
        ),
      ).toBe(true);
    });

    it("fails when no controlled Gig is at face value 1", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        field: [{ card: hostUnit, spent: false }],
        gigArea: [
          { dieType: "d4", faceValue: 2 },
          { dieType: "d6", faceValue: 5 },
        ],
      });

      expect(
        evaluateCondition(
          { condition: "hasMinGig", controller: "friendly" },
          createContext(engine),
        ),
      ).toBe(false);
    });
  });

  describe("hasAttachedCards card target filter", () => {
    it("returns only cards with attached Gear when hasAttachedCards is true", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        field: [
          { card: hostUnit, spent: false, attachedGears: [gear] },
          { card: unequippedUnit, spent: false },
        ],
      });

      const target = {
        selector: "card",
        controller: "friendly",
        zones: ["field"],
        cardTypes: ["unit"],
        hasAttachedCards: true,
      } satisfies CardTargetDSL;

      const resolvedDefinitions = resolveTarget(target, createContext(engine)).map(
        (id) => engine.getState().G.cardIndex[id]!.definitionId,
      );

      expect(resolvedDefinitions).toEqual([hostUnit.id]);
    });

    it("returns only cards with no attached Gear when hasAttachedCards is false", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        field: [
          { card: hostUnit, spent: false, attachedGears: [gear] },
          { card: unequippedUnit, spent: false },
        ],
      });

      const target = {
        selector: "card",
        controller: "friendly",
        zones: ["field"],
        cardTypes: ["unit"],
        hasAttachedCards: false,
      } satisfies CardTargetDSL;

      const resolvedDefinitions = resolveTarget(target, createContext(engine)).map(
        (id) => engine.getState().G.cardIndex[id]!.definitionId,
      );

      expect(resolvedDefinitions).toEqual([unequippedUnit.id]);
    });

    it("applies the filter relative to the requested controller", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          field: [{ card: hostUnit, spent: false, attachedGears: [gear] }],
        },
        {
          field: [{ card: unequippedUnit, spent: false }],
        },
      );

      const target = {
        selector: "card",
        controller: "rival",
        zones: ["field"],
        cardTypes: ["unit"],
        hasAttachedCards: false,
      } satisfies CardTargetDSL;

      const resolvedDefinitions = resolveTarget(target, createContext(engine)).map(
        (id) => engine.getState().G.cardIndex[id]!.definitionId,
      );

      expect(resolvedDefinitions).toEqual([unequippedUnit.id]);
      expect(engine.getCard(unequippedUnit, "field", P2).definitionId).toBe(unequippedUnit.id);
    });
  });

  describe("lowestPower card target filter", () => {
    it("keeps the rival card with the lowest effective power", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        { field: [{ card: hostUnit, spent: false }] },
        {
          field: [
            { card: unequippedUnit, spent: false },
            { card: gear, spent: false },
          ],
        },
      );

      const target = {
        selector: "card",
        controller: "rival",
        zones: ["field"],
        cardTypes: ["unit", "gear"],
        lowestPower: true,
      } satisfies CardTargetDSL;

      const resolvedDefinitions = resolveTarget(target, createContext(engine)).map(
        (id) => engine.getState().G.cardIndex[id]!.definitionId,
      );

      expect(resolvedDefinitions).toEqual([unequippedUnit.id]);
    });
  });

  describe("host target selector", () => {
    it("resolves the Unit hosting the source Gear", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        field: [
          { card: hostUnit, spent: false, attachedGears: [gear] },
          { card: unequippedUnit, spent: false },
        ],
      });
      const host = engine.getCard(hostUnit, "field", P1);
      const attachedGearId = host.meta.attachedGearIds[0]!;

      expect(resolveTarget({ selector: "host" }, createContext(engine, attachedGearId))).toEqual([
        host.instanceId as string,
      ]);
    });

    it("returns no targets when the source card is not attached", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        field: [
          { card: hostUnit, spent: false },
          { card: gear, spent: false },
        ],
      });

      const unattachedGear = engine.getCard(gear, "field", P1);

      expect(
        resolveTarget({ selector: "host" }, createContext(engine, unattachedGear.instanceId)),
      ).toEqual([]);
    });
  });
});
