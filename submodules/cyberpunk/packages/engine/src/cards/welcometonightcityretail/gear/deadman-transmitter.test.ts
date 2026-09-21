import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailCyberpsychosis,
  welcomeToNightCityRetailDeadmanTransmitter,
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailMantisBlades,
  welcomeToNightCityRetailRidingNomad,
  welcomeToNightCityRetailWildInTheStreets,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

const transmitter = welcomeToNightCityRetailDeadmanTransmitter;

describe("Deadman Transmitter", () => {
  it("is an exact 3-cost red Cyberware/Trauma Team Gear with RAM 3, power 1, a Sell Tag, and its mandatory replacement", () => {
    expect(transmitter).toMatchObject({
      type: "gear",
      color: "red",
      classifications: ["Cyberware", "Trauma Team"],
      cost: 3,
      power: 1,
      ram: 3,
      hasSellTag: true,
      printNumber: "024",
      attachment: {
        text: "Equip to a unit or face-up legend.",
        target: {
          selector: "card",
          controller: "friendly",
          zones: ["field", "legendArea"],
          cardTypes: ["unit", "legend"],
          face: "faceUp",
        },
      },
    });
    expect(transmitter.abilities).toEqual([
      {
        kind: "static",
        text: 'If this Unit would be defeated, defeat its "DEADMAN TRANSMITTER" instead.',
        source: { selector: "self" },
        effects: [
          {
            effect: "grantRule",
            target: { selector: "self" },
            rule: "sacrificeInsteadOfHostDefeat",
            duration: "continuous",
          },
        ],
      },
    ]);
  });

  it("pays 3 Eddies and equips to a friendly Unit through the public Gear command", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [transmitter],
      field: [{ card: welcomeToNightCityRetailFieldOperator, spent: false }],
      eddies: 3,
    });

    expect(
      engine.attachGear(transmitter, welcomeToNightCityRetailFieldOperator, { as: P1 }),
    ).toMatchObject({
      success: true,
    });

    const host = engine.getCard(welcomeToNightCityRetailFieldOperator, "field", P1);
    const gear = engine.getCard(transmitter, "field", P1);
    expect(host.meta.attachedGearIds).toEqual([gear.instanceId]);
    expect(gear.meta.attachedToId).toBe(host.instanceId);
    expect(engine.getEddies(P1)).toBe(0);
  });

  it("is defeated instead of its host when the host would be defeated in a fight", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          {
            card: welcomeToNightCityRetailFieldOperator,
            spent: true,
            hasLag: false,
            attachedGears: [transmitter],
          },
        ],
      },
      {
        field: [{ card: welcomeToNightCityRetailRidingNomad, spent: false, hasLag: false }],
      },
    );

    engine.judgeSetTurnMetadata({ activePlayerId: P2 }, { as: P1 });
    engine.attackUnit(welcomeToNightCityRetailRidingNomad, welcomeToNightCityRetailFieldOperator, {
      as: P2,
    });
    engine.resolveFullFight({ as: P2 });

    expect(engine.getCardsInZone("field", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailFieldOperator.id,
    );
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      transmitter.id,
    );
    expect(engine.getLastEvent("cardDefeated")).toMatchObject({
      cardId: engine.getCard(transmitter, "trash", P1).instanceId,
      hostId: engine.getCard(welcomeToNightCityRetailFieldOperator, "field", P1).instanceId,
    });
  });

  it("replaces a Program effect that would defeat its host", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailWildInTheStreets],
      field: [
        {
          card: welcomeToNightCityRetailFieldOperator,
          spent: true,
          hasLag: false,
          attachedGears: [transmitter, welcomeToNightCityRetailMantisBlades],
        },
      ],
      eddies: 5,
    });

    engine.playCard(welcomeToNightCityRetailWildInTheStreets, { as: P1 });
    engine.resolveEffectTarget(welcomeToNightCityRetailFieldOperator, { as: P1 });

    const host = engine.getCard(welcomeToNightCityRetailFieldOperator, "field", P1);
    expect(host.meta.attachedGearIds).toHaveLength(1);
    expect(
      engine.getCard(welcomeToNightCityRetailMantisBlades, "field", P1).meta.attachedToId,
    ).toBe(host.instanceId);
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      transmitter.id,
    );
  });

  it("lets the affected player choose between multiple mandatory Transmitter replacements", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          {
            card: welcomeToNightCityRetailFieldOperator,
            spent: true,
            hasLag: false,
            attachedGears: [transmitter, transmitter],
          },
        ],
      },
      { field: [{ card: welcomeToNightCityRetailRidingNomad, spent: false, hasLag: false }] },
    );
    const gearIds = [
      ...engine.getCard(welcomeToNightCityRetailFieldOperator, "field", P1).meta.attachedGearIds,
    ];

    engine.judgeSetTurnMetadata({ activePlayerId: P2 }, { as: P1 });
    engine.attackUnit(welcomeToNightCityRetailRidingNomad, welcomeToNightCityRetailFieldOperator, {
      as: P2,
    });
    engine.resolveFullFight({ as: P2 });

    const choice = engine.getState().G.turnMetadata.pendingChoice;
    expect(choice).toMatchObject({
      type: "chooseSacrificialGear",
      chooserId: P1,
      payload: { hostId: engine.findCardId(welcomeToNightCityRetailFieldOperator, "field", P1) },
    });
    if (!choice || choice.type !== "chooseSacrificialGear") {
      throw new Error("Expected mandatory replacement choice.");
    }
    expect(choice.payload.gearIds).toEqual(expect.arrayContaining(gearIds));
    engine.chooseSacrificialGear(gearIds[1]!, { as: P1 });

    expect(engine.getCard(welcomeToNightCityRetailFieldOperator, "field", P1)).toBeDefined();
    expect(
      engine.getCardsInZone("field", P1).filter((card) => card.definitionId === transmitter.id),
    ).toHaveLength(1);
    expect(
      engine.getCardsInZone("trash", P1).filter((card) => card.definitionId === transmitter.id),
    ).toHaveLength(1);
  });

  it("replaces Cyberpsychosis end-of-turn defeat and leaves the host's other Gear attached", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailCyberpsychosis],
        field: [
          {
            card: welcomeToNightCityRetailRidingNomad,
            spent: false,
            hasLag: false,
            attachedGears: [transmitter, welcomeToNightCityRetailMantisBlades],
          },
        ],
        eddies: 3,
      },
      { field: [{ card: welcomeToNightCityRetailFieldOperator, spent: true }] },
    );

    engine.playCard(welcomeToNightCityRetailCyberpsychosis, { as: P1 });
    engine.resolveEffectTarget(welcomeToNightCityRetailRidingNomad, { as: P1 });
    engine.attackUnit(welcomeToNightCityRetailRidingNomad, welcomeToNightCityRetailFieldOperator, {
      as: P1,
    });
    engine.resolveFullFight({ as: P1 });
    engine.completeTurn({ as: P1 });

    const host = engine.getCard(welcomeToNightCityRetailRidingNomad, "field", P1);
    expect(host.meta.attachedGearIds).toHaveLength(1);
    expect(
      engine.getCard(welcomeToNightCityRetailMantisBlades, "field", P1).meta.attachedToId,
    ).toBe(host.instanceId);
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      transmitter.id,
    );
    expect(engine.getLastEvent("cardDefeated")).toMatchObject({
      cardId: engine.getCard(transmitter, "trash", P1).instanceId,
      hostId: host.instanceId,
      defeatedBy: null,
    });
  });
});
