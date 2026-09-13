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
import { eb01GerberaStraight076 } from "./076-gerbera-straight.ts";

describe("Gerbera Straight (EB01-076)", () => {
  it("recovers 3 HP from a friendly G Generation Unit", () => {
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
                amount: 3,
                target: { owner: "friendly", cardType: "unit", count: 1 },
              },
            },
          ],
          sourceText: "Deal 3 damage to a friendly Unit.",
        },
      ],
    });
    const engine = GundamTestEngine.create({
      hand: [damage, eb01GerberaStraight076],
      play: [createMockUnit({ hp: 5, traits: ["g generation"] })],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [damageId, commandId] = p1.getHand();
    const unitId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.playCommand(damageId!));
    expectSuccess(p1.resolveEffect({ targets: [unitId] }));
    expect(p1.getDamage(unitId)).toBe(3);
    expectSuccess(p1.playCommand(commandId!));
    expectSuccess(p1.resolveEffect({ targets: [unitId] }));

    expect(p1.getDamage(unitId)).toBe(0);
  });

  it("can recover a friendly G Generation Unit during the Action step", () => {
    const engine = GundamTestEngine.create(
      {
        hand: [eb01GerberaStraight076],
        play: [{ card: createMockUnit({ hp: 5, traits: ["g generation"] }), damage: 2 }],
        resourceArea: activeResources(4),
      },
      { deck: 3 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const unitId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.playCommand(eb01GerberaStraight076));
    expectSuccess(p1.resolveEffect({ targets: [unitId] }));
    expect(p1.getDamage(unitId)).toBe(0);
  });
});
