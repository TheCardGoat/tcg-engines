import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailAltCunninghamSoulkillerArchitect,
  welcomeToNightCityRetailCorporateSurveillance,
  welcomeToNightCityRetailFloorIt,
  welcomeToNightCityRetailRidingNomad,
  welcomeToNightCityRetailSketchyRipper,
} from "@tcg/cyberpunk-cards";
import { getEffectivePower } from "../../../active-effects/index.ts";
import {
  CyberpunkTestEngine,
  P1,
  P2,
  expectNoPendingChoice,
  expectPendingChoice,
} from "../../../testing/index.ts";

const PLAY_PROGRAM_FROM_TRASH = 0;

describe("Alt Cunningham — Soulkiller Architect", () => {
  /**
   * Oracle: the frozen official text exposes exactly one activated effect.
   * Its 1 €$ and SPEND are activation costs (CR 10.19), the chosen card must
   * be a friendly Program in trash, its own play cost is still paid, and it
   * moves to the bottom of its owner's deck only after that Program finishes
   * resolving (CR 10.2, 10.5.4, 11.4.1, 11.15).
   */
  it("advertises only the printed Program-from-trash ability at index 0", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      legendArea: [
        {
          card: welcomeToNightCityRetailAltCunninghamSoulkillerArchitect,
          faceDown: false,
          spent: false,
        },
      ],
      trash: [welcomeToNightCityRetailFloorIt],
      eddies: 3,
    });
    const altId = engine.findCardId(
      welcomeToNightCityRetailAltCunninghamSoulkillerArchitect,
      "legendArea",
      P1,
    );
    const activateAbility = engine
      .getPrompt(P1)
      .availableMoves.find((move) => move.moveId === "activateAbility");
    const candidates =
      activateAbility?.inputSpec.type === "selectAbility"
        ? activateAbility.inputSpec.candidates.filter((candidate) => candidate.cardId === altId)
        : [];

    expect(candidates).toHaveLength(1);
    expect(candidates[0]).toMatchObject({ abilityIndex: PLAY_PROGRAM_FROM_TRASH });
  });

  it("does not re-ask to choose Floor It after the trash Program is already selected", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        legendArea: [
          {
            card: welcomeToNightCityRetailAltCunninghamSoulkillerArchitect,
            faceDown: false,
            spent: false,
          },
        ],
        trash: [welcomeToNightCityRetailFloorIt],
        eddies: 3,
      },
      {
        trash: [welcomeToNightCityRetailCorporateSurveillance],
      },
    );
    const rivalProgramId = engine.findCardId(
      welcomeToNightCityRetailCorporateSurveillance,
      "trash",
      P2,
    );

    engine.activateAbility(
      welcomeToNightCityRetailAltCunninghamSoulkillerArchitect,
      PLAY_PROGRAM_FROM_TRASH,
      { as: P1 },
    );
    const pick = expectPendingChoice(engine, "chooseTarget");
    expect(pick.payload).toMatchObject({
      min: 1,
      max: 1,
      targetPurpose: "playCard",
    });
    expect(pick.payload.eligibleIds).not.toContain(rivalProgramId);
    engine.resolveEffectTarget(welcomeToNightCityRetailFloorIt, {
      as: P1,
      zone: "trash",
    });
    expectNoPendingChoice(engine);
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).not.toContain(
      welcomeToNightCityRetailFloorIt.id,
    );
  });

  it("is unavailable when the friendly trash contains no Program", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      legendArea: [
        {
          card: welcomeToNightCityRetailAltCunninghamSoulkillerArchitect,
          faceDown: false,
          spent: false,
        },
      ],
      trash: [welcomeToNightCityRetailRidingNomad],
      eddies: 10,
    });
    const alt = engine.getCard(
      welcomeToNightCityRetailAltCunninghamSoulkillerArchitect,
      "legendArea",
      P1,
    );
    const activateAbility = engine
      .getPrompt(P1)
      .availableMoves.find((move) => move.moveId === "activateAbility");
    const candidates =
      activateAbility?.inputSpec.type === "selectAbility"
        ? activateAbility.inputSpec.candidates
        : [];
    expect(
      candidates.some(
        (candidate) =>
          candidate.cardId === alt.instanceId && candidate.abilityIndex === PLAY_PROGRAM_FROM_TRASH,
      ),
    ).toBe(false);
    expect(
      engine.executeMove(
        "activateAbility",
        { args: { cardId: alt.instanceId, abilityIndex: PLAY_PROGRAM_FROM_TRASH } },
        P1,
      ),
    ).toMatchObject({ success: false, errorCode: "NO_VALID_TARGETS" });

    expectNoPendingChoice(engine);
    expect(alt.meta.spent).toBe(false);
    expect(engine.getEddies(P1)).toBe(10);
  });

  it("lets the player cancel the Program pick before Floor It is played", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      legendArea: [
        {
          card: welcomeToNightCityRetailAltCunninghamSoulkillerArchitect,
          faceDown: false,
          spent: false,
        },
      ],
      trash: [welcomeToNightCityRetailFloorIt],
      eddies: 3,
    });

    engine.activateAbility(
      welcomeToNightCityRetailAltCunninghamSoulkillerArchitect,
      PLAY_PROGRAM_FROM_TRASH,
      { as: P1 },
    );
    const pick = expectPendingChoice(engine, "chooseTarget");
    expect(pick.payload.canDecline).toBe(true);
    expect(pick.payload.targetPurpose).toBe("playCard");
    expect(
      engine.getPrompt(P1).availableMoves.some((move) => move.moveId === "cancelPendingResolution"),
    ).toBe(true);

    engine.executeMove("cancelPendingResolution", { args: {} }, P1);

    expectNoPendingChoice(engine);
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailFloorIt.id,
    );
    expect(
      engine.getCard(welcomeToNightCityRetailAltCunninghamSoulkillerArchitect, "legendArea", P1)
        .meta.spent,
    ).toBe(false);
    expect(engine.getEddies(P1)).toBe(3);
  });

  it("rejects an unaffordable trash Program, lets the player cancel, and continues the turn", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      legendArea: [
        {
          card: welcomeToNightCityRetailAltCunninghamSoulkillerArchitect,
          faceDown: false,
          spent: false,
        },
      ],
      trash: [welcomeToNightCityRetailFloorIt, welcomeToNightCityRetailCorporateSurveillance],
      eddies: 2,
    });

    engine.activateAbility(
      welcomeToNightCityRetailAltCunninghamSoulkillerArchitect,
      PLAY_PROGRAM_FROM_TRASH,
      { as: P1 },
    );
    expectPendingChoice(engine, "chooseTarget");

    const failure = engine.expectFailure(() =>
      engine.resolveEffectTarget(welcomeToNightCityRetailCorporateSurveillance, {
        as: P1,
        zone: "trash",
      }),
    );
    expect(failure.errorCode).toBe("INSUFFICIENT_EDDIES");
    expectPendingChoice(engine, "chooseTarget");
    expect(
      engine.getPrompt(P1).availableMoves.some((move) => move.moveId === "cancelPendingResolution"),
    ).toBe(true);

    engine.executeMove("cancelPendingResolution", { args: {} }, P1);

    expectNoPendingChoice(engine);
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toEqual(
      expect.arrayContaining([
        welcomeToNightCityRetailFloorIt.id,
        welcomeToNightCityRetailCorporateSurveillance.id,
      ]),
    );
    expect(
      engine.getCard(welcomeToNightCityRetailAltCunninghamSoulkillerArchitect, "legendArea", P1)
        .meta.spent,
    ).toBe(false);
    expect(engine.getEddies(P1)).toBe(2);
    engine.completeTurn({ as: P1 });
    expect(engine.getState().G.turnMetadata.activePlayerId).not.toBe(P1);
  });

  it("plays Floor It from trash, then asks for Floor It's rival Unit", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        legendArea: [
          {
            card: welcomeToNightCityRetailAltCunninghamSoulkillerArchitect,
            faceDown: false,
            spent: false,
          },
        ],
        trash: [welcomeToNightCityRetailFloorIt],
        deck: [welcomeToNightCityRetailSketchyRipper],
        eddies: 3,
      },
      {
        field: [{ card: welcomeToNightCityRetailRidingNomad, hasLag: false }],
      },
      { preserveDeckOrder: true },
    );
    const rivalUnit = engine.getCard(welcomeToNightCityRetailRidingNomad, "field", P2);

    engine.activateAbility(
      welcomeToNightCityRetailAltCunninghamSoulkillerArchitect,
      PLAY_PROGRAM_FROM_TRASH,
      { as: P1 },
    );
    engine.resolveEffectTarget(welcomeToNightCityRetailFloorIt, {
      as: P1,
      zone: "trash",
      allowPendingChoice: true,
      reason: "Floor It still needs a rival Unit after it is played",
    });
    const afterPlay = expectPendingChoice(engine, "chooseTarget");
    expect(afterPlay.payload.targetPurpose).not.toBe("playCard");
    expect(engine.getState().G.turnMetadata.pendingChoice?.type).not.toBe("chooseCardToPlay");
    engine.resolveEffectTarget(welcomeToNightCityRetailRidingNomad, { as: P1, zone: "field" });

    expectNoPendingChoice(engine);
    expect(getEffectivePower(engine.getState(), rivalUnit.instanceId)).toBe(
      welcomeToNightCityRetailRidingNomad.power - 1,
    );
    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailSketchyRipper.id,
    );
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).not.toContain(
      welcomeToNightCityRetailFloorIt.id,
    );
    expect(
      engine
        .getCardsInZone("deck", P1)
        .map((card) => card.definitionId)
        .at(-1),
    ).toBe(welcomeToNightCityRetailFloorIt.id);
    expect(
      engine.getCard(welcomeToNightCityRetailAltCunninghamSoulkillerArchitect, "legendArea", P1)
        .meta.spent,
    ).toBe(true);
    expect(engine.getEddies(P1)).toBe(1);
  });

  it("still plays Floor It from trash when no rival Unit can be targeted", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        legendArea: [
          {
            card: welcomeToNightCityRetailAltCunninghamSoulkillerArchitect,
            faceDown: false,
            spent: false,
          },
        ],
        trash: [welcomeToNightCityRetailFloorIt],
        deck: [welcomeToNightCityRetailSketchyRipper],
        eddies: 3,
      },
      undefined,
      { preserveDeckOrder: true },
    );

    engine.activateAbility(
      welcomeToNightCityRetailAltCunninghamSoulkillerArchitect,
      PLAY_PROGRAM_FROM_TRASH,
      { as: P1 },
    );
    engine.resolveEffectTarget(welcomeToNightCityRetailFloorIt, { as: P1, zone: "trash" });

    expectNoPendingChoice(engine);
    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailSketchyRipper.id,
    );
    expect(
      engine
        .getCardsInZone("deck", P1)
        .map((card) => card.definitionId)
        .at(-1),
    ).toBe(welcomeToNightCityRetailFloorIt.id);
    expect(engine.getEddies(P1)).toBe(1);
  });

  it("can undo Alt's activation after an earlier draw has already created a hidden-information barrier", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailFloorIt],
        legendArea: [
          {
            card: welcomeToNightCityRetailAltCunninghamSoulkillerArchitect,
            faceDown: false,
            spent: false,
          },
        ],
        trash: [],
        deck: [welcomeToNightCityRetailSketchyRipper],
        eddies: 4,
      },
      {
        field: [{ card: welcomeToNightCityRetailSketchyRipper, spent: false, hasLag: false }],
      },
      { preserveDeckOrder: true },
    );

    engine.playCard(welcomeToNightCityRetailFloorIt, { as: P1 });
    engine.resolveEffectTarget(welcomeToNightCityRetailSketchyRipper, { as: P1 });
    expect(engine.canUndo()).toBe(true);

    engine.activateAbility(
      welcomeToNightCityRetailAltCunninghamSoulkillerArchitect,
      PLAY_PROGRAM_FROM_TRASH,
      { as: P1 },
    );
    expect(engine.canUndo()).toBe(true);

    engine.resolveEffectTarget(welcomeToNightCityRetailFloorIt, {
      as: P1,
      zone: "trash",
      allowPendingChoice: true,
      reason: "Floor It still needs a rival Unit after it is played",
    });
    expectPendingChoice(engine, "chooseTarget");
    expect(engine.canUndo()).toBe(true);
    expect(engine.undo()).toBe(true);
    expectPendingChoice(engine, "chooseTarget");
    expect(engine.undo()).toBe(true);
    expectNoPendingChoice(engine);
    expect(
      engine.getCard(welcomeToNightCityRetailAltCunninghamSoulkillerArchitect, "legendArea", P1)
        .meta.spent,
    ).toBe(false);
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailFloorIt.id,
    );
  });
});
