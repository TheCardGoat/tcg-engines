import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorporateSurveillance,
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailJackieWellesMamaSFavorite,
  welcomeToNightCityRetailPlacideVoodooSentinel,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2, expectPendingChoice } from "../../../testing/index.ts";

const placide = welcomeToNightCityRetailPlacideVoodooSentinel;
const program = welcomeToNightCityRetailCorporateSurveillance;
const rivalUnit = welcomeToNightCityRetailCorpoSecurity;

describe("Placide — Voodoo Sentinel", () => {
  it("has the exact printed identity and matching PLAY and ATTACK abilities", () => {
    expect(placide).toMatchObject({
      canonicalId: "placide-voodoo-sentinel",
      slug: "placide-voodoo-sentinel",
      name: "Placide",
      subname: "Voodoo Sentinel",
      displayName: "Placide: Voodoo Sentinel",
      type: "unit",
      color: "blue",
      classifications: ["Ganger", "Netrunner", "Voodoo Boys"],
      cost: 8,
      power: 10,
      ram: 2,
      hasSellTag: false,
      timingTriggers: ["play", "attack"],
      printNumber: "123",
      rarity: "Rare",
      rulesText: "{Play} {Attack} You may discard 1 Program. If you do, bottom-deck a rival Unit.",
    });
    expect(placide.abilities).toHaveLength(2);
    expect(placide.abilities.map((ability) => ability.trigger)).toEqual([
      { trigger: "play" },
      { trigger: "attack" },
    ]);
    for (const ability of placide.abilities) {
      expect(ability).toMatchObject({
        source: { selector: "self" },
        effects: [
          {
            effect: "ifYouDo",
            doEffect: {
              effect: "discardFromHand",
              player: "friendly",
              amount: 1,
              target: {
                selector: "card",
                controller: "friendly",
                zones: ["hand"],
                cardTypes: ["program"],
              },
              optional: true,
            },
            ifEffects: [
              {
                effect: "moveCard",
                target: {
                  selector: "card",
                  controller: "rival",
                  zones: ["field"],
                  cardTypes: ["unit"],
                  selection: { mode: "choose", min: 1, max: 1 },
                },
                destination: "deckBottom",
              },
            ],
          },
        ],
      });
    }
  });

  it("plays for exactly 8 Eddies and offers only friendly Programs to discard", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [placide, program, welcomeToNightCityRetailFieldOperator],
        eddies: 8,
      },
      { field: [rivalUnit] },
    );
    for (const legend of engine.getCardsInZone("legendArea", P1)) {
      engine.judgeSpendCard(legend, { as: P1 });
    }
    const programId = engine.findCardId(program, "hand", P1);
    const unitId = engine.findCardId(welcomeToNightCityRetailFieldOperator, "hand", P1);

    engine.playCard(placide, { as: P1 });

    expect(engine.getEddies(P1)).toBe(0);
    const choice = expectPendingChoice(engine, "chooseTarget");
    expect(choice).toMatchObject({
      chooserId: P1,
      payload: {
        type: "discardFromHand",
        amount: 1,
        canDecline: true,
        eligibleIds: [programId],
      },
    });
    expect(choice.payload.eligibleIds).not.toContain(unitId);
  });

  it("on PLAY discards the chosen Program before bottom-decking the chosen rival Unit", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      { hand: [placide, program], eddies: 8 },
      { field: [rivalUnit], deck: [welcomeToNightCityRetailFieldOperator] },
      { preserveDeckOrder: true },
    );
    engine.playCard(placide, { as: P1 });
    engine.resolveDiscardFromHand([program], { as: P1 });

    const target = expectPendingChoice(engine, "chooseTarget");
    expect(target.payload).toMatchObject({
      type: "effectTarget",
      min: 1,
      max: 1,
      canDecline: false,
      eligibleIds: [engine.findCardId(rivalUnit, "field", P2)],
    });
    engine.resolveEffectTarget(rivalUnit, { as: P1 });

    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      program.id,
    );
    expect(engine.getCardsInZone("field", P2).map((card) => card.definitionId)).not.toContain(
      rivalUnit.id,
    );
    expect(engine.getCardsInZone("deck", P2).at(-1)?.definitionId).toBe(rivalUnit.id);
  });

  it("may decline the Program discard and leaves the rival Unit in play", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      { hand: [placide, program], eddies: 8 },
      { field: [rivalUnit] },
    );
    engine.playCard(placide, { as: P1 });

    expect(
      engine.executeMove("resolveDiscardFromHand", { args: { pass: true } }, P1),
    ).toMatchObject({ success: true });
    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).toContain(
      program.id,
    );
    expect(engine.getCardsInZone("field", P2).map((card) => card.definitionId)).toContain(
      rivalUnit.id,
    );
    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
  });

  it("opens no PLAY choice when no Program is available", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      { hand: [placide, welcomeToNightCityRetailFieldOperator], eddies: 8 },
      { field: [rivalUnit] },
    );

    engine.playCard(placide, { as: P1 });

    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
    expect(engine.getCardsInZone("field", P2).map((card) => card.definitionId)).toContain(
      rivalUnit.id,
    );
  });

  it("on ATTACK performs the same discard-then-bottom-deck sequence", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: placide, spent: false, hasLag: false }],
        hand: [program],
      },
      { field: [rivalUnit], deck: [welcomeToNightCityRetailFieldOperator] },
      { preserveDeckOrder: true },
    );
    engine.attackRival(placide, { as: P1 });
    engine.resolveDiscardFromHand([program], { as: P1 });
    engine.resolveEffectTarget(rivalUnit, { as: P1 });

    expect(engine.getCard(placide, "field", P1).meta.spent).toBe(true);
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      program.id,
    );
    expect(engine.getCardsInZone("deck", P2).at(-1)?.definitionId).toBe(rivalUnit.id);
  });

  it("offers rival Units including a Legend on the field, but no friendly Unit", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          { card: placide, spent: false, hasLag: false },
          welcomeToNightCityRetailFieldOperator,
        ],
        hand: [program],
      },
      {
        field: [
          rivalUnit,
          {
            card: welcomeToNightCityRetailJackieWellesMamaSFavorite,
            faceDown: false,
            spent: false,
          },
        ],
      },
    );
    engine.attackRival(placide, { as: P1 });
    engine.resolveDiscardFromHand([program], { as: P1 });
    const target = expectPendingChoice(engine, "chooseTarget");
    const rivalIds = [
      engine.findCardId(rivalUnit, "field", P2),
      engine.findCardId(welcomeToNightCityRetailJackieWellesMamaSFavorite, "field", P2),
    ];

    expect(target.payload.eligibleIds).toHaveLength(2);
    expect(target.payload.eligibleIds).toEqual(expect.arrayContaining(rivalIds));
    expect(target.payload.eligibleIds).not.toContain(
      engine.findCardId(welcomeToNightCityRetailFieldOperator, "field", P1),
    );
  });

  it("may discard a Program even when there is no rival Unit to bottom-deck", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      field: [{ card: placide, spent: false, hasLag: false }],
      hand: [program],
    });
    engine.attackRival(placide, { as: P1 });

    engine.resolveDiscardFromHand([program], { as: P1 });

    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      program.id,
    );
    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
  });
});
