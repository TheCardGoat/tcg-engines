import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailDelamainCab,
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailGoroTakemuraVengefulBodyguard,
  welcomeToNightCityRetailZetatechFaceplate,
} from "@tcg/cyberpunk-cards";
import { getEffectivePower } from "../../../active-effects/index.ts";
import {
  CyberpunkTestEngine,
  createMockLegend,
  createMockUnit,
  P1,
  P2,
} from "../../../testing/index.ts";
import type { PlayerId } from "../../../types/branded.ts";

const faceplate = welcomeToNightCityRetailZetatechFaceplate;
const host = welcomeToNightCityRetailFieldOperator;

function spendUnitHost(engine: CyberpunkTestEngine): void {
  engine.attackUnit(host, welcomeToNightCityRetailCorpoSecurity, { as: P1 });
}

function selectGig(
  engine: CyberpunkTestEngine,
  owner: PlayerId,
  dieType: "d4" | "d6" | "d8" | "d10" | "d12",
): void {
  engine.resolveEffectTargetIds([engine.findGigIdByType(owner, dieType)], {
    as: P1,
    allowPendingChoice: true,
    reason: "Faceplate still needs the selected Gig's new face value",
  });
}

describe("Zetatech Faceplate", () => {
  it("has the exact yellow Cyberware/Zetatech identity, host trigger, and ordered effect DSL", () => {
    expect(faceplate).toMatchObject({
      canonicalId: "zetatech-faceplate",
      slug: "zetatech-faceplate",
      name: "Zetatech Faceplate",
      displayName: "Zetatech Faceplate",
      type: "gear",
      color: "yellow",
      classifications: ["Cyberware", "Zetatech"],
      cost: 2,
      power: 2,
      ram: 2,
      hasSellTag: true,
      rarity: "Uncommon",
      printNumber: "064",
      rulesText:
        "(Equip to a friendly Unit or face-up Legend.)\nWhen this Unit or Legend is spent, adjust a Gig by up to 1. Then, if you control 3 or more Gigs with different values, draw 1.",
      abilities: [
        {
          kind: "triggered",
          trigger: {
            trigger: "event",
            event: { event: "cardSpent", player: "friendly", target: { selector: "host" } },
          },
          source: { selector: "host" },
          bindings: [
            {
              id: "selectedGig",
              target: {
                selector: "gig",
                amount: 1,
                selection: { mode: "choose", min: 0, max: 1 },
              },
            },
          ],
          effects: [
            {
              effect: "adjustGig",
              target: { selector: "bound", id: "selectedGig" },
              maxAmount: 1,
              direction: "either",
              chooseUpTo: true,
            },
            {
              effect: "draw",
              player: "friendly",
              amount: 1,
              conditions: [
                {
                  condition: "hasDistinctGigValues",
                  controller: "friendly",
                  minCount: 3,
                },
              ],
            },
          ],
        },
      ],
      attachment: {
        target: {
          selector: "card",
          controller: "friendly",
          zones: ["field", "legendArea"],
          cardTypes: ["unit", "legend"],
          face: "faceUp",
        },
      },
    });
  });

  it("pays exactly 2, equips to a friendly Unit, grants 2 power, and rejects one less", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [faceplate],
      field: [{ card: host, spent: false }],
      eddies: 2,
    });
    engine.spendAllLegends();
    engine.attachGear(faceplate, host, { as: P1 });
    const hostId = engine.findCardId(host, "field", P1);
    expect(engine.getEddies(P1)).toBe(0);
    expect(engine.getCard(host, "field", P1).meta.attachedGearIds).toHaveLength(1);
    expect(getEffectivePower(engine.getState(), hostId)).toBe(4);

    const short = CyberpunkTestEngine.createWithFixture({
      hand: [faceplate],
      field: [host],
      eddies: 1,
    });
    short.spendAllLegends();
    expect(short.expectFailure(() => short.attachGear(faceplate, host, { as: P1 })).errorCode).toBe(
      "INSUFFICIENT_EDDIES",
    );
  });

  it("adjusts a friendly Gig up by exactly 1, then draws after creating three distinct values", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        deck: [welcomeToNightCityRetailCorpoSecurity],
        field: [{ card: host, spent: false, hasLag: false, attachedGears: [faceplate] }],
        gigArea: [
          { dieType: "d4", faceValue: 1 },
          { dieType: "d6", faceValue: 2 },
          { dieType: "d8", faceValue: 2 },
        ],
      },
      { field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: true }] },
      { preserveDeckOrder: true },
    );
    spendUnitHost(engine);
    selectGig(engine, P1, "d8");
    engine.resolveAdjustGig(3, { as: P1 });

    expect(
      engine
        .getGigDice(P1)
        .map((gig) => gig.faceValue)
        .sort((a, b) => a - b),
    ).toEqual([1, 2, 3]);
    expect(engine.getHandCount(P1)).toBe(1);
  });

  it("may adjust a rival Gig down by 1 while checking only friendly distinct values", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        deck: [welcomeToNightCityRetailCorpoSecurity],
        field: [{ card: host, spent: false, hasLag: false, attachedGears: [faceplate] }],
        gigArea: [
          { dieType: "d4", faceValue: 1 },
          { dieType: "d6", faceValue: 2 },
          { dieType: "d8", faceValue: 3 },
        ],
      },
      {
        field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: true }],
        gigArea: [{ dieType: "d10", faceValue: 4 }],
      },
      { preserveDeckOrder: true },
    );
    spendUnitHost(engine);
    selectGig(engine, P2, "d10");
    engine.resolveAdjustGig(3, { as: P1 });

    expect(engine.getGigDice(P2)[0]?.faceValue).toBe(3);
    expect(engine.getHandCount(P1)).toBe(1);
  });

  it("may decline adjustment and still draws for three existing distinct friendly values", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        deck: [welcomeToNightCityRetailCorpoSecurity],
        field: [{ card: host, spent: false, hasLag: false, attachedGears: [faceplate] }],
        gigArea: [
          { dieType: "d4", faceValue: 1 },
          { dieType: "d6", faceValue: 2 },
          { dieType: "d8", faceValue: 3 },
        ],
      },
      { field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: true }] },
      { preserveDeckOrder: true },
    );
    spendUnitHost(engine);
    expect(engine.getState().G.turnMetadata.pendingChoice).toMatchObject({
      type: "chooseTarget",
      payload: { type: "effectTarget", min: 0, max: 1, canDecline: true },
    });
    engine.declineAdjustGig({ as: P1 });

    engine.expectNoPendingChoice();
    expect(engine.getHandCount(P1)).toBe(1);
  });

  it("when both players control Faceplate, only the active player's spent host triggers", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        deck: [welcomeToNightCityRetailDelamainCab],
        field: [{ card: host, spent: false, hasLag: false, attachedGears: [faceplate] }],
        gigArea: [
          { dieType: "d4", faceValue: 1 },
          { dieType: "d6", faceValue: 2 },
          { dieType: "d8", faceValue: 3 },
        ],
      },
      {
        deck: [welcomeToNightCityRetailDelamainCab],
        field: [
          {
            card: welcomeToNightCityRetailDelamainCab,
            spent: false,
            hasLag: false,
            attachedGears: [faceplate],
          },
          { card: welcomeToNightCityRetailCorpoSecurity, spent: true },
        ],
        gigArea: [
          { dieType: "d4", faceValue: 1 },
          { dieType: "d6", faceValue: 2 },
          { dieType: "d8", faceValue: 3 },
        ],
      },
      { preserveDeckOrder: true, activePlayerId: P1 },
    );
    spendUnitHost(engine);

    expect(engine.getState().G.turnMetadata.pendingChoice).toMatchObject({
      type: "chooseTarget",
      chooserId: P1,
      payload: {
        type: "effectTarget",
        min: 0,
        max: 1,
        canDecline: true,
      },
    });
    engine.declineAdjustGig({ as: P1 });

    engine.expectNoPendingChoice();
    expect(engine.getHandCount(P1)).toBe(1);
    expect(engine.getHandCount(P2)).toBe(0);
  });

  it("does not trigger an opponent-only Faceplate when the active player spends an unequipped Unit", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: host, spent: false, hasLag: false }],
        gigArea: [
          { dieType: "d4", faceValue: 1 },
          { dieType: "d6", faceValue: 2 },
          { dieType: "d8", faceValue: 3 },
        ],
      },
      {
        deck: [welcomeToNightCityRetailDelamainCab],
        field: [
          {
            card: welcomeToNightCityRetailDelamainCab,
            spent: false,
            hasLag: false,
            attachedGears: [faceplate],
          },
          { card: welcomeToNightCityRetailCorpoSecurity, spent: true },
        ],
        gigArea: [
          { dieType: "d4", faceValue: 1 },
          { dieType: "d6", faceValue: 2 },
          { dieType: "d8", faceValue: 3 },
        ],
      },
      { preserveDeckOrder: true, activePlayerId: P1 },
    );

    spendUnitHost(engine);

    engine.expectNoPendingChoice();
    expect(engine.getHandCount(P1)).toBe(0);
    expect(engine.getHandCount(P2)).toBe(0);
  });

  it.each([
    {
      label: "both players have three distinct Gig values",
      friendlyValues: [1, 2, 3],
      rivalValues: [1, 2, 3],
      expectedDraws: 1,
    },
    {
      label: "only the opponent has three distinct Gig values",
      friendlyValues: [1, 1, 2],
      rivalValues: [1, 2, 3],
      expectedDraws: 0,
    },
    {
      label: "only the active player has three distinct Gig values",
      friendlyValues: [1, 2, 3],
      rivalValues: [1, 1, 2],
      expectedDraws: 1,
    },
  ])(
    "checks only its controller's Gigs when $label",
    ({ friendlyValues, rivalValues, expectedDraws }) => {
      const [friendlyD4, friendlyD6, friendlyD8] = friendlyValues;
      const [rivalD4, rivalD6, rivalD8] = rivalValues;
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          deck: [welcomeToNightCityRetailDelamainCab],
          field: [{ card: host, spent: false, hasLag: false, attachedGears: [faceplate] }],
          gigArea: [
            { dieType: "d4", faceValue: friendlyD4! },
            { dieType: "d6", faceValue: friendlyD6! },
            { dieType: "d8", faceValue: friendlyD8! },
          ],
        },
        {
          field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: true }],
          gigArea: [
            { dieType: "d4", faceValue: rivalD4! },
            { dieType: "d6", faceValue: rivalD6! },
            { dieType: "d8", faceValue: rivalD8! },
          ],
        },
        { preserveDeckOrder: true, activePlayerId: P1 },
      );

      spendUnitHost(engine);
      engine.declineAdjustGig({ as: P1 });

      engine.expectNoPendingChoice();
      expect(engine.getHandCount(P1)).toBe(expectedDraws);
      expect(engine.getHandCount(P2)).toBe(0);
    },
  );

  it("does not draw with three or more Gigs but only two distinct values", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        deck: [welcomeToNightCityRetailCorpoSecurity],
        field: [{ card: host, spent: false, hasLag: false, attachedGears: [faceplate] }],
        gigArea: [
          { dieType: "d4", faceValue: 1 },
          { dieType: "d6", faceValue: 1 },
          { dieType: "d8", faceValue: 2 },
          { dieType: "d10", faceValue: 2 },
        ],
      },
      { field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: true }] },
      { preserveDeckOrder: true },
    );
    spendUnitHost(engine);
    engine.declineAdjustGig({ as: P1 });

    expect(engine.getHandCount(P1)).toBe(0);
  });

  it("rejects adjusting a selected Gig by more than 1", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: host, spent: false, hasLag: false, attachedGears: [faceplate] }],
        gigArea: [{ dieType: "d8", faceValue: 3 }],
      },
      { field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: true }] },
    );
    spendUnitHost(engine);
    selectGig(engine, P1, "d8");
    expect(engine.expectFailure(() => engine.resolveAdjustGig(5, { as: P1 })).errorCode).toBe(
      "EXCEEDS_MAX_AMOUNT",
    );
    engine.resolveAdjustGig(3, { as: P1 });
    expect(engine.getGigDice(P1)[0]?.faceValue).toBe(3);
  });

  it("does not trigger when a different friendly Unit is spent", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        deck: [welcomeToNightCityRetailCorpoSecurity],
        field: [
          { card: host, spent: false, hasLag: false, attachedGears: [faceplate] },
          { card: welcomeToNightCityRetailDelamainCab, spent: false, hasLag: false },
        ],
        gigArea: [
          { dieType: "d4", faceValue: 1 },
          { dieType: "d6", faceValue: 2 },
          { dieType: "d8", faceValue: 3 },
        ],
      },
      { field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: true }] },
      { preserveDeckOrder: true },
    );
    engine.attackUnit(welcomeToNightCityRetailDelamainCab, welcomeToNightCityRetailCorpoSecurity, {
      as: P1,
    });

    engine.expectNoPendingChoice();
    expect(engine.getHandCount(P1)).toBe(0);
  });

  it("equips to a face-up Legend and triggers when that Legend pays its Spend cost", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [faceplate],
      field: [host],
      legendArea: [
        {
          card: welcomeToNightCityRetailGoroTakemuraVengefulBodyguard,
          faceDown: false,
          spent: false,
        },
      ],
      eddies: 3,
      gigArea: [{ dieType: "d4", faceValue: 1 }],
    });
    engine.attachGear(faceplate, welcomeToNightCityRetailGoroTakemuraVengefulBodyguard, { as: P1 });
    engine.activateAbility(welcomeToNightCityRetailGoroTakemuraVengefulBodyguard, 1, { as: P1 });

    expect(engine.getState().G.turnMetadata.pendingChoice).toMatchObject({
      type: "chooseTarget",
      chooserId: P1,
    });
    expect(
      engine.getCard(welcomeToNightCityRetailGoroTakemuraVengefulBodyguard, "legendArea", P1).meta
        .spent,
    ).toBe(true);
  });

  it("can deliberately spend its equipped Legend as the selected payment source", () => {
    const faceplateHost = createMockLegend({ name: "Faceplate host", hasSellTag: true });
    const otherLegend = createMockLegend({ name: "Other payment source" });
    const cardToPlay = createMockUnit({ name: "Paid unit", cost: 1 });
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [cardToPlay],
      legendArea: [
        {
          card: faceplateHost,
          faceDown: false,
          attachedGears: [welcomeToNightCityRetailZetatechFaceplate],
        },
        { card: otherLegend, faceDown: true },
      ],
      gigArea: [{ dieType: "d4", faceValue: 1 }],
    });
    const hostId = engine.findCardId(faceplateHost, "legendArea", P1);
    const cardId = engine.findCardId(cardToPlay, "hand", P1);

    const result = engine.executeMove(
      "playCard",
      { args: { cardId: cardId as string, paymentSourceIds: [hostId as string] } },
      P1,
    );

    expect(result.success).toBe(true);
    expect(engine.getCard(faceplateHost, "legendArea", P1).meta.spent).toBe(true);
    expect(engine.getState().G.turnMetadata.pendingChoice?.type).toBe("chooseTarget");
  });

  it("rejects a selected payment plan that does not exactly pay the cost", () => {
    // Two available eddies cover the cost, so the insufficient-resource guard
    // passes and the exact-source validation is what rejects the single
    // submitted source.
    const firstLegend = createMockLegend({ name: "First resource", hasSellTag: true });
    const secondLegend = createMockLegend({ name: "Second resource", hasSellTag: true });
    const cardToPlay = createMockUnit({ name: "Costs two", cost: 2 });
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [cardToPlay],
      legendArea: [
        { card: firstLegend, faceDown: false },
        { card: secondLegend, faceDown: false },
      ],
    });
    const firstLegendId = engine.findCardId(firstLegend, "legendArea", P1);
    const cardId = engine.findCardId(cardToPlay, "hand", P1);

    const result = engine.executeMove(
      "playCard",
      { args: { cardId: cardId as string, paymentSourceIds: [firstLegendId as string] } },
      P1,
    );

    expect(result).toMatchObject({ success: false, errorCode: "INVALID_PAYMENT" });
    expect(engine.getCard(firstLegend, "legendArea", P1).meta.spent).toBe(false);
    expect(engine.getCard(secondLegend, "legendArea", P1).meta.spent).toBe(false);
  });
});
