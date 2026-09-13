import type { CardEffect } from "@tcg/gundam-types";
import { describe, expect, it } from "vite-plus/test";
import {
  createMockCommand,
  createMockUnit,
  expectSuccess,
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
} from "@tcg/gundam-engine";
import { eb01GundamAstrayBlueFrameSecondL018 } from "./018-gundam-astray-blue-frame-second-l.ts";

describe("Gundam Astray Blue Frame Second L (EB01-018)", () => {
  it("【Attack】 recovers exactly 1 HP from the chosen friendly Unit", () => {
    const ally = createMockUnit({ name: "Damaged Ally", hp: 5 });
    const enemy = createMockUnit({ name: "Damaged Enemy", hp: 5 });
    const damageCommand = createMockCommand({
      level: 0,
      cost: 0,
      effects: [
        {
          type: "command",
          activation: { timing: ["main"] },
          directives: [
            {
              action: {
                action: "dealDamage",
                amount: 2,
                target: { owner: "friendly", cardType: "unit", count: 1 },
              },
            },
          ],
          sourceText: "Choose 1 friendly Unit. Deal 2 damage to it.",
        },
      ] as CardEffect[],
    });
    const engine = GundamTestEngine.create(
      {
        hand: [damageCommand],
        play: [eb01GundamAstrayBlueFrameSecondL018, ally],
      },
      {
        play: [enemy],
        shieldArea: [createMockUnit({ name: "Enemy Shield" })],
      },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [sourceId, allyId] = p1.getCardsInZone("battleArea");
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.playCommand(damageCommand, { targets: [allyId!] }));
    expect(p1.getDamage(allyId!)).toBe(2);

    expectSuccess(p1.enterBattle(sourceId!, "direct"));
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "targetSelection") throw new Error("Expected target selection");
    expect(choice.legalTargetIds).toEqual(expect.arrayContaining([sourceId, allyId]));
    expect(choice.legalTargetIds).not.toContain(enemyId);
    expectSuccess(p1.resolveEffect({ targets: [allyId!] }));

    expect(p1.getDamage(allyId!)).toBe(1);
  });
});
