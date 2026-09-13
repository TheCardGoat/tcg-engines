import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  createMockCommand,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { expectBaseBurstAndDeployAbilities } from "../../../test-helpers/base-behavior-test-helpers.ts";
import { gd05Axis129 } from "./129-axis.ts";

describe("Axis (GD05-129)", () => {
  it("executes its Burst deployment and Deploy Shield ability", () => {
    expectBaseBurstAndDeployAbilities(gd05Axis129);
  });

  describe("【Activate･Main】Rest this Base：If one of your Units has been destroyed by one of your (Neo Zeon) card's effects during this turn, deploy 1 (Neo Zeon) Unit card that is Lv.3 or lower from your hand.", () => {
    function neoZeonDestroyCommand() {
      return createMockCommand({
        name: "Neo Zeon Destruction",
        traits: ["neo zeon"],
        level: 0,
        cost: 0,
        effects: [
          {
            type: "command",
            activation: { timing: ["main"] },
            directives: [
              {
                action: {
                  action: "destroy",
                  target: { owner: "friendly", cardType: "unit", count: 1 },
                },
              },
            ],
            sourceText: "【Main】Destroy 1 friendly Unit.",
          },
        ],
      });
    }

    it("rests Axis and deploys the qualifying Unit after the required friendly effect destruction", () => {
      const destroy = neoZeonDestroyCommand();
      const victim = createMockUnit({ name: "Friendly Victim", hp: 5 });
      const deployable = createMockUnit({
        name: "Neo Zeon Reinforcement",
        traits: ["neo zeon"],
        level: 3,
      });
      const engine = GundamTestEngine.create({
        hand: [destroy, deployable],
        play: [victim],
        baseSection: [gd05Axis129],
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const victimId = p1.getCardsInZone("battleArea")[0]!;
      const axisId = p1.getCardsInZone("baseSection")[0]!;
      const deployableId = p1.getHand().find((id) => id !== p1.getHand()[0])!;

      expectSuccess(p1.playCommand(destroy));
      expectSuccess(p1.resolveEffect({ targets: [victimId] }));
      expectSuccess(p1.activateBaseAbility(axisId));
      expectSuccess(p1.resolveEffect({ targets: [deployableId] }));

      expect(p1.isExhausted(axisId)).toBe(true);
      expect(p1.getCardZone(deployableId)).toBe(`battleArea:${PLAYER_ONE}`);
    });

    it("cannot activate before a friendly Unit is destroyed by a friendly Neo Zeon effect", () => {
      const deployable = createMockUnit({
        name: "Neo Zeon Reinforcement",
        traits: ["neo zeon"],
        level: 3,
      });
      const engine = GundamTestEngine.create({ hand: [deployable], baseSection: [gd05Axis129] });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const axisId = p1.getCardsInZone("baseSection")[0]!;

      expectFailure(p1.activateBaseAbility(axisId), "CONDITIONS_NOT_MET");
      expect(p1.isExhausted(axisId)).toBe(false);
    });
  });
});
