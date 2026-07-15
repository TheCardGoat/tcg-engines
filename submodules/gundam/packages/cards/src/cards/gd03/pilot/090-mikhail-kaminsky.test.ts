import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd03MikhailKaminsky090 } from "./090-mikhail-kaminsky.ts";

describe("Mikhail Kaminsky (GD03-090)", () => {
  it("【Burst】 adds this revealed Shield to its owner's hand", () => {
    const attacker = createMockUnit({ name: "Enemy Attacker", ap: 1, hp: 4 });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { shieldArea: [gd03MikhailKaminsky090] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(attackerId, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    expectSuccess(p2.resolveEffect({ optionalAnswers: { [-1]: true } }));

    expect(p2.getCardZone(gd03MikhailKaminsky090)).toBe(`hand:${PLAYER_TWO}`);
  });

  it("【Attack】 grants Breach 1 to the chosen friendly Cyclops Team Unit for that battle", () => {
    const host = createMockUnit({ ap: 3, hp: 5, traits: ["cyclops team"] });
    const defender = createMockUnit({ ap: 0, hp: 5 });
    const shield = createMockUnit({ name: "Enemy Shield" });
    const engine = GundamTestEngine.create(
      {
        hand: [gd03MikhailKaminsky090],
        play: [host],
        resourceArea: activeResources(4),
      },
      { play: [{ card: defender, exhausted: true }], shieldArea: [shield] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const hostId = p1.getCardsInZone("battleArea")[0]!;
    const defenderId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(gd03MikhailKaminsky090, hostId));
    expectSuccess(p1.enterBattle(hostId, defenderId));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: [hostId],
    });
    expectSuccess(p1.resolveEffect({ targets: [hostId] }));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    expect(p2.getCardZone(defenderId)).toBe(`trash:${PLAYER_TWO}`);
    expect(p2.getBoardView().players[PLAYER_TWO]?.shieldCount).toBe(0);
    expect(p2.getCardsInZone("trash")).toHaveLength(2);
  });

  it("does not offer a friendly Unit without the Cyclops Team trait", () => {
    const host = createMockUnit({ ap: 3, hp: 5, traits: ["zeon"] });
    const defender = createMockUnit({ ap: 0, hp: 5 });
    const shield = createMockUnit({ name: "Enemy Shield" });
    const engine = GundamTestEngine.create(
      {
        hand: [gd03MikhailKaminsky090],
        play: [host],
        resourceArea: activeResources(4),
      },
      { play: [{ card: defender, exhausted: true }], shieldArea: [shield] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const hostId = p1.getCardsInZone("battleArea")[0]!;
    const defenderId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(gd03MikhailKaminsky090, hostId));
    expectSuccess(p1.enterBattle(hostId, defenderId));
    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    expect(p2.getBoardView().players[PLAYER_TWO]?.shieldCount).toBe(1);
  });
});
