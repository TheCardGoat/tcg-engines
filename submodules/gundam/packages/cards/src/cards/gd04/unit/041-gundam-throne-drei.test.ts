import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockCommand,
  expectSuccess,
} from "@tcg/gundam-engine";
import type { CommandCard } from "@tcg/gundam-types";
import { gd04GundamThroneDrei041 } from "./041-gundam-throne-drei.ts";

function restFriendlyCommand(): CommandCard {
  return createMockCommand({
    effects: [
      {
        type: "command",
        activation: { timing: ["main"] },
        directives: [
          {
            action: {
              action: "rest",
              target: { owner: "friendly", cardType: "unit", count: 1 },
            },
          },
        ],
        sourceText: "【Main】Rest 1 friendly Unit.",
      },
    ],
  });
}

describe("Gundam Throne Drei (GD04-041)", () => {
  it("data triggers on any effect that rests this Unit", () => {
    expect(gd04GundamThroneDrei041.effects?.[0]?.activation.timing).toEqual(["onRestedByEffect"]);
  });

  describe("【Once per Turn】When this Unit is rested by an effect, set it as active.", () => {
    it("sets itself active after a friendly effect rests it", () => {
      const command = restFriendlyCommand();
      const engine = GundamTestEngine.create({
        hand: [command],
        play: [gd04GundamThroneDrei041],
        resourceArea: activeResources(5),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const throneId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.playCommand(command, { targets: [throneId] }));

      expect(p1.isExhausted(throneId)).toBe(false);
    });

    it("applies only once per turn", () => {
      const commandA = restFriendlyCommand();
      const commandB = restFriendlyCommand();
      const engine = GundamTestEngine.create({
        hand: [commandA, commandB],
        play: [gd04GundamThroneDrei041],
        resourceArea: activeResources(5),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const throneId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.playCommand(commandA, { targets: [throneId] }));
      expect(p1.isExhausted(throneId)).toBe(false);
      expectSuccess(p1.playCommand(commandB, { targets: [throneId] }));

      expect(p1.isExhausted(throneId)).toBe(true);
    });
  });
});
