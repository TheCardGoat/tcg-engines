import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockPilot,
  createMockUnit,
  expectSuccess,
  getEffectiveStats,
} from "@tcg/gundam-engine";
import { gd04VictoryGundamHexa007 } from "./007-victory-gundam-hexa.ts";

describe("Victory Gundam Hexa (GD04-007)", () => {
  it("deploys a Parts token with the no-direct-attack restriction when paired and attacking", () => {
    const leaguePilot = createMockPilot({
      name: "League Militaire Pilot",
      traits: ["league militaire"],
      level: 1,
      cost: 1,
    });
    const defender = createMockUnit({ name: "Rested Defender", ap: 1, hp: 8 });
    const engine = GundamTestEngine.create(
      {
        hand: [leaguePilot],
        play: [gd04VictoryGundamHexa007],
        resourceArea: activeResources(1),
      },
      { play: [{ card: defender, exhausted: true }] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [hexaId] = p1.getCardsInZone("battleArea");
    const [defenderId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.assignPilot(leaguePilot, hexaId!));
    expectSuccess(p1.enterBattle(hexaId!, defenderId!));

    const partsId = p1.getCardsInZone("battleArea").at(-1)!;
    const framework = engine.getRuntime().getFrameworkReadAPI();
    expect(framework.cards.getDefinition(partsId)?.name).toBe("Parts");
    expect(
      getEffectiveStats(partsId, engine.getG(), framework.cards, framework).restrictions,
    ).toContain("cannot-target-player");
  });

  it("does not deploy the Parts token when unpaired", () => {
    const defender = createMockUnit({ name: "Rested Defender", ap: 1, hp: 8 });
    const engine = GundamTestEngine.create(
      { play: [gd04VictoryGundamHexa007] },
      { play: [{ card: defender, exhausted: true }] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [hexaId] = p1.getCardsInZone("battleArea");
    const [defenderId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.enterBattle(hexaId!, defenderId!));

    expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
  });
});
