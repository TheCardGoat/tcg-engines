import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectFailure,
  expectSuccess,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import { st07ArmedIntervention013 } from "./013-armed-intervention.ts";

describe("Armed Intervention (ST07-013)", () => {
  it("【Burst】Draw 1.", () => {
    const engine = GundamTestEngine.create(
      {},
      { deck: [st07ArmedIntervention013, createMockUnit()] },
    );
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_TWO, 1);
    if (!shieldId) throw new Error("seed failed");
    const handBefore = engine.asPlayer(PLAYER_TWO).getHand().length;

    engine.fireShieldBurst(shieldId);

    expect(engine.asPlayer(PLAYER_TWO).getHand().length).toBe(handBefore + 1);
  });

  it("【Action】changes the battling enemy Unit's attack target to a rested friendly CB Unit", () => {
    const attacker = createMockUnit({ level: 4, ap: 3 });
    const cbTarget = createMockUnit({ traits: ["cb"], hp: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [st07ArmedIntervention013],
        resourceArea: activeResources(4),
        play: [{ card: cbTarget, exhausted: true }],
        deck: 5,
      },
      { play: [attacker], deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    engine.endTurn();
    const attackerId = p2.getCardsInZone("battleArea")[0]!;
    const targetId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p2.enterBattle(attackerId, "direct"));
    expectSuccess(p1.passBlock());
    expectSuccess(p1.playCommand(st07ArmedIntervention013, { targets: [targetId] }));

    expect(engine.getG().turnMetadata.pendingCombat?.target).toBe(targetId);
  });

  it("cannot choose an active friendly CB Unit as the new attack target", () => {
    const attacker = createMockUnit({ level: 4, ap: 3 });
    const cbTarget = createMockUnit({ traits: ["cb"], hp: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [st07ArmedIntervention013],
        resourceArea: activeResources(4),
        play: [cbTarget],
        deck: 5,
      },
      { play: [attacker], deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    engine.endTurn();
    const attackerId = p2.getCardsInZone("battleArea")[0]!;
    const targetId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p2.enterBattle(attackerId, "direct"));
    expectSuccess(p1.passBlock());

    expectFailure(
      p1.playCommand(st07ArmedIntervention013, { targets: [targetId] }),
      "INVALID_TARGET",
    );
  });
});
