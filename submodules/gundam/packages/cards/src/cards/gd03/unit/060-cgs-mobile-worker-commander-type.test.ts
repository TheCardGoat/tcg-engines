import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockCommand,
  expectSuccess,
} from "@tcg/gundam-engine";
import type { CommandCard } from "@tcg/gundam-types";
import { gd03CgsMobileWorkerCommanderType060 } from "./060-cgs-mobile-worker-commander-type.ts";

function damageCommand(owner: "friendly" | "opponent"): CommandCard {
  return createMockCommand({
    name: `Damage ${owner}`,
    effects: [
      {
        type: "command",
        activation: { timing: ["main"] },
        directives: [
          {
            action: {
              action: "dealDamage",
              amount: 1,
              target: { owner, cardType: "unit", count: 1 },
            },
          },
        ],
        sourceText: "【Main】Deal 1 damage to a Unit.",
      },
    ],
  });
}

describe("CGS Mobile Worker (Commander Type) (GD03-060)", () => {
  describe("【Once per Turn】During your turn, when this Unit receives effect damage, deploy 1 rested [CGS Mobile Worker]((Tekkadan)･AP1･HP1) Unit token.", () => {
    function tokenIds(engine: GundamTestEngine, commanderId: string) {
      return engine
        .asPlayer(PLAYER_ONE)
        .getCardsInZone("battleArea")
        .filter((id) => id !== commanderId);
    }

    it("deploys a rested CGS Mobile Worker token when it receives effect damage during your turn", () => {
      const command = damageCommand("friendly");
      const engine = GundamTestEngine.create({
        hand: [command],
        play: [gd03CgsMobileWorkerCommanderType060],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const commanderId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.playCommand(command, { targets: [commanderId] }));

      const [tokenId] = tokenIds(engine, commanderId);
      const token = engine.getRuntime().getFrameworkReadAPI().cards.getDefinition(tokenId!);
      expect(token?.name).toBe("CGS Mobile Worker");
      expect(token?.traits).toContain("tekkadan");
      expect(engine.getG().exhausted[tokenId!]).toBe(true);
    });

    it("does not deploy a token when it receives effect damage during the opponent's turn", () => {
      const command = damageCommand("opponent");
      const engine = GundamTestEngine.create(
        { play: [gd03CgsMobileWorkerCommanderType060] },
        { hand: [command], resourceArea: activeResources(3) },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const commanderId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p2.playCommand(command, { targets: [commanderId] }));

      expect(tokenIds(engine, commanderId)).toHaveLength(0);
    });

    it("deploys only once per turn", () => {
      const commandA = damageCommand("friendly");
      const commandB = damageCommand("friendly");
      const engine = GundamTestEngine.create({
        hand: [commandA, commandB],
        play: [gd03CgsMobileWorkerCommanderType060],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const commanderId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.playCommand(commandA, { targets: [commanderId] }));
      expectSuccess(p1.playCommand(commandB, { targets: [commanderId] }));

      expect(tokenIds(engine, commanderId)).toHaveLength(1);
    });
  });
});
