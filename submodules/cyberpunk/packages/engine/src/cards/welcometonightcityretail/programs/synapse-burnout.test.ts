import { describe, expect, it } from "vite-plus/test";

import {
  welcomeToNightCityRetailAdamSmasherEnderOfLegends,
  welcomeToNightCityRetailAltCunninghamSoulkillerArchitect,
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailGoroTakemuraVengefulBodyguard,
  welcomeToNightCityRetailOffdutyMalfini,
  welcomeToNightCityRetailSynapseBurnout,
} from "@tcg/cyberpunk-cards";
import { getEffectivePower } from "../../../active-effects/index.ts";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

describe("Synapse Burnout (registration)", () => {
  it("has the exact green Quickhack identity and fight-scoped per-Legend power DSL", () => {
    expect(welcomeToNightCityRetailSynapseBurnout).toMatchObject({
      canonicalId: "synapse-burnout",
      slug: "synapse-burnout",
      name: "Synapse Burnout",
      displayName: "Synapse Burnout",
      type: "program",
      color: "green",
      classifications: ["Quickhack"],
      cost: 1,
      ram: 1,
      hasSellTag: true,
      rarity: "Uncommon",
      printNumber: "102",
      keywords: ["quick"],
      reminderText: ["Discard programs after they resolve."],
      rulesText:
        "{Quick} A friendly Unit has +1 power for each friendly face-up Legend while fighting rival Units this turn.",
      abilities: [
        { kind: "keyword", keyword: "quick" },
        {
          kind: "triggered",
          trigger: { trigger: "play" },
          source: { selector: "self" },
          bindings: [
            {
              id: "selectedUnit",
              target: {
                selector: "card",
                controller: "friendly",
                zones: ["field"],
                cardTypes: ["unit"],
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
                multiplier: 1,
                target: {
                  selector: "card",
                  controller: "friendly",
                  zones: ["legendArea"],
                  cardTypes: ["legend"],
                  face: "faceUp",
                },
              },
              duration: "turn",
              whileFighting: true,
            },
          ],
        },
      ],
    });
  });

  it("plays as a real Quick reaction during a rival-turn fight", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailSynapseBurnout],
        field: [{ card: welcomeToNightCityRetailOffdutyMalfini, spent: true, hasLag: false }],
        legendArea: [
          { card: welcomeToNightCityRetailGoroTakemuraVengefulBodyguard, faceDown: false },
          { card: welcomeToNightCityRetailAdamSmasherEnderOfLegends, faceDown: false },
        ],
        eddies: 1,
      },
      {
        field: [{ card: welcomeToNightCityRetailFieldOperator, spent: false, hasLag: false }],
      },
      { activePlayerId: P2 },
    );
    const defender = engine.getCard(welcomeToNightCityRetailOffdutyMalfini, "field", P1);

    engine.attackUnit(
      welcomeToNightCityRetailFieldOperator,
      welcomeToNightCityRetailOffdutyMalfini,
      { as: P2 },
    );
    engine.resolveAttack({ as: P2 });
    engine.playCard(welcomeToNightCityRetailSynapseBurnout, { as: P1 });
    engine.resolveEffectTarget(welcomeToNightCityRetailOffdutyMalfini, { as: P1 });

    expect(engine.getEddies(P1)).toBe(0);
    expect(getEffectivePower(engine.getState(), defender.instanceId)).toBe(
      welcomeToNightCityRetailOffdutyMalfini.power + 2,
    );
  });
});

