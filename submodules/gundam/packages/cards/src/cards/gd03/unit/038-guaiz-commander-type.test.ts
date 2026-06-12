import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockCommand,
  createMockUnit,
  expectSuccess,
  findStatModifier,
  getEffectiveStats,
} from "@tcg/gundam-engine";
import type { CommandCard } from "@tcg/gundam-types";
import { gd03GuaizCommanderType038 } from "./038-guaiz-commander-type.ts";

function restCommand(owner: "friendly" | "opponent"): CommandCard {
  return createMockCommand({
    effects: [
      {
        type: "command",
        activation: { timing: ["main"] },
        directives: [
          {
            action: {
              action: "rest",
              target: { owner, cardType: "unit", count: 1 },
            },
          },
        ],
        sourceText: "【Main】Rest 1 Unit.",
      },
    ],
  });
}

describe("GuAIZ (Commander Type) (GD03-038)", () => {
  it("【Activate･Main】 Support 1 rests this Unit and gives 1 other friendly Unit AP+1", () => {
    const ally = createMockUnit({ ap: 2 });
    const engine = GundamTestEngine.create({ play: [gd03GuaizCommanderType038, ally] });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [guaizId, allyId] = p1.getCardsInZone("battleArea");

    expectSuccess(p1.useSupport(guaizId!, allyId!));

    expect(engine.getG().exhausted[guaizId!]).toBe(true);
    expect(findStatModifier(engine, allyId!, "ap")?.modifier).toBe(1);
  });

  describe("During your turn, when this Unit is rested by an effect, choose 1 of your (ZAFT) Units. It gets AP+2 during this turn.", () => {
    function effectiveAp(engine: GundamTestEngine, cardId: string): number {
      const framework = engine.getRuntime().getFrameworkReadAPI();
      return getEffectiveStats(cardId, engine.getG(), framework.cards, framework).ap;
    }

    it("gives a friendly ZAFT Unit AP+2 when GuAIZ is rested by an effect during your turn", () => {
      const command = restCommand("friendly");
      const zaftAlly = createMockUnit({ traits: ["zaft"], ap: 2 });
      const engine = GundamTestEngine.create({
        hand: [command],
        play: [gd03GuaizCommanderType038, zaftAlly],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [guaizId] = p1.getCardsInZone("battleArea");

      expectSuccess(p1.playCommand(command, { targets: [guaizId!] }));

      expect(effectiveAp(engine, guaizId!)).toBe(6);
    });

    it("does not trigger when GuAIZ is rested during the opponent's turn", () => {
      const command = restCommand("opponent");
      const zaftAlly = createMockUnit({ traits: ["zaft"], ap: 2 });
      const engine = GundamTestEngine.create(
        { play: [gd03GuaizCommanderType038, zaftAlly] },
        { hand: [command], resourceArea: activeResources(4) },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [guaizId, zaftId] = p1.getCardsInZone("battleArea");

      expectSuccess(p2.playCommand(command, { targets: [guaizId!] }));

      expect(effectiveAp(engine, zaftId!)).toBe(2);
    });
  });
});
