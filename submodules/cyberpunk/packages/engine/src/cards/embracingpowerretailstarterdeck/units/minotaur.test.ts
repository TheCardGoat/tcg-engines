import { describe, expect, it } from "vite-plus/test";
import {
  embracingPowerRetailStarterDeckMinotaur,
  welcomeToNightCityRetailDyingNightVSPistol,
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailMeredithStoutStoneColdCorpo,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

const minotaur = embracingPowerRetailStarterDeckMinotaur;

describe("Minotaur", () => {
  it("is the exact red 7-cost 9-power Arasaka Drone Militech Unit with its conditional Play defeat", () => {
    expect(minotaur).toMatchObject({
      canonicalId: "minotaur",
      slug: "minotaur",
      name: "Minotaur",
      displayName: "Minotaur",
      type: "unit",
      color: "red",
      classifications: ["Arasaka", "Drone", "Militech"],
      cost: 7,
      power: 9,
      ram: 2,
      hasSellTag: false,
      printNumber: "003",
      timingTriggers: ["play"],
      rulesText:
        "{Play} If you have more ☆ (Street Cred) than a Rival, defeat a rival Unit with power 5 or less.",
      abilities: [
        {
          kind: "triggered",
          trigger: { trigger: "play" },
          source: { selector: "self" },
          conditions: [
            {
              condition: "streetCredComparison",
              controller: "friendly",
              comparison: "gt",
              other: "rival",
            },
          ],
          effects: [
            {
              effect: "defeat",
              target: {
                selector: "card",
                controller: "rival",
                zones: ["field"],
                cardTypes: ["unit"],
                maxPower: 5,
                selection: { mode: "choose", min: 1, max: 1 },
              },
            },
          ],
        },
      ],
    });
  });

  it("defeats exactly one chosen rival Unit at the 5-power boundary when Street Cred is higher", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [minotaur],
        eddies: 7,
        gigArea: [{ dieType: "d8", faceValue: 6 }],
      },
      {
        field: [
          { card: welcomeToNightCityRetailMeredithStoutStoneColdCorpo, spent: false },
          { card: welcomeToNightCityRetailFieldOperator, spent: false },
        ],
        gigArea: [{ dieType: "d4", faceValue: 2 }],
      },
    );

    engine.playCard(minotaur, { as: P1 });
    const choice = engine.getState().G.turnMetadata.pendingChoice;
    expect(choice).toMatchObject({
      type: "chooseTarget",
      chooserId: P1,
      payload: { min: 1, max: 1, canDecline: false },
    });
    if (!choice || choice.type !== "chooseTarget")
      throw new Error("Expected Minotaur target choice");
    expect(choice.payload.eligibleIds).toEqual(
      expect.arrayContaining([
        engine.getCard(welcomeToNightCityRetailMeredithStoutStoneColdCorpo, "field", P2).instanceId,
        engine.getCard(welcomeToNightCityRetailFieldOperator, "field", P2).instanceId,
      ]),
    );
    engine.resolveEffectTarget(welcomeToNightCityRetailMeredithStoutStoneColdCorpo, { as: P1 });

    expect(engine.getCardsInZone("trash", P2).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailMeredithStoutStoneColdCorpo.id,
    );
    expect(engine.getCardsInZone("field", P2).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailFieldOperator.id,
    );
  });

  it("uses effective power and rejects a rival Unit boosted above 5", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [minotaur],
        eddies: 7,
        gigArea: [{ dieType: "d8", faceValue: 6 }],
      },
      {
        field: [
          {
            card: welcomeToNightCityRetailMeredithStoutStoneColdCorpo,
            spent: false,
            attachedGears: [welcomeToNightCityRetailDyingNightVSPistol],
          },
          { card: welcomeToNightCityRetailFieldOperator, spent: false },
        ],
        gigArea: [{ dieType: "d4", faceValue: 2 }],
      },
    );

    engine.playCard(minotaur, { as: P1 });
    const choice = engine.getState().G.turnMetadata.pendingChoice;
    if (!choice || choice.type !== "chooseTarget")
      throw new Error("Expected Minotaur target choice");
    const boostedId = engine.getCard(
      welcomeToNightCityRetailMeredithStoutStoneColdCorpo,
      "field",
      P2,
    ).instanceId;
    expect(choice.payload.eligibleIds).not.toContain(boostedId);
    expect(
      engine.executeMove("resolveEffectTarget", { args: { targetIds: [boostedId] } }, P1),
    ).toMatchObject({ success: false, errorCode: "INVALID_CHOICE" });
    engine.resolveEffectTarget(welcomeToNightCityRetailFieldOperator, { as: P1 });

    expect(engine.getCardsInZone("field", P2).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailMeredithStoutStoneColdCorpo.id,
    );
    expect(engine.getCardsInZone("trash", P2).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailFieldOperator.id,
    );
  });

  it.each([
    {
      label: "tied",
      friendlyGigs: [{ dieType: "d4" as const, faceValue: 2 }],
      rivalGigs: [{ dieType: "d6" as const, faceValue: 2 }],
    },
    {
      label: "lower",
      friendlyGigs: [{ dieType: "d4" as const, faceValue: 2 }],
      rivalGigs: [{ dieType: "d8" as const, faceValue: 6 }],
    },
    { label: "Null", friendlyGigs: [], rivalGigs: [{ dieType: "d4" as const, faceValue: 1 }] },
  ])(
    "does not trigger when friendly Street Cred is $label rather than higher",
    ({ friendlyGigs, rivalGigs }) => {
      const engine = CyberpunkTestEngine.createWithFixture(
        { hand: [minotaur], eddies: 7, gigArea: friendlyGigs },
        {
          field: [{ card: welcomeToNightCityRetailFieldOperator, spent: false }],
          gigArea: rivalGigs,
        },
      );

      engine.playCard(minotaur, { as: P1 });

      expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
      expect(engine.getCardsInZone("field", P2).map((card) => card.definitionId)).toContain(
        welcomeToNightCityRetailFieldOperator.id,
      );
    },
  );

  it("resolves the valid Play trigger without a prompt when no rival Unit has power 5 or less", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [minotaur],
        eddies: 7,
        gigArea: [{ dieType: "d8", faceValue: 6 }],
      },
      {
        field: [{ card: minotaur, spent: false }],
        gigArea: [{ dieType: "d4", faceValue: 2 }],
      },
    );

    engine.playCard(minotaur, { as: P1 });

    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
    expect(engine.getCardsInZone("field", P1).map((card) => card.definitionId)).toContain(
      minotaur.id,
    );
    expect(engine.getCardsInZone("field", P2).map((card) => card.definitionId)).toContain(
      minotaur.id,
    );
  });
});
