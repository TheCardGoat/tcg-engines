import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockPilot,
  expectSuccess,
} from "@tcg/gundam-engine";
import { passTurnThroughPublicMoves } from "../../../test-helpers/legal-gameplay-test-helpers.ts";
import { expectBreachAbility } from "../../../test-helpers/keyword-behavior-test-helpers.ts";
import { eb01GundamExiaEx022 } from "./022-gundam-exia-ex.ts";

describe("Gundam Exia (EX) (EB01-022)", () => {
  /** @behavioral-proof complete: Breach 5 plus paired end-turn qualification, choice, destruction, and token output are public. */
  it("deals Breach 5 after destroying an enemy Unit in battle", () => {
    expectBreachAbility(eb01GundamExiaEx022, 5);
  });

  it("may destroy itself at end of turn to deploy three active Gundam Exia tokens", () => {
    const pilot = createMockPilot({ name: "G Generation Pilot", traits: ["g generation"] });
    const engine = GundamTestEngine.create({
      hand: [pilot],
      play: [eb01GundamExiaEx022],
      resourceArea: activeResources(1),
      deck: 5,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const exiaId = p1.getCardsInZone("battleArea")[0]!;
    const pilotId = p1.getHand()[0]!;

    expectSuccess(p1.assignPilot(pilotId, exiaId));
    passTurnThroughPublicMoves(engine, PLAYER_ONE);
    const optional = p1.getBoardView().pendingChoice;
    if (optional?.kind !== "optional") throw new Error("Expected Exia's end-turn choice");
    expectSuccess(p1.resolveEffect({ optionalAnswers: { [optional.directiveIndex]: true } }));

    expect(p1.getCardZone(exiaId)).toBe(`trash:${PLAYER_ONE}`);
    const tokens = p1.getCardsInZone("battleArea");
    expect(tokens).toHaveLength(3);
    for (const tokenId of tokens) {
      expect(tokenId).toMatch(/^token_gundam_exia_/);
      expect(p1.isExhausted(tokenId)).toBe(false);
      expect(p1.getVisibleCard(tokenId)).toMatchObject({
        effectiveAp: 2,
        effectiveHp: 2,
      });
    }
  });

  it("does not destroy itself or deploy tokens when the end-turn choice is declined", () => {
    const pilot = createMockPilot({ name: "G Generation Pilot", traits: ["g generation"] });
    const engine = GundamTestEngine.create({
      hand: [pilot],
      play: [eb01GundamExiaEx022],
      resourceArea: activeResources(1),
      deck: 5,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const exiaId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(p1.getHand()[0]!, exiaId));
    passTurnThroughPublicMoves(engine, PLAYER_ONE);
    const optional = p1.getBoardView().pendingChoice;
    if (optional?.kind !== "optional") throw new Error("Expected Exia's end-turn choice");
    expectSuccess(p1.resolveEffect({ optionalAnswers: { [optional.directiveIndex]: false } }));

    expect(p1.getCardZone(exiaId)).toBe(`battleArea:${PLAYER_ONE}`);
    expect(p1.getCardsInZone("battleArea")).toHaveLength(2);
  });

  it("does not offer the end-turn choice for a paired Pilot without G Generation", () => {
    const pilot = createMockPilot({ name: "Other Pilot", traits: ["attack"] });
    const engine = GundamTestEngine.create({
      hand: [pilot],
      play: [eb01GundamExiaEx022],
      resourceArea: activeResources(1),
      deck: 5,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const exiaId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(p1.getHand()[0]!, exiaId));
    passTurnThroughPublicMoves(engine, PLAYER_ONE);

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p1.getCardZone(exiaId)).toBe(`battleArea:${PLAYER_ONE}`);
  });
});
