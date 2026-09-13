import { describe, expect, it } from "vite-plus/test";
import {
  activeResources,
  createMockPilot,
  createMockResource,
  createMockUnit,
  expectSuccess,
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
} from "@tcg/gundam-engine";
import {
  acceptDevelopment,
  expectDevelopmentExiled,
} from "../../../test-helpers/development-behavior-test-helpers.ts";
import { passTurnThroughPublicMoves } from "../../../test-helpers/legal-gameplay-test-helpers.ts";
import { eb01Tallgeese025 } from "./025-tallgeese.ts";

describe("Tallgeese (EB01-025)", () => {
  it("【Deploy・Development 2】 exiles two G Generation cards and gives each player an active EX Resource", () => {
    const development = Array.from({ length: 2 }, () =>
      createMockUnit({ traits: ["g generation"] }),
    );
    const engine = GundamTestEngine.create(
      {
        hand: [eb01Tallgeese025],
        trash: development,
        resourceArea: activeResources(6),
      },
      {},
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const p1Before = p1.getCardsInZone("resourceArea");
    const p2Before = p2.getCardsInZone("resourceArea");
    const developmentIds = p1.getCardsInZone("trash");

    expectSuccess(p1.deployUnit(eb01Tallgeese025));
    acceptDevelopment(p1, developmentIds);
    expectDevelopmentExiled(p1, developmentIds);

    const p1Placed = p1.getCardsInZone("resourceArea").filter((id) => !p1Before.includes(id));
    const p2Placed = p2.getCardsInZone("resourceArea").filter((id) => !p2Before.includes(id));
    expect(p1Placed).toHaveLength(1);
    expect(p2Placed).toHaveLength(1);
    expect(p1.isExhausted(p1Placed[0]!)).toBe(false);
    expect(p2.isExhausted(p2Placed[0]!)).toBe(false);
  });

  it("while paired and the opponent has an EX Resource, prevents battle damage from an enemy Lv.5 Unit", () => {
    const pilot = createMockPilot({ level: 0, cost: 0 });
    const attacker = createMockUnit({ level: 5, ap: 5, hp: 6 });
    const engine = GundamTestEngine.create(
      {
        hand: [pilot],
        play: [{ card: eb01Tallgeese025, exhausted: true }],
        resourceArea: activeResources(6),
        deck: 3,
      },
      {
        play: [attacker],
        resourceArea: [createMockResource({ name: "EX Resource" })],
        deck: 3,
      },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const tallgeeseId = p1.getCardsInZone("battleArea")[0]!;
    const attackerId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(pilot, tallgeeseId));
    passTurnThroughPublicMoves(engine, PLAYER_ONE);
    expectSuccess(p2.enterBattle(attackerId, tallgeeseId));
    expectSuccess(p1.passBlock());
    expectSuccess(p1.passBattleAction());
    expectSuccess(p2.passBattleAction());

    expect(p1.getCardZone(tallgeeseId)).toBe(`battleArea:${PLAYER_ONE}`);
    expect(p1.getDamage(tallgeeseId)).toBe(0);
  });

  it("does not prevent battle damage from an enemy Lv.6 Unit", () => {
    const pilot = createMockPilot({ level: 0, cost: 0 });
    const attacker = createMockUnit({ level: 6, ap: 5, hp: 6 });
    const engine = GundamTestEngine.create(
      {
        hand: [pilot],
        play: [{ card: eb01Tallgeese025, exhausted: true }],
        resourceArea: activeResources(6),
        deck: 3,
      },
      {
        play: [attacker],
        resourceArea: [createMockResource({ name: "EX Resource" })],
        deck: 3,
      },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const tallgeeseId = p1.getCardsInZone("battleArea")[0]!;
    const attackerId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(pilot, tallgeeseId));
    passTurnThroughPublicMoves(engine, PLAYER_ONE);
    expectSuccess(p2.enterBattle(attackerId, tallgeeseId));
    expectSuccess(p1.passBlock());
    expectSuccess(p1.passBattleAction());
    expectSuccess(p2.passBattleAction());

    expect(p1.getCardZone(tallgeeseId)).toBe(`trash:${PLAYER_ONE}`);
  });
});
