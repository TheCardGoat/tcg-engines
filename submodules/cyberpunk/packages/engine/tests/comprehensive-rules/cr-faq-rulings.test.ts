import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorporateSurveillance,
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailDonTFearTheReaper,
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailMemoryRelapse,
  welcomeToNightCityRetailOffdutyMalfini,
  welcomeToNightCityRetailPadreManOfTheCross,
  welcomeToNightCityRetailPsychoSquad,
  welcomeToNightCityRetailWildInTheStreets,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../src/testing/index.ts";
import { cover } from "./covered-rules.ts";

/**
 * Pins the official Cyberpunk TCG Rules FAQ rulings that govern effect
 * resolution onto already- or not-yet-spent cards.
 *
 * Source: https://cyberpunktcg.com/rules-faq (retrieved 2026-10-02 via the
 * site's api.netdeck.gg FAQ feed). Each test quotes the ruling's question
 * verbatim; the engine behavior under it must never regress.
 *
 * Governing Comprehensive Rules: 2.4 / 10.2.1 (resolve as much as possible),
 * 10.6.2 (ignore the invalid part, resolve the rest), 10.7 (no legal options
 * → no choice, remaining effects still resolve), 3.7 (spending is defined on
 * a ready card, so the spend instruction fails on a spent one).
 */

const relapse = welcomeToNightCityRetailMemoryRelapse;
const surveillance = welcomeToNightCityRetailCorporateSurveillance;
const reaper = welcomeToNightCityRetailDonTFearTheReaper;
const wild = welcomeToNightCityRetailWildInTheStreets;

