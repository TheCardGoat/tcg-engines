import { describe, expect, it } from "vite-plus/test";
import {
  boxTopperRetailGoroTakemuraHandsUnclean,
  welcomeToNightCityRetailDelamainCab,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2, expectAttackCandidate } from "../../../testing/index.ts";

describe("Goro Takemura - Hands Unclean (box topper retail)", () => {
  it("goes solo from the legend area as a ready Unit that can attack this turn", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      legendArea: [{ card: boxTopperRetailGoroTakemuraHandsUnclean, faceDown: false }],
      eddies: 5,
    });
    const goroId = engine.findCardId(boxTopperRetailGoroTakemuraHandsUnclean, "legendArea", P1);

    const result = engine.executeMove("goSolo", { args: { cardId: goroId as string } }, P1);

    expect(result.success).toBe(true);
    const goro = engine.getCard(boxTopperRetailGoroTakemuraHandsUnclean, "field", P1);
    expect(goro.meta.spent).toBe(false);
    expect(goro.meta.playedThisTurn).toBe(false);
    expectAttackCandidate(engine, boxTopperRetailGoroTakemuraHandsUnclean, { as: P1 });
  });

  it("cannot go solo while face-down", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      legendArea: [{ card: boxTopperRetailGoroTakemuraHandsUnclean, faceDown: true }],
      eddies: 5,
    });
    const goroId = engine.findCardId(boxTopperRetailGoroTakemuraHandsUnclean, "legendArea", P1);

    const result = engine.executeMove("goSolo", { args: { cardId: goroId as string } }, P1);

    expect(result).toMatchObject({ success: false, errorCode: "CARD_FACE_DOWN" });
    expect(
      engine.getCard(boxTopperRetailGoroTakemuraHandsUnclean, "legendArea", P1).meta.faceDown,
    ).toBe(true);
  });

  it("spends as BLOCKER to redirect a rival direct attack into a fight", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          {
            card: boxTopperRetailGoroTakemuraHandsUnclean,
            spent: false,
            playedThisTurn: false,
          },
        ],
      },
      {
        field: [{ card: welcomeToNightCityRetailDelamainCab, spent: false, playedThisTurn: false }],
      },
    );

    engine.judgeSetTurnMetadata({ activePlayerId: P2 }, { as: P1 });
    engine.attackRival(welcomeToNightCityRetailDelamainCab, { as: P2 });
    engine.resolveAttack({ as: P2 });
    engine.useBlocker(boxTopperRetailGoroTakemuraHandsUnclean, { as: P1 });

    expect(engine.getCard(boxTopperRetailGoroTakemuraHandsUnclean, "field", P1).meta.spent).toBe(
      true,
    );
    expect(engine.getAttackState()).toMatchObject({
      kind: "fight",
      defenderId: engine.findCardId(boxTopperRetailGoroTakemuraHandsUnclean, "field", P1),
    });
  });

  it("does not let a spent Goro block", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          {
            card: boxTopperRetailGoroTakemuraHandsUnclean,
            spent: true,
            playedThisTurn: false,
          },
        ],
      },
      {
        field: [{ card: welcomeToNightCityRetailDelamainCab, spent: false, playedThisTurn: false }],
      },
    );

    engine.judgeSetTurnMetadata({ activePlayerId: P2 }, { as: P1 });
    engine.attackRival(welcomeToNightCityRetailDelamainCab, { as: P2 });
    engine.resolveAttack({ as: P2 });
    const failure = engine.expectFailure(() =>
      engine.useBlocker(boxTopperRetailGoroTakemuraHandsUnclean, { as: P1 }),
    );

    expect(failure.errorCode).toBe("CARD_SPENT");
    expect(engine.getCardsInZone("field", P2).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailDelamainCab.id,
    );
  });
});
