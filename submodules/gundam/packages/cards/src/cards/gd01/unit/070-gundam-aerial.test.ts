import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockCommand,
  createMockPilot,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd01GundamAerial070 } from "./070-gundam-aerial.ts";
import {
  passTurnThroughPublicMoves,
  restUnitsByAttackingDirectly,
} from "../../../test-helpers/legal-gameplay-test-helpers.ts";

describe("Gundam Aerial (GD01-070)", () => {
  it("costs 1 with four Commands in trash, links with Suletta, and attacks on the deployment turn", () => {
    const suletta = createMockPilot({ name: "Suletta Mercury", level: 1, cost: 1 });
    const enemy = createMockUnit({ hp: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd01GundamAerial070, suletta],
        deck: 2,
        trash: [createMockCommand(), createMockCommand(), createMockCommand(), createMockCommand()],
        resourceArea: activeResources(5),
        shieldArea: [createMockUnit({ name: "Opening Shield" })],
      },
      { play: [enemy] },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

    restUnitsByAttackingDirectly(engine, PLAYER_TWO, [enemyId]);
    passTurnThroughPublicMoves(engine, PLAYER_TWO);

    expectSuccess(p1.deployUnit(gd01GundamAerial070));
    const aerialId = p1.getCardsInZone("battleArea")[0]!;
    expect(p1.getCardsInZone("resourceArea").filter((id) => p1.isExhausted(id))).toHaveLength(1);
    expectSuccess(p1.assignPilot(suletta, aerialId));

    expectSuccess(p1.enterBattle(aerialId, enemyId));
  });

  it("requires the printed cost when fewer than four Commands are in trash", () => {
    const priorDeployment = createMockUnit({ name: "Prior Deployment", level: 1, cost: 4 });
    const engine = GundamTestEngine.create({
      hand: [priorDeployment, gd01GundamAerial070],
      trash: [createMockCommand(), createMockCommand(), createMockCommand()],
      resourceArea: activeResources(5),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployUnit(priorDeployment));
    expectFailure(p1.deployUnit(gd01GundamAerial070), "INSUFFICIENT_RESOURCES");

    expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    expect(p1.getBoardView().players[PLAYER_ONE]?.handCount).toBe(1);
  });
});
