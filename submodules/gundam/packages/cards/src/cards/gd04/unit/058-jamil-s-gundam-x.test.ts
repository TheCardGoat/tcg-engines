import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockCommand,
  createMockPilot,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd04JamilSGundamX058 } from "./058-jamil-s-gundam-x.ts";

function destroyCommand(owner: "friendly" | "opponent") {
  return createMockCommand({
    name: `Destroy ${owner} Unit`,
    level: 1,
    cost: 1,
    effects: [
      {
        type: "command",
        activation: { timing: ["main"] },
        directives: [
          {
            action: {
              action: "destroy",
              target: { owner, cardType: "unit", count: 1 },
            },
          },
        ],
        sourceText: `【Main】Destroy 1 ${owner} Unit.`,
      },
    ],
  });
}

describe("Jamil's Gundam X (GD04-058)", () => {
  describe("【During Pair･(Vulture) Pilot】【Destroyed】If it is your turn, return this Unit's paired Pilot to its owner's hand.", () => {
    it("returns its paired Vulture Pilot when a played effect destroys it on its controller's turn", () => {
      const vulturePilot = createMockPilot({ traits: ["vulture"], cost: 1 });
      const command = destroyCommand("friendly");
      const engine = GundamTestEngine.create({
        hand: [vulturePilot, command],
        play: [gd04JamilSGundamX058],
        resourceArea: activeResources(2),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const unitId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(vulturePilot, unitId));
      const pilotId = p1.getPilotId(unitId)!;
      expectSuccess(p1.playCommand(command, { targets: [unitId] }));

      expect(p1.getCardZone(unitId)).toBe(`trash:${PLAYER_ONE}`);
      expect(p1.getCardZone(pilotId)).toBe(`hand:${PLAYER_ONE}`);
      expect(p1.getPilotId(unitId)).toBeUndefined();
    });

    it("lets a non-Vulture paired Pilot follow the destroyed Unit to trash", () => {
      const wrongPilot = createMockPilot({ traits: ["newtype"], cost: 1 });
      const command = destroyCommand("friendly");
      const engine = GundamTestEngine.create({
        hand: [wrongPilot, command],
        play: [gd04JamilSGundamX058],
        resourceArea: activeResources(2),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const unitId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(wrongPilot, unitId));
      const pilotId = p1.getPilotId(unitId)!;
      expectSuccess(p1.playCommand(command, { targets: [unitId] }));

      expect(p1.getCardZone(unitId)).toBe(`trash:${PLAYER_ONE}`);
      expect(p1.getCardZone(pilotId)).toBe(`trash:${PLAYER_ONE}`);
      expect(p1.getPilotId(unitId)).toBeUndefined();
    });

    it("lets the paired Vulture Pilot follow the Unit to trash when an opponent destroys it", () => {
      const vulturePilot = createMockPilot({ traits: ["vulture"], cost: 1 });
      const enemyCommand = destroyCommand("opponent");
      const engine = GundamTestEngine.create(
        {
          hand: [vulturePilot],
          deck: 2,
          play: [gd04JamilSGundamX058],
          resourceArea: activeResources(1),
        },
        {
          hand: [enemyCommand],
          deck: 2,
          resourceArea: activeResources(1),
        },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const unitId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(vulturePilot, unitId));
      const pilotId = p1.getPilotId(unitId)!;
      expectSuccess(p1.passPhase());
      expectSuccess(p2.passActionStep());
      expectSuccess(p1.passActionStep());
      expectSuccess(p2.playCommand(enemyCommand, { targets: [unitId] }));

      expect(p1.getCardZone(unitId)).toBe(`trash:${PLAYER_ONE}`);
      expect(p1.getCardZone(pilotId)).toBe(`trash:${PLAYER_ONE}`);
      expect(p1.getPilotId(unitId)).toBeUndefined();
    });
  });
});
