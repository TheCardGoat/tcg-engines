import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd01ZeeZulu059 } from "./059-zee-zulu.ts";
import {
  passTurnThroughPublicMoves,
  restUnitsByAttackingDirectly,
} from "../../../test-helpers/legal-gameplay-test-helpers.ts";

describe("Zee Zulu (GD01-059)", () => {
  it("shows AP+2 while attacking the enemy player", () => {
    const engine = GundamTestEngine.create({ play: [gd01ZeeZulu059], deck: 5 }, { deck: 5 });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const zeeZuluId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(zeeZuluId, "direct"));

    expect(p1.getVisibleCard(zeeZuluId)?.effectiveAp).toBe(4);
  });

  it("keeps its printed AP while attacking an enemy Unit", () => {
    const enemy = createMockUnit({ hp: 6 });
    const engine = GundamTestEngine.create(
      {
        deck: 2,
        play: [gd01ZeeZulu059],
        shieldArea: [createMockUnit({ name: "Opening Shield" })],
      },
      { play: [enemy] },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const zeeZuluId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    restUnitsByAttackingDirectly(engine, PLAYER_TWO, [enemyId]);
    passTurnThroughPublicMoves(engine, PLAYER_TWO);

    expectSuccess(p1.enterBattle(zeeZuluId, enemyId));

    expect(p1.getVisibleCard(zeeZuluId)?.effectiveAp).toBe(2);
  });
});
