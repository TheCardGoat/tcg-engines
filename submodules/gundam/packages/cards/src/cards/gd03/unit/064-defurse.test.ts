import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd03Defurse064 } from "./064-defurse.ts";

describe("Defurse (GD03-064)", () => {
  it("【Deploy】 adds an (X-Rounder) card from trash to hand, then discards 1", () => {
    const xrounder = createMockUnit({ ap: 1, hp: 1, traits: ["x-rounder"] });
    const handFiller = createMockUnit({ ap: 1, hp: 1 });

    const engine = GundamTestEngine.create({
      hand: [gd03Defurse064, handFiller],
      trash: [xrounder],
      resourceArea: activeResources(5),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [xrounderId] = p1.getCardsInZone("trash");
    const fillerId = p1.getHand()[1]!;

    expectSuccess(p1.deployUnit(gd03Defurse064, { targets: [xrounderId!] }));
    expect(p1.getBoardView().pendingChoice).toMatchObject({ kind: "optional" });
    expectSuccess(p1.resolveEffect({ optionalAnswers: { 0: true } }));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: expect.arrayContaining([fillerId, xrounderId]),
    });
    expectSuccess(p1.resolveEffect({ targets: [fillerId] }));

    expect(p1.getHand()).toContain(xrounderId);
    expect(p1.getHand()).not.toContain(fillerId);
    expect(p1.getCardZone(fillerId)).toBe(`trash:${PLAYER_ONE}`);
  });

  it("may decline to recover a card and does not discard", () => {
    const xrounder = createMockUnit({ traits: ["x-rounder"] });
    const handFiller = createMockUnit();
    const engine = GundamTestEngine.create({
      hand: [gd03Defurse064, handFiller],
      trash: [xrounder],
      resourceArea: activeResources(5),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const trashId = p1.getCardsInZone("trash")[0]!;
    const fillerId = p1.getHand()[1]!;

    expectSuccess(p1.deployUnit(gd03Defurse064));
    expectSuccess(p1.resolveEffect({ optionalAnswers: { 0: false } }));

    expect(p1.getCardsInZone("trash")).toEqual([trashId]);
    expect(p1.getHand()).toEqual([fillerId]);
  });
});
