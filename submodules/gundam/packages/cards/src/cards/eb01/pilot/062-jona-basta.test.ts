import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { expectPilotBurstAddsToHand } from "../../../test-helpers/pilot-behavior-test-helpers.ts";
import { eb01JonaBasta062 } from "./062-jona-basta.ts";

describe("Jona Basta (EB01-062)", () => {
  it("executes its Burst and pairs through public moves", () => {
    expectPilotBurstAddsToHand(eb01JonaBasta062);
    const unit = createMockUnit({ ap: 2, hp: 4 });
    const engine = GundamTestEngine.create({
      hand: [eb01JonaBasta062],
      play: [unit],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const unitId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(eb01JonaBasta062, unitId));
    expect(p1.getPilotId(unitId)).toBeDefined();
  });

  it("lets the enemy decide whether to draw, then draws for its controller only if they do", () => {
    const host = createMockUnit({ ap: 2, hp: 4 });
    const enemy = createMockUnit({ ap: 0, hp: 4 });
    const engine = GundamTestEngine.create(
      {
        hand: [eb01JonaBasta062],
        play: [host],
        resourceArea: activeResources(4),
        deck: 3,
      },
      { play: [{ card: enemy, exhausted: true }], deck: 3 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const hostId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(eb01JonaBasta062, hostId));
    expectSuccess(p1.enterBattle(hostId, enemyId));
    const choice = p2.getBoardView().pendingChoice;
    if (choice?.kind !== "optional") throw new Error("Expected the enemy's visible draw choice");
    expect(choice.controllerId).toBe(PLAYER_TWO);
    expectSuccess(p2.resolveEffect({ optionalAnswers: { [choice.directiveIndex]: true } }));

    expect(p1.getBoardView().players[PLAYER_ONE]?.deckCount).toBe(2);
    expect(p2.getBoardView().players[PLAYER_TWO]?.deckCount).toBe(2);
  });

  it("does not draw for either player when the enemy declines", () => {
    const host = createMockUnit({ ap: 2, hp: 4 });
    const enemy = createMockUnit({ ap: 0, hp: 4 });
    const engine = GundamTestEngine.create(
      {
        hand: [eb01JonaBasta062],
        play: [host],
        resourceArea: activeResources(4),
        deck: 3,
      },
      { play: [{ card: enemy, exhausted: true }], deck: 3 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const hostId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(eb01JonaBasta062, hostId));
    expectSuccess(p1.enterBattle(hostId, enemyId));
    const choice = p2.getBoardView().pendingChoice;
    if (choice?.kind !== "optional") throw new Error("Expected the enemy's visible draw choice");
    expectSuccess(p2.resolveEffect({ optionalAnswers: { [choice.directiveIndex]: false } }));

    expect(p1.getBoardView().players[PLAYER_ONE]?.deckCount).toBe(3);
    expect(p2.getBoardView().players[PLAYER_TWO]?.deckCount).toBe(3);
  });
});