describe("Synapse Burnout — +1 power per friendly face-up Legend while fighting rival Units this turn", () => {
  it("does NOT buff the Unit while it is idle (no fight)", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailSynapseBurnout],
        field: [{ card: welcomeToNightCityRetailOffdutyMalfini, spent: false, hasLag: false }],
        legendArea: [
          { card: welcomeToNightCityRetailGoroTakemuraVengefulBodyguard, faceDown: false },
          { card: welcomeToNightCityRetailAdamSmasherEnderOfLegends, faceDown: false },
        ],
        eddies: 1,
      },
      {},
    );
    const host = engine.getCard(welcomeToNightCityRetailOffdutyMalfini, "field", P1);

    engine.playCard(welcomeToNightCityRetailSynapseBurnout, { as: P1 });
    engine.resolveEffectTarget(welcomeToNightCityRetailOffdutyMalfini, { as: P1 });

    expect(getEffectivePower(engine.getState(), host.instanceId)).toBe(
      welcomeToNightCityRetailOffdutyMalfini.power,
    );
  });

  it("buffs the Unit by +1 per friendly face-up Legend while it is fighting a rival Unit", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailSynapseBurnout],
        field: [{ card: welcomeToNightCityRetailOffdutyMalfini, spent: false, hasLag: false }],
        legendArea: [
          { card: welcomeToNightCityRetailGoroTakemuraVengefulBodyguard, faceDown: false },
          { card: welcomeToNightCityRetailAdamSmasherEnderOfLegends, faceDown: false },
        ],
        eddies: 1,
      },
      {
        field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: true }],
      },
    );
    const host = engine.getCard(welcomeToNightCityRetailOffdutyMalfini, "field", P1);

    engine.playCard(welcomeToNightCityRetailSynapseBurnout, { as: P1 });
    engine.resolveEffectTarget(welcomeToNightCityRetailOffdutyMalfini, { as: P1 });
    engine.attackUnit(
      welcomeToNightCityRetailOffdutyMalfini,
      welcomeToNightCityRetailCorpoSecurity,
      {
        as: P1,
      },
    );

    expect(getEffectivePower(engine.getState(), host.instanceId)).toBe(
      welcomeToNightCityRetailOffdutyMalfini.power + 2,
    );
  });

  it("scales with the number of friendly face-up Legends during a fight (3 → +3)", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailSynapseBurnout],
        field: [{ card: welcomeToNightCityRetailOffdutyMalfini, spent: false, hasLag: false }],
        legendArea: [
          { card: welcomeToNightCityRetailGoroTakemuraVengefulBodyguard, faceDown: false },
          { card: welcomeToNightCityRetailAdamSmasherEnderOfLegends, faceDown: false },
          { card: welcomeToNightCityRetailAltCunninghamSoulkillerArchitect, faceDown: false },
        ],
        eddies: 1,
      },
      {
        field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: true }],
      },
    );
    const host = engine.getCard(welcomeToNightCityRetailOffdutyMalfini, "field", P1);

    engine.playCard(welcomeToNightCityRetailSynapseBurnout, { as: P1 });
    engine.resolveEffectTarget(welcomeToNightCityRetailOffdutyMalfini, { as: P1 });
    engine.attackUnit(
      welcomeToNightCityRetailOffdutyMalfini,
      welcomeToNightCityRetailCorpoSecurity,
      {
        as: P1,
      },
    );

    expect(getEffectivePower(engine.getState(), host.instanceId)).toBe(
      welcomeToNightCityRetailOffdutyMalfini.power + 3,
    );
  });

  it("ignores face-down Legends", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailSynapseBurnout],
        field: [{ card: welcomeToNightCityRetailOffdutyMalfini, spent: false, hasLag: false }],
        legendArea: [
          { card: welcomeToNightCityRetailGoroTakemuraVengefulBodyguard, faceDown: false },
          { card: welcomeToNightCityRetailAdamSmasherEnderOfLegends, faceDown: true },
        ],
        eddies: 1,
      },
      {
        field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: true }],
      },
    );
    const host = engine.getCard(welcomeToNightCityRetailOffdutyMalfini, "field", P1);

    engine.playCard(welcomeToNightCityRetailSynapseBurnout, { as: P1 });
    engine.resolveEffectTarget(welcomeToNightCityRetailOffdutyMalfini, { as: P1 });
    engine.attackUnit(
      welcomeToNightCityRetailOffdutyMalfini,
      welcomeToNightCityRetailCorpoSecurity,
      {
        as: P1,
      },
    );

    expect(getEffectivePower(engine.getState(), host.instanceId)).toBe(
      welcomeToNightCityRetailOffdutyMalfini.power + 1,
    );
  });

  it("does NOT buff the Unit during a direct attack (not a fight)", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailSynapseBurnout],
        field: [{ card: welcomeToNightCityRetailOffdutyMalfini, spent: false, hasLag: false }],
        legendArea: [
          { card: welcomeToNightCityRetailGoroTakemuraVengefulBodyguard, faceDown: false },
          { card: welcomeToNightCityRetailAdamSmasherEnderOfLegends, faceDown: false },
        ],
        eddies: 1,
      },
      {},
    );
    const host = engine.getCard(welcomeToNightCityRetailOffdutyMalfini, "field", P1);

    engine.playCard(welcomeToNightCityRetailSynapseBurnout, { as: P1 });
    engine.resolveEffectTarget(welcomeToNightCityRetailOffdutyMalfini, { as: P1 });
    engine.attackRival(welcomeToNightCityRetailOffdutyMalfini, { as: P1 });

    expect(getEffectivePower(engine.getState(), host.instanceId)).toBe(
      welcomeToNightCityRetailOffdutyMalfini.power,
    );
  });

  it("applies the buff to the chosen Unit only", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailSynapseBurnout],
        field: [
          { card: welcomeToNightCityRetailOffdutyMalfini, spent: false, hasLag: false },
          { card: welcomeToNightCityRetailFieldOperator, spent: false, hasLag: false },
        ],
        legendArea: [
          { card: welcomeToNightCityRetailGoroTakemuraVengefulBodyguard, faceDown: false },
          { card: welcomeToNightCityRetailAdamSmasherEnderOfLegends, faceDown: false },
        ],
        eddies: 1,
      },
      {
        field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: true }],
      },
    );
    const targeted = engine.getCard(welcomeToNightCityRetailOffdutyMalfini, "field", P1);
    const untargeted = engine.getCard(welcomeToNightCityRetailFieldOperator, "field", P1);

    engine.playCard(welcomeToNightCityRetailSynapseBurnout, { as: P1 });
    engine.resolveEffectTarget(welcomeToNightCityRetailOffdutyMalfini, { as: P1 });
    engine.attackUnit(
      welcomeToNightCityRetailOffdutyMalfini,
      welcomeToNightCityRetailCorpoSecurity,
      {
        as: P1,
      },
    );

    expect(getEffectivePower(engine.getState(), targeted.instanceId)).toBe(
      welcomeToNightCityRetailOffdutyMalfini.power + 2,
    );
    expect(getEffectivePower(engine.getState(), untargeted.instanceId)).toBe(
      welcomeToNightCityRetailFieldOperator.power,
    );
  });

  it("expires at end of turn", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailSynapseBurnout],
        field: [{ card: welcomeToNightCityRetailOffdutyMalfini, spent: false, hasLag: false }],
        legendArea: [
          { card: welcomeToNightCityRetailGoroTakemuraVengefulBodyguard, faceDown: false },
          { card: welcomeToNightCityRetailAdamSmasherEnderOfLegends, faceDown: false },
        ],
        eddies: 1,
      },
      {},
    );
    const host = engine.getCard(welcomeToNightCityRetailOffdutyMalfini, "field", P1);

    engine.playCard(welcomeToNightCityRetailSynapseBurnout, { as: P1 });
    engine.resolveEffectTarget(welcomeToNightCityRetailOffdutyMalfini, { as: P1 });
    engine.completeTurn();
    engine.completeTurn();

    expect(getEffectivePower(engine.getState(), host.instanceId)).toBe(
      welcomeToNightCityRetailOffdutyMalfini.power,
    );
  });

  it("is discarded to trash after it resolves (one-shot Program)", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailSynapseBurnout],
        field: [{ card: welcomeToNightCityRetailOffdutyMalfini, spent: false, hasLag: false }],
        legendArea: [
          { card: welcomeToNightCityRetailGoroTakemuraVengefulBodyguard, faceDown: false },
        ],
        eddies: 1,
      },
      {},
    );

    engine.playCard(welcomeToNightCityRetailSynapseBurnout, { as: P1 });
    engine.resolveEffectTarget(welcomeToNightCityRetailOffdutyMalfini, { as: P1 });

    expect(
      engine
        .getCardsInZone("trash", P1)
        .some((card) => card.definitionId === welcomeToNightCityRetailSynapseBurnout.id),
    ).toBe(true);
  });

  it("declares a Quick play trigger with a fight-scoped perCount power buff", () => {
    const card = welcomeToNightCityRetailSynapseBurnout;
    expect(card.keywords).toContain("quick");
    const ability = card.abilities.find((a) => a.kind === "triggered")!;
    expect(ability.trigger).toMatchObject({ trigger: "play" });
    expect(ability.effects[0]).toMatchObject({
      effect: "modifyPower",
      duration: "turn",
      value: { type: "perCount", multiplier: 1 },
      whileFighting: true,
    });
  });
});