describe("CR official-FAQ rulings: resolving effects onto spent Units", () => {
  it("Memory Relapse FAQ: 'Can I choose a Unit that's already spent for this card's effect?' — Yes", () => {
    cover("2.4", "10.2.1", "10.6.2", "3.7");
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [relapse],
        deck: [welcomeToNightCityRetailFieldOperator],
        eddies: 4,
        gigArea: [{ dieType: "d6", faceValue: 2 }],
      },
      { field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: true }] },
      { preserveDeckOrder: true },
    );

    engine.playCard(relapse, { as: P1 });
    const choice = engine.getState().G.turnMetadata.pendingChoice;
    if (!choice || choice.type !== "chooseTarget") throw new Error("Expected Unit target choice.");
    expect(choice.payload.eligibleIds).toEqual([
      engine.findCardId(welcomeToNightCityRetailCorpoSecurity, "field", P2),
    ]);

    engine.resolveEffectTarget(welcomeToNightCityRetailCorpoSecurity, { as: P1 });

    // The spend instruction fails (the Unit is already horizontal), but the
    // can't-ready lock and the even-Street-Cred draw still resolve. The no-op
    // is announced in the game log instead of resolving silently.
    expect(engine.getCard(welcomeToNightCityRetailCorpoSecurity, "field", P2).meta.spent).toBe(
      true,
    );
    expect(engine.getEvents("actionLog")).toContainEqual(
      expect.objectContaining({
        messageKey: "effect.spend.skippedAlreadySpent",
        params: expect.objectContaining({
          targetName: "Corpo Security",
        }),
      }),
    );
    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailFieldOperator.id,
    );
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      relapse.id,
    );
  });

  it("Corporate Surveillance FAQ: 'Can I choose a Unit that's already spent for this card's effect?' — Yes", () => {
    cover("10.6.2");
    const engine = CyberpunkTestEngine.createWithFixture(
      { hand: [surveillance], legendArea: [], eddies: 2 },
      { field: [{ card: welcomeToNightCityRetailPsychoSquad, spent: true, hasLag: false }] },
    );

    engine.playCard(surveillance, { as: P1 });
    const choice = engine.getState().G.turnMetadata.pendingChoice;
    if (!choice || choice.type !== "chooseTarget") throw new Error("Expected Unit target choice.");
    expect(choice.payload.eligibleIds).toEqual([
      engine.findCardId(welcomeToNightCityRetailPsychoSquad, "field", P2),
    ]);

    engine.resolveEffectTarget(welcomeToNightCityRetailPsychoSquad, { as: P1 });

    expect(engine.getCard(welcomeToNightCityRetailPsychoSquad, "field", P2).meta.spent).toBe(true);
    expect(engine.getEddies(P1)).toBe(0);
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      surveillance.id,
    );
  });

  it("Corporate Surveillance card FAQ: 'Can I play this card without a rival Unit on the field?' — Yes", () => {
    cover("10.7");
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [surveillance],
      legendArea: [],
      eddies: 2,
    });

    engine.playCard(surveillance, { as: P1 });

    engine.expectNoPendingChoice();
    expect(engine.getEddies(P1)).toBe(0);
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      surveillance.id,
    );
  });

  it("Offduty Malfini FAQ: 'If my Rival does not have a Unit on the field when I play Offduty Malfini, do I still have to spend it?' — Yes", () => {
    cover("10.7", "10.6.2");
    const engine = CyberpunkTestEngine.createWithFixture(
      { hand: [welcomeToNightCityRetailOffdutyMalfini], eddies: 4 },
      {},
    );

    engine.playCard(welcomeToNightCityRetailOffdutyMalfini, { as: P1 });

    engine.expectNoPendingChoice();
    expect(engine.getCard(welcomeToNightCityRetailOffdutyMalfini, "field", P1).meta.spent).toBe(
      true,
    );
    expect(engine.getEddies(P1)).toBe(0);
  });

  it("Don't Fear the Reaper FAQ: 'If all rival Units are already spent, can I still use this card?' — Yes", () => {
    cover("10.6.2");
    const engine = CyberpunkTestEngine.createWithFixture(
      { hand: [reaper], eddies: 7 },
      { field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: true }] },
    );

    engine.playCard(reaper, { as: P1 });

    // "Spend all rival Units" no-ops without a spend event, and the program
    // still advances to its "Then, defeat a spent Unit" choice.
    expect(engine.getEvents("cardSpent")).toHaveLength(0);
    const choice = engine.getState().G.turnMetadata.pendingChoice;
    if (!choice || choice.type !== "chooseTarget") throw new Error("Expected spent Unit choice.");
    expect(choice.payload.eligibleIds).toEqual([
      engine.findCardId(welcomeToNightCityRetailCorpoSecurity, "field", P2),
    ]);

    engine.resolveEffectTarget(welcomeToNightCityRetailCorpoSecurity, { as: P1 });

    expect(engine.getCardsInZone("trash", P2).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailCorpoSecurity.id,
    );
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      reaper.id,
    );
  });

  it("Don't Fear the Reaper FAQ: 'Can I defeat a spent Unit that I did not spend with this effect?' — Yes", () => {
    cover("10.6.2");
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [reaper],
        field: [{ card: welcomeToNightCityRetailFieldOperator, spent: true }],
        eddies: 7,
      },
      { field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: false }] },
    );

    engine.playCard(reaper, { as: P1 });

    // The rival Unit was spent by this effect; the friendly one was already
    // spent. Both are legal defeat targets.
    const choice = engine.getState().G.turnMetadata.pendingChoice;
    if (!choice || choice.type !== "chooseTarget") throw new Error("Expected spent Unit choice.");
    expect(new Set(choice.payload.eligibleIds)).toEqual(
      new Set([
        engine.findCardId(welcomeToNightCityRetailCorpoSecurity, "field", P2),
        engine.findCardId(welcomeToNightCityRetailFieldOperator, "field", P1),
      ]),
    );

    engine.resolveEffectTarget(welcomeToNightCityRetailFieldOperator, { as: P1 });

    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailFieldOperator.id,
    );
    expect(engine.getCard(welcomeToNightCityRetailCorpoSecurity, "field", P2).meta.spent).toBe(
      true,
    );
    expect(engine.getEvents("cardDefeated")).toHaveLength(1);
  });

  it("Wild in the Streets FAQ: 'Can I play this card if there are no spent Units on the field?' — Yes", () => {
    cover("10.7");
    const engine = CyberpunkTestEngine.createWithFixture(
      { hand: [wild], eddies: 5 },
      { field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: false }] },
    );

    engine.playCard(wild, { as: P1 });

    engine.expectNoPendingChoice();
    expect(engine.getEvents("cardDefeated")).toHaveLength(0);
    expect(engine.getCard(welcomeToNightCityRetailCorpoSecurity, "field", P2).meta.spent).toBe(
      false,
    );
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(wild.id);
  });

  it("Wild in the Streets FAQ: '…only a spent friendly Unit in the Field areas. Will I have to choose my Unit?' — Yes", () => {
    cover("10.31");
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [wild],
        field: [{ card: welcomeToNightCityRetailFieldOperator, spent: true }],
        eddies: 5,
      },
      { field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: false }] },
    );

    engine.playCard(wild, { as: P1 });

    const choice = engine.getState().G.turnMetadata.pendingChoice;
    if (!choice || choice.type !== "chooseTarget") throw new Error("Expected spent Unit choice.");
    expect(choice.payload).toMatchObject({ min: 1, max: 1, canDecline: false });
    expect(choice.payload.eligibleIds).toEqual([
      engine.findCardId(welcomeToNightCityRetailFieldOperator, "field", P1),
    ]);

    engine.resolveEffectTarget(welcomeToNightCityRetailFieldOperator, { as: P1 });

    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailFieldOperator.id,
    );
  });

  it("Padre: Man of the Cross FAQ: 'May I use this card's [Spend Icon:] if all Gigs are already the same value?' — Yes", () => {
    cover("10.6.2");
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        legendArea: [
          { card: welcomeToNightCityRetailPadreManOfTheCross, faceDown: false, spent: false },
        ],
        gigArea: [{ dieType: "d6", faceValue: 3 }],
      },
      { gigArea: [{ dieType: "d8", faceValue: 3 }] },
    );
    const source = engine.findGigIdByType(P1, "d6");
    const target = engine.findGigIdByType(P2, "d8");

    engine.activateAbility(welcomeToNightCityRetailPadreManOfTheCross, 1, { as: P1 });
    engine.resolveEffectTargetIds([source, target], { as: P1 });

    // The copy fails (the value would not change) but the activation cost
    // stays paid and the rest of the action resolves.
    expect(engine.getGigDice(P2).find((die) => die.id === target)?.faceValue).toBe(3);
    expect(
      engine.getCard(welcomeToNightCityRetailPadreManOfTheCross, "legendArea", P1).meta.spent,
    ).toBe(true);
    expect(engine.getEvents("actionLog")).toContainEqual(
      expect.objectContaining({ messageKey: "trigger.copyGigValueFailed" }),
    );
  });
});
