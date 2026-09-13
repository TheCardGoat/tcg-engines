import { describe, expect, it } from "vite-plus/test";
import {
  activeResources,
  createMockUnit,
  expectSuccess,
  GundamTestEngine,
  PLAYER_ONE,
} from "@tcg/gundam-engine";
import {
  acceptDevelopment,
  expectDevelopmentExiled,
} from "../../../test-helpers/development-behavior-test-helpers.ts";
import { st10GundamBarbatos1stForm008 } from "./008-gundam-barbatos-1st-form.ts";

describe("Gundam Barbatos 1st Form (ST10-008)", () => {
  it("【Deploy・Development 2】 draws and then visibly discards once per enemy player", () => {
    const development = Array.from({ length: 2 }, () =>
      createMockUnit({ traits: ["g generation"] }),
    );
    const engine = GundamTestEngine.create({
      hand: [st10GundamBarbatos1stForm008],
      trash: development,
      deck: [createMockUnit(), createMockUnit()],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const developmentIds = p1.getCardsInZone("trash");

    expectSuccess(p1.deployUnit(st10GundamBarbatos1stForm008));
    acceptDevelopment(p1, developmentIds);
    const discard = p1.getBoardView().pendingChoice;
    if (discard?.kind !== "targetSelection") throw new Error("Expected the post-draw discard");
    expect(discard.legalTargetIds).toEqual(p1.getHand());
    expect(discard).toMatchObject({ minTargets: 1, maxTargets: 1 });
    const discardedId = discard.legalTargetIds[0]!;
    expectSuccess(p1.resolveEffect({ targets: [discardedId] }));

    expectDevelopmentExiled(p1, developmentIds);
    expect(p1.getCardZone(discardedId)).toBe(`trash:${PLAYER_ONE}`);
    expect(p1.getBoardView().players[PLAYER_ONE]?.deckCount).toBe(1);
    expect(p1.getBoardView().players[PLAYER_ONE]?.handCount).toBe(0);
  });

  it("does not draw or discard when Development is declined", () => {
    const development = Array.from({ length: 2 }, () =>
      createMockUnit({ traits: ["g generation"] }),
    );
    const engine = GundamTestEngine.create({
      hand: [st10GundamBarbatos1stForm008],
      trash: development,
      deck: [createMockUnit(), createMockUnit()],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const developmentIds = p1.getCardsInZone("trash");

    expectSuccess(p1.deployUnit(st10GundamBarbatos1stForm008));
    const developmentChoice = p1.getBoardView().pendingChoice;
    if (developmentChoice?.kind !== "targetSelection") {
      throw new Error("Expected the optional Development target selection");
    }
    expectSuccess(
      p1.resolveEffect({
        optionalAnswers: { [developmentChoice.directiveIndex]: false },
      }),
    );

    expect(p1.getCardsInZone("trash")).toEqual(developmentIds);
    expect(p1.getBoardView().players[PLAYER_ONE]?.deckCount).toBe(2);
    expect(p1.getBoardView().players[PLAYER_ONE]?.handCount).toBe(0);
    expect(p1.getBoardView().pendingChoice).toBeUndefined();
  });
});
