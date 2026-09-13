import { describe, expect, it } from "vite-plus/test";
import { createMockUnit, expectSuccess, GundamTestEngine, PLAYER_ONE } from "@tcg/gundam-engine";
import { gd05QuessSJagdDoga053 } from "./053-quess-s-jagd-doga.ts";

describe("Quess's Jagd Doga (GD05-053)", () => {
  it("【Destroyed】 returns itself to hand when destroyed by a friendly Neo Zeon card effect", () => {
    const destroyer = createMockUnit({
      traits: ["neo zeon"],
      effects: [
        {
          type: "activated",
          activation: { timing: ["activate:main"] },
          directives: [
            {
              action: {
                action: "destroy",
                target: { owner: "friendly", cardType: "unit", excludeSource: true, count: 1 },
              },
            },
          ],
          sourceText: "【Activate･Main】Choose 1 of your other Units. Destroy it.",
        },
      ],
    });
    const engine = GundamTestEngine.create({
      play: [destroyer, gd05QuessSJagdDoga053],
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [destroyerId, sourceId] = p1.getCardsInZone("battleArea");

    expectSuccess(p1.activateAbility(destroyerId!, 0));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: [sourceId],
    });
    expectSuccess(p1.resolveEffect({ targets: [sourceId!] }));

    expect(p1.getCardZone(sourceId!)).toBe(`hand:${PLAYER_ONE}`);
  });

  it("stays in trash when destroyed by a friendly card without the Neo Zeon trait", () => {
    const destroyer = createMockUnit({
      traits: ["earth federation"],
      effects: [
        {
          type: "activated",
          activation: { timing: ["activate:main"] },
          directives: [
            {
              action: {
                action: "destroy",
                target: { owner: "friendly", cardType: "unit", excludeSource: true, count: 1 },
              },
            },
          ],
          sourceText: "【Activate･Main】Choose 1 of your other Units. Destroy it.",
        },
      ],
    });
    const engine = GundamTestEngine.create({ play: [destroyer, gd05QuessSJagdDoga053] });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [destroyerId, sourceId] = p1.getCardsInZone("battleArea");

    expectSuccess(p1.activateAbility(destroyerId!, 0, { targets: [sourceId!] }));

    expect(p1.getCardZone(sourceId!)).toBe(`trash:${PLAYER_ONE}`);
  });
});
