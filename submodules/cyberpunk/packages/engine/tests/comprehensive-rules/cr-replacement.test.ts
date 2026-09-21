import { beforeAll, describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailDeadmanTransmitter,
  welcomeToNightCityRetailCyberpsychosis,
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailJackieWellesMamaSFavorite,
  welcomeToNightCityRetailMantisBlades,
  welcomeToNightCityRetailPsychoSquad,
  welcomeToNightCityRetailRidingNomad,
  welcomeToNightCityRetailWildInTheStreets,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2, registerMatchers } from "../../src/testing/index.ts";
import "../../src/testing/matchers.d.ts";
import { cover } from "./covered-rules.ts";

beforeAll(() => {
  registerMatchers();
});

function definitionIds(
  engine: CyberpunkTestEngine,
  zone: "field" | "trash" | "legendArea",
  playerId: typeof P1,
) {
  return engine.getCardsInZone(zone, playerId).map((card) => card.definitionId);
}

describe("CR real-card: replacement effects", () => {
  it("defeats Deadman Transmitter instead of the host Unit", () => {
    cover("10.24", "10.25", "10.4.4");
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          {
            card: welcomeToNightCityRetailFieldOperator,
            spent: true,
            hasLag: false,
            attachedGears: [welcomeToNightCityRetailDeadmanTransmitter],
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

    expect(definitionIds(engine, "field", P1)).toContain(welcomeToNightCityRetailFieldOperator.id);
    expect(definitionIds(engine, "trash", P1)).toContain(
      welcomeToNightCityRetailDeadmanTransmitter.id,
    );
    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
  });

  it("lets Jackie spend 1 €$ to be defeated instead of a friendly Unit", () => {
    cover("10.24", "10.25", "10.26");
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: welcomeToNightCityRetailFieldOperator, spent: true, hasLag: false }],
        legendArea: [{ card: welcomeToNightCityRetailJackieWellesMamaSFavorite, faceDown: false }],
        eddies: 1,
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

    const choice = engine.getState().G.turnMetadata.pendingChoice;
    expect(choice?.type).toBe("redirectDefeat");
    engine.applyRedirectDefeat({ as: P1 });

    expect(definitionIds(engine, "field", P1)).toContain(welcomeToNightCityRetailFieldOperator.id);
    expect(definitionIds(engine, "legendArea", P1)).not.toContain(
      welcomeToNightCityRetailJackieWellesMamaSFavorite.id,
    );
    expect(definitionIds(engine, "trash", P1)).not.toContain(
      welcomeToNightCityRetailJackieWellesMamaSFavorite.id,
    );
    expect(engine.getEddies(P1)).toBe(0);
  });

  it("lets Jackie decline the optional replacement so the Unit is defeated", () => {
    cover("10.26");
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: welcomeToNightCityRetailFieldOperator, spent: true, hasLag: false }],
        legendArea: [{ card: welcomeToNightCityRetailJackieWellesMamaSFavorite, faceDown: false }],
        eddies: 1,
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
    engine.declineRedirectDefeat({ as: P1 });

    expect(definitionIds(engine, "trash", P1)).toContain(welcomeToNightCityRetailFieldOperator.id);
    expect(definitionIds(engine, "legendArea", P1)).toContain(
      welcomeToNightCityRetailJackieWellesMamaSFavorite.id,
    );
    expect(engine.getEddies(P1)).toBe(1);
  });

  it("cannot apply Jackie's replacement without 1 €$", () => {
    cover("10.27");
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: welcomeToNightCityRetailFieldOperator, spent: true, hasLag: false }],
        legendArea: [{ card: welcomeToNightCityRetailJackieWellesMamaSFavorite, faceDown: false }],
        eddies: 0,
      },
      {
        field: [{ card: welcomeToNightCityRetailRidingNomad, spent: false, hasLag: false }],
      },
    );
    engine.spendAllLegends();

    engine.judgeSetTurnMetadata({ activePlayerId: P2 }, { as: P1 });
    engine.attackUnit(welcomeToNightCityRetailRidingNomad, welcomeToNightCityRetailFieldOperator, {
      as: P2,
    });
    engine.resolveFullFight({ as: P2 });

    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
    expect(definitionIds(engine, "trash", P1)).toContain(welcomeToNightCityRetailFieldOperator.id);
    expect(definitionIds(engine, "legendArea", P1)).toContain(
      welcomeToNightCityRetailJackieWellesMamaSFavorite.id,
    );
  });

  it("applies Deadman before Jackie so the optional replacement is never offered", () => {
    cover("10.28", "10.29", "10.29.1");
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          {
            card: welcomeToNightCityRetailFieldOperator,
            spent: true,
            hasLag: false,
            attachedGears: [welcomeToNightCityRetailDeadmanTransmitter],
          },
        ],
        legendArea: [{ card: welcomeToNightCityRetailJackieWellesMamaSFavorite, faceDown: false }],
        eddies: 1,
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

    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
    expect(definitionIds(engine, "field", P1)).toContain(welcomeToNightCityRetailFieldOperator.id);
    expect(definitionIds(engine, "trash", P1)).toContain(
      welcomeToNightCityRetailDeadmanTransmitter.id,
    );
    expect(definitionIds(engine, "legendArea", P1)).toContain(
      welcomeToNightCityRetailJackieWellesMamaSFavorite.id,
    );
    expect(engine.getEddies(P1)).toBe(1);
  });

  it("offers the next Jackie if the first optional replacement is declined", () => {
    cover("10.28.2", "10.29");
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: welcomeToNightCityRetailFieldOperator, spent: true, hasLag: false }],
        legendArea: [
          { card: welcomeToNightCityRetailJackieWellesMamaSFavorite, faceDown: false },
          { card: welcomeToNightCityRetailJackieWellesMamaSFavorite, faceDown: false },
        ],
        eddies: 1,
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

    const first = engine.getState().G.turnMetadata.pendingChoice;
    expect(first?.type).toBe("redirectDefeat");
    const firstJackie =
      first?.type === "redirectDefeat" ? first.payload.replacementCardId : undefined;
    expect(firstJackie).toBeDefined();
    engine.declineRedirectDefeat({ as: P1 });

    const second = engine.getState().G.turnMetadata.pendingChoice;
    expect(second?.type).toBe("redirectDefeat");
    if (second?.type === "redirectDefeat") {
      expect(second.payload.replacementCardId).not.toBe(firstJackie);
    }
    engine.applyRedirectDefeat({ as: P1 });

    expect(definitionIds(engine, "field", P1)).toContain(welcomeToNightCityRetailFieldOperator.id);
    expect(
      engine
        .getCardsInZone("legendArea", P1)
        .filter(
          (card) => card.definitionId === welcomeToNightCityRetailJackieWellesMamaSFavorite.id,
        ),
    ).toHaveLength(1);
    expect(engine.getEddies(P1)).toBe(0);
  });

  it("lets the host controller choose which Deadman is sacrificed when two are attached", () => {
    cover("10.28.1");
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          {
            card: welcomeToNightCityRetailFieldOperator,
            spent: true,
            hasLag: false,
            attachedGears: [
              welcomeToNightCityRetailDeadmanTransmitter,
              welcomeToNightCityRetailDeadmanTransmitter,
            ],
          },
        ],
      },
      {
        field: [{ card: welcomeToNightCityRetailPsychoSquad, spent: false, hasLag: false }],
      },
    );

    const host = engine.getCard(welcomeToNightCityRetailFieldOperator, "field", P1);
    const gearIds = [...host.meta.attachedGearIds];
    expect(gearIds).toHaveLength(2);
    const chosenGearId = gearIds[1]!;
    const keptGearId = gearIds[0]!;

    engine.judgeSetTurnMetadata({ activePlayerId: P2 }, { as: P1 });
    engine.attackUnit(welcomeToNightCityRetailPsychoSquad, welcomeToNightCityRetailFieldOperator, {
      as: P2,
    });
    engine.resolveFullFight({ as: P2 });

    const choice = engine.getState().G.turnMetadata.pendingChoice;
    expect(choice?.type).toBe("chooseSacrificialGear");
    if (choice?.type === "chooseSacrificialGear") {
      expect(choice.chooserId).toBe(P1);
      expect([...choice.payload.gearIds].sort()).toEqual([...gearIds].sort());
    }
    engine.chooseSacrificialGear(chosenGearId, { as: P1 });

    expect(definitionIds(engine, "field", P1)).toContain(welcomeToNightCityRetailFieldOperator.id);
    expect(engine.getState().G.cardIndex[chosenGearId]?.zone).toBe("trash");
    expect(engine.getState().G.cardIndex[keptGearId]?.zone).toBe("field");
    expect(
      engine.getCard(welcomeToNightCityRetailFieldOperator, "field", P1).meta.attachedGearIds,
    ).toEqual([keptGearId]);
    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
    expect(engine.getAttackState()).toBeNull();
  });

  it("applies Jackie to a card-effect defeat and resumes the Program after the choice", () => {
    cover("10.24", "10.25", "10.26");
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: welcomeToNightCityRetailFieldOperator, spent: true, hasLag: false }],
        legendArea: [{ card: welcomeToNightCityRetailJackieWellesMamaSFavorite, faceDown: false }],
        eddies: 1,
      },
      { hand: [welcomeToNightCityRetailWildInTheStreets], eddies: 5 },
      { activePlayerId: P2 },
    );

    engine.playCard(welcomeToNightCityRetailWildInTheStreets, { as: P2 });
    engine.resolveEffectTarget(welcomeToNightCityRetailFieldOperator, {
      as: P2,
      allowPendingChoice: true,
      reason: "Jackie must decide whether to replace the card-effect defeat.",
    });

    expect(engine.getState().G.turnMetadata.pendingChoice).toMatchObject({
      type: "redirectDefeat",
      chooserId: P1,
    });
    engine.applyRedirectDefeat({ as: P1 });

    expect(definitionIds(engine, "field", P1)).toContain(welcomeToNightCityRetailFieldOperator.id);
    expect(definitionIds(engine, "legendArea", P1)).not.toContain(
      welcomeToNightCityRetailJackieWellesMamaSFavorite.id,
    );
    expect(definitionIds(engine, "trash", P2)).toContain(
      welcomeToNightCityRetailWildInTheStreets.id,
    );
    expect(engine.getState().G.turnMetadata.currentTrigger).toBeUndefined();
  });

  it("offers the mandatory Deadman choice for a card-effect defeat", () => {
    cover("10.28.1");
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          {
            card: welcomeToNightCityRetailFieldOperator,
            spent: true,
            hasLag: false,
            attachedGears: [
              welcomeToNightCityRetailDeadmanTransmitter,
              welcomeToNightCityRetailDeadmanTransmitter,
            ],
          },
        ],
      },
      { hand: [welcomeToNightCityRetailWildInTheStreets], eddies: 5 },
      { activePlayerId: P2 },
    );
    const gearIds = [
      ...engine.getCard(welcomeToNightCityRetailFieldOperator, "field", P1).meta.attachedGearIds,
    ];

    engine.playCard(welcomeToNightCityRetailWildInTheStreets, { as: P2 });
    engine.resolveEffectTarget(welcomeToNightCityRetailFieldOperator, {
      as: P2,
      allowPendingChoice: true,
      reason: "The host controller must choose a mandatory Deadman replacement.",
    });

    expect(engine.getState().G.turnMetadata.pendingChoice).toMatchObject({
      type: "chooseSacrificialGear",
      chooserId: P1,
    });
    engine.chooseSacrificialGear(gearIds[1]!, { as: P1 });

    expect(definitionIds(engine, "field", P1)).toContain(welcomeToNightCityRetailFieldOperator.id);
    expect(engine.getState().G.cardIndex[gearIds[1] as string]?.zone).toBe("trash");
    expect(engine.getState().G.cardIndex[gearIds[0] as string]?.zone).toBe("field");
    expect(engine.getState().G.turnMetadata.currentTrigger).toBeUndefined();
  });

  it("re-checks the new defeat after Jackie applies, allowing Deadman to replace it", () => {
    cover("10.29", "10.29.1");
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailDeadmanTransmitter],
        field: [{ card: welcomeToNightCityRetailFieldOperator, spent: true, hasLag: false }],
        legendArea: [{ card: welcomeToNightCityRetailJackieWellesMamaSFavorite, faceDown: false }],
        eddies: 10,
      },
      {
        field: [{ card: welcomeToNightCityRetailRidingNomad, spent: false, hasLag: false }],
      },
      { activePlayerId: P1 },
    );

    engine.executeMove(
      "goSolo",
      {
        args: {
          cardId: engine.findCardId(
            welcomeToNightCityRetailJackieWellesMamaSFavorite,
            "legendArea",
            P1,
          ),
        },
      },
      P1,
    );
    engine.attachGear(
      welcomeToNightCityRetailDeadmanTransmitter,
      welcomeToNightCityRetailJackieWellesMamaSFavorite,
      { as: P1 },
    );
    const eddiesBeforeReplacement = engine.getEddies(P1);
    engine.judgeSetTurnMetadata({ activePlayerId: P2 }, { as: P1 });

    engine.attackUnit(welcomeToNightCityRetailRidingNomad, welcomeToNightCityRetailFieldOperator, {
      as: P2,
    });
    engine.resolveFullFight({ as: P2 });
    engine.applyRedirectDefeat({ as: P1 });

    expect(definitionIds(engine, "field", P1)).toEqual(
      expect.arrayContaining([
        welcomeToNightCityRetailFieldOperator.id,
        welcomeToNightCityRetailJackieWellesMamaSFavorite.id,
      ]),
    );
    expect(definitionIds(engine, "trash", P1)).toContain(
      welcomeToNightCityRetailDeadmanTransmitter.id,
    );
    expect(engine.getEddies(P1)).toBe(eddiesBeforeReplacement - 1);
    expect(engine.getAttackState()).toBeNull();
  });

  it("applies Jackie to delayed end-of-turn defeat before the turn advances", () => {
    cover("10.24", "10.25", "10.26");
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailCyberpsychosis],
        field: [
          {
            card: welcomeToNightCityRetailRidingNomad,
            spent: false,
            hasLag: false,
            attachedGears: [welcomeToNightCityRetailMantisBlades],
          },
        ],
        legendArea: [{ card: welcomeToNightCityRetailJackieWellesMamaSFavorite, faceDown: false }],
        eddies: 4,
      },
      { field: [{ card: welcomeToNightCityRetailFieldOperator, spent: true, hasLag: false }] },
      { activePlayerId: P1 },
    );

    engine.playCard(welcomeToNightCityRetailCyberpsychosis, { as: P1 });
    engine.resolveEffectTarget(welcomeToNightCityRetailRidingNomad, { as: P1 });
    engine.attackUnit(welcomeToNightCityRetailRidingNomad, welcomeToNightCityRetailFieldOperator, {
      as: P1,
    });
    engine.resolveFullFight({ as: P1 });
    engine.completeTurn({ as: P1 });

    expect(engine.getState().G.turnMetadata.pendingChoice).toMatchObject({
      type: "redirectDefeat",
      chooserId: P1,
    });
    expect(engine.getActivePlayerId()).toBe(P1);
    engine.applyRedirectDefeat({ as: P1 });

    expect(definitionIds(engine, "field", P1)).toContain(welcomeToNightCityRetailRidingNomad.id);
    expect(definitionIds(engine, "legendArea", P1)).not.toContain(
      welcomeToNightCityRetailJackieWellesMamaSFavorite.id,
    );
    expect(engine.getActivePlayerId()).toBe(P2);
  });
});
