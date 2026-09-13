import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockCommand,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd05NotWithScattershot103 } from "./103-not-with-scattershot.ts";

describe("Not with Scattershot (GD05-103)", () => {
  it("recovers 1 HP and grants AP+2 to the chosen friendly Unit", () => {
    const damage = createMockCommand({
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
                amount: 1,
                target: { owner: "friendly", cardType: "unit", count: 1 },
              },
            },
          ],
          sourceText: "Deal 1 damage to a friendly Unit.",
        },
      ],
    });
    const engine = GundamTestEngine.create({
      hand: [damage, gd05NotWithScattershot103],
      play: [createMockUnit({ ap: 3, hp: 5 })],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [damageId, commandId] = p1.getHand();
    const unitId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.playCommand(damageId!));
    expectSuccess(p1.resolveEffect({ targets: [unitId] }));
    expectSuccess(p1.playCommand(commandId!));
    expectSuccess(p1.resolveEffect({ targets: [unitId] }));

    expect(p1.getDamage(unitId)).toBe(0);
    expect(p1.getVisibleCard(unitId)).toMatchObject({ effectiveAp: 5 });
  });

  it("can be played during the Action step and keeps the same target and effect", () => {
    const engine = GundamTestEngine.create(
      {
        hand: [gd05NotWithScattershot103],
        play: [{ card: createMockUnit({ ap: 3, hp: 5 }), damage: 1 }],
        resourceArea: activeResources(4),
      },
      { deck: 3 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const unitId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.playCommand(gd05NotWithScattershot103));
    expectSuccess(p1.resolveEffect({ targets: [unitId] }));

    expect(p1.getDamage(unitId)).toBe(0);
    expect(p1.getVisibleCard(unitId)).toMatchObject({ effectiveAp: 5 });
  });
});
