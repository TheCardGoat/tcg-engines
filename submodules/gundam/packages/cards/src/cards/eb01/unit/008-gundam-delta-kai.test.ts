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
import { eb01GundamDeltaKai008 } from "./008-gundam-delta-kai.ts";

describe("Gundam Delta Kai (EB01-008)", () => {
  it("【Deploy・Development 1】 exiles a G Generation card and recovers 2 HP from one chosen Unit", () => {
    const development = createMockUnit({ traits: ["g generation"] });
    const damaged = createMockUnit({ hp: 5 });
    const engine = GundamTestEngine.create({
      hand: [eb01GundamDeltaKai008],
      play: [{ card: damaged, damage: 3 }],
      trash: [development],
      resourceArea: activeResources(5),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const damagedId = p1.getCardsInZone("battleArea")[0]!;
    const developmentId = p1.getCardsInZone("trash")[0]!;

    expectSuccess(p1.deployUnit(eb01GundamDeltaKai008));
    acceptDevelopment(p1, [developmentId]);
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: expect.arrayContaining([damagedId]),
    });
    expectSuccess(p1.resolveEffect({ targets: [damagedId] }));

    expectDevelopmentExiled(p1, [developmentId]);
    expect(p1.getDamage(damagedId)).toBe(1);
  });

  it("does not recover HP or exile a card when its optional Development is declined", () => {
    const development = createMockUnit({ traits: ["g generation"] });
    const damaged = createMockUnit({ hp: 5 });
    const engine = GundamTestEngine.create({
      hand: [eb01GundamDeltaKai008],
      play: [{ card: damaged, damage: 3 }],
      trash: [development],
      resourceArea: activeResources(5),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const damagedId = p1.getCardsInZone("battleArea")[0]!;
    const developmentId = p1.getCardsInZone("trash")[0]!;

    expectSuccess(p1.deployUnit(eb01GundamDeltaKai008));
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "targetSelection")
      throw new Error("Expected an optional Development choice");
    expectSuccess(p1.resolveEffect({ optionalAnswers: { [choice.directiveIndex]: false } }));

    expect(p1.getCardZone(developmentId)).toBe(`trash:${PLAYER_ONE}`);
    expect(p1.getDamage(damagedId)).toBe(3);
  });
});
