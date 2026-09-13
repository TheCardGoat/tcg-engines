import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { eb01KudeliaAinaBernsteinIsaribi085 } from "./085-kudelia-aina-bernstein-isaribi.ts";

describe("Kudelia Aina Bernstein & Isaribi (EB01-085)", () => {
  it("returns a Shield, then optionally rests one eligible friendly blue G Generation Unit and one enemy Unit", () => {
    const eligible = createMockUnit({ color: "blue", traits: ["g generation"] });
    const wrongColor = createMockUnit({ color: "green", traits: ["g generation"] });
    const wrongTrait = createMockUnit({ color: "blue", traits: ["zeon"] });
    const enemy = createMockUnit();
    const engine = GundamTestEngine.create(
      {
        hand: [eb01KudeliaAinaBernsteinIsaribi085],
        play: [eligible, wrongColor, wrongTrait],
        shieldArea: [createMockUnit({ name: "Shield" })],
        resourceArea: activeResources(5),
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [eligibleId, wrongColorId, wrongTraitId] = p1.getCardsInZone("battleArea");
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.deployBase(eb01KudeliaAinaBernsteinIsaribi085));
    const optional = p1.getBoardView().pendingChoice;
    if (optional?.kind !== "optional") throw new Error("Expected the optional dual-target choice");
    expectSuccess(p1.resolveEffect({ optionalAnswers: { [optional.directiveIndex]: true } }));
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "targetSelection")
      throw new Error("Expected the optional dual-target choice");
    expect(choice).toMatchObject({
      kind: "targetSelection",
      minTargets: 2,
      maxTargets: 2,
      groups: [{ legalTargetIds: [eligibleId] }, { legalTargetIds: [enemyId] }],
    });
    expectSuccess(
      p1.resolveEffect({
        optionalAnswers:
          choice.optionalDirectiveIndex === undefined
            ? {}
            : { [choice.optionalDirectiveIndex]: true },
        targets: [eligibleId!, enemyId],
      }),
    );

    expect(p1.isExhausted(eligibleId!)).toBe(true);
    expect(p1.isExhausted(wrongColorId!)).toBe(false);
    expect(p1.isExhausted(wrongTraitId!)).toBe(false);
    expect(p2.isExhausted(enemyId)).toBe(true);
    expect(p1.getBoardView().players[PLAYER_ONE]?.shieldCount).toBe(0);
  });
});
