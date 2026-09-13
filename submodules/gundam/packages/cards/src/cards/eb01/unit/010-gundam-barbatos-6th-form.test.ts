import { describe, expect, it } from "vite-plus/test";
import {
  activeResources,
  createMockUnit,
  expectSuccess,
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
} from "@tcg/gundam-engine";
import {
  acceptDevelopment,
  expectDevelopmentExiled,
} from "../../../test-helpers/development-behavior-test-helpers.ts";
import { eb01GundamBarbatos6thForm010 } from "./010-gundam-barbatos-6th-form.ts";

describe("Gundam Barbatos 6th Form (EB01-010)", () => {
  it("【Deploy・Development 3】 exiles three G Generation cards and deals 2 to a rested enemy", () => {
    const development = Array.from({ length: 3 }, () =>
      createMockUnit({ traits: ["g generation"] }),
    );
    const enemy = createMockUnit({ hp: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [eb01GundamBarbatos6thForm010],
        trash: development,
        resourceArea: activeResources(5),
      },
      { play: [{ card: enemy, exhausted: true }] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const developmentIds = p1.getCardsInZone("trash");
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.deployUnit(eb01GundamBarbatos6thForm010));
    acceptDevelopment(p1, developmentIds);
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: [enemyId],
    });
    expectSuccess(p1.resolveEffect({ targets: [enemyId] }));

    expectDevelopmentExiled(p1, developmentIds);
    expect(p2.getDamage(enemyId)).toBe(2);
  });

  it("does not damage an enemy or exile cards when Development is declined", () => {
    const development = Array.from({ length: 3 }, () =>
      createMockUnit({ traits: ["g generation"] }),
    );
    const enemy = createMockUnit({ hp: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [eb01GundamBarbatos6thForm010],
        trash: development,
        resourceArea: activeResources(5),
      },
      { play: [{ card: enemy, exhausted: true }] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const trashIds = p1.getCardsInZone("trash");
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.deployUnit(eb01GundamBarbatos6thForm010));
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "targetSelection")
      throw new Error("Expected an optional Development choice");
    expectSuccess(p1.resolveEffect({ optionalAnswers: { [choice.directiveIndex]: false } }));

    for (const trashId of trashIds) expect(p1.getCardZone(trashId)).toBe(`trash:${PLAYER_ONE}`);
    expect(p2.getDamage(enemyId)).toBe(0);
  });
});
