import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailCyberpsychosis,
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailKiroshiOptics,
  welcomeToNightCityRetailMantisBlades,
  welcomeToNightCityRetailRidingNomad,
} from "@tcg/cyberpunk-cards";
import { getEffectivePower } from "../../../active-effects/index.ts";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

const cyberpsychosis = welcomeToNightCityRetailCyberpsychosis;

describe("Cyberpsychosis", () => {
  it("is an exact 3-cost yellow Quickhack Program with QUICK and an any-controller equipped-Unit effect", () => {
    expect(cyberpsychosis).toMatchObject({
      type: "program",
      color: "yellow",
      classifications: ["Quickhack"],
      cost: 3,
      power: null,
      ram: 2,
      hasSellTag: true,
      timingTriggers: ["play"],
      keywords: ["quick"],
      reminderText: ["Discard programs after they resolve."],
    });
    expect(cyberpsychosis.abilities).toEqual([
      {
        kind: "keyword",
        text: "QUICK",
        keyword: "quick",
        source: { selector: "self" },
        effects: [],
      },
      {
        kind: "triggered",
        text: "Give an equipped Unit +3 power this turn for each of its equipped Gears. If that Unit steals or fights, defeat it at the end of this turn.",
        trigger: { trigger: "play" },
        source: { selector: "self" },
        bindings: [
          {
            id: "selectedUnit",
            target: {
              selector: "card",
              zones: ["field"],
              cardTypes: ["unit"],
              hasAttachedCards: true,
              selection: { mode: "choose", min: 1, max: 1 },
            },
          },
        ],
        effects: [
          {
            effect: "modifyPower",
            target: { selector: "bound", id: "selectedUnit" },
            value: {
              type: "perCount",
              multiplier: 3,
              target: {
                selector: "card",
                cardTypes: ["gear"],
                attachedTo: { selector: "bound", id: "selectedUnit" },
              },
            },
            duration: "turn",
          },
          {
            effect: "defeatAtEndOfTurnIfAttacks",
            target: { selector: "bound", id: "selectedUnit" },
          },
        ],
      },
    ]);
  });

  it("gives exactly +3 power per equipped Gear for this turn and does not defeat an idle Unit", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [cyberpsychosis],
      field: [
        {
          card: welcomeToNightCityRetailRidingNomad,
          spent: false,
          hasLag: false,
          attachedGears: [
            welcomeToNightCityRetailKiroshiOptics,
            welcomeToNightCityRetailMantisBlades,
          ],
        },
        { card: welcomeToNightCityRetailCorpoSecurity, spent: false },
      ],
      eddies: 3,
    });
    const host = engine.getCard(welcomeToNightCityRetailRidingNomad, "field", P1);
    const printedTotal =
      welcomeToNightCityRetailRidingNomad.power +
      welcomeToNightCityRetailKiroshiOptics.power +
      welcomeToNightCityRetailMantisBlades.power;

    engine.playCard(cyberpsychosis, { as: P1 });
    const choice = engine.getState().G.turnMetadata.pendingChoice;
    if (!choice || choice.type !== "chooseTarget") throw new Error("Expected Unit choice.");
    expect(choice.payload).toMatchObject({ min: 1, max: 1, canDecline: false });
    expect(choice.payload.eligibleIds).toEqual([host.instanceId]);
    engine.resolveEffectTarget(welcomeToNightCityRetailRidingNomad, { as: P1 });

    expect(getEffectivePower(engine.getState(), host.instanceId)).toBe(printedTotal + 6);
    expect(engine.getEddies(P1)).toBe(0);
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      cyberpsychosis.id,
    );

    engine.completeTurn({ as: P1 });

    expect(engine.getCard(welcomeToNightCityRetailRidingNomad, "field", P1)).toBeDefined();
    expect(getEffectivePower(engine.getState(), host.instanceId)).toBe(printedTotal);
  });

  it("can target a rival equipped attacker as a QUICK reaction and defeats it after it steals", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [cyberpsychosis],
        gigArea: [{ dieType: "d6", faceValue: 2 }],
        eddies: 3,
      },
      {
        field: [
          {
            card: welcomeToNightCityRetailRidingNomad,
            spent: false,
            hasLag: false,
            attachedGears: [welcomeToNightCityRetailMantisBlades],
          },
        ],
      },
    );
    const host = engine.getCard(welcomeToNightCityRetailRidingNomad, "field", P2);
    engine.judgeSetTurnMetadata({ activePlayerId: P2 }, { as: P1 });

    engine.attackRival(welcomeToNightCityRetailRidingNomad, { as: P2 });
    engine.resolveAttack({ as: P2 });
    expect(engine.playCard(cyberpsychosis, { as: P1 })).toMatchObject({ success: true });
    engine.resolveEffectTarget(welcomeToNightCityRetailRidingNomad, { as: P1 });

    expect(getEffectivePower(engine.getState(), host.instanceId)).toBe(
      welcomeToNightCityRetailRidingNomad.power + welcomeToNightCityRetailMantisBlades.power + 3,
    );

    engine.resolveAttack({ as: P1, pass: true });
    engine.resolveAttack({ as: P2 });
    expect(engine.getGigDice(P2).map((die) => die.dieType)).toContain("d6");

    engine.completeTurn({ as: P2 });

    expect(engine.getCardsInZone("trash", P2).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailRidingNomad.id,
    );
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      cyberpsychosis.id,
    );
  });

  it("defeats the selected equipped attacking Unit at end of turn after it fights", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [cyberpsychosis],
        field: [
          {
            card: welcomeToNightCityRetailRidingNomad,
            spent: false,
            hasLag: false,
            attachedGears: [welcomeToNightCityRetailMantisBlades],
          },
        ],
        eddies: 3,
      },
      { field: [{ card: welcomeToNightCityRetailFieldOperator, spent: true }] },
    );

    engine.playCard(cyberpsychosis, { as: P1 });
    engine.resolveEffectTarget(welcomeToNightCityRetailRidingNomad, { as: P1 });
    engine.attackUnit(welcomeToNightCityRetailRidingNomad, welcomeToNightCityRetailFieldOperator, {
      as: P1,
    });
    engine.resolveFullFight({ as: P1 });
    expect(engine.getCard(welcomeToNightCityRetailRidingNomad, "field", P1)).toBeDefined();

    engine.completeTurn({ as: P1 });

    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailRidingNomad.id,
    );
  });

  it("defeats the selected equipped defending Unit at end of turn after it fights", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [cyberpsychosis],
        field: [{ card: welcomeToNightCityRetailFieldOperator, spent: false, hasLag: false }],
        eddies: 3,
      },
      {
        field: [
          {
            card: welcomeToNightCityRetailRidingNomad,
            spent: true,
            hasLag: false,
            attachedGears: [welcomeToNightCityRetailMantisBlades],
          },
        ],
      },
    );

    engine.playCard(cyberpsychosis, { as: P1 });
    engine.resolveEffectTarget(welcomeToNightCityRetailRidingNomad, { as: P1 });
    engine.attackUnit(welcomeToNightCityRetailFieldOperator, welcomeToNightCityRetailRidingNomad, {
      as: P1,
    });
    engine.resolveFullFight({ as: P1 });
    expect(engine.getCard(welcomeToNightCityRetailRidingNomad, "field", P2)).toBeDefined();

    engine.completeTurn({ as: P1 });

    expect(engine.getCardsInZone("trash", P2).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailRidingNomad.id,
    );
  });

  it("does not prompt when no equipped Unit exists", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [cyberpsychosis],
      field: [{ card: welcomeToNightCityRetailRidingNomad, spent: false, hasLag: false }],
      eddies: 3,
    });

    engine.playCard(cyberpsychosis, { as: P1 });

    engine.expectNoPendingChoice();
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      cyberpsychosis.id,
    );
  });
});
