import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockCommand,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { expectPilotBurstAddsToHand } from "../../../test-helpers/pilot-behavior-test-helpers.ts";
import { gd05QuessParaya094 } from "./094-quess-paraya.ts";

describe("Quess Paraya (GD05-094)", () => {
  /** @behavioral-proof complete: Burst retrieval, Destroyed timing, friendly Neo Zeon target gate, visible selection, battle-only reduction, and exact damage result are public. */
  it("executes its Burst and pairs through public moves", () => {
    expectPilotBurstAddsToHand(gd05QuessParaya094);
    const unit = createMockUnit({ ap: 2, hp: 4 });
    const engine = GundamTestEngine.create({
      hand: [gd05QuessParaya094],
      play: [unit],
      resourceArea: activeResources(3),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const unitId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(gd05QuessParaya094, unitId));
    expect(p1.getPilotId(unitId)).toBeDefined();
  });

  it("reduces each enemy battle damage event to the chosen Neo Zeon Unit by 2 after being destroyed", () => {
    const destroyHost = createMockCommand({
      name: "Destroy Host",
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
                target: { owner: "opponent", cardType: "unit", count: 1 },
              },
            },
          ],
          sourceText: "【Main】Destroy 1 enemy Unit.",
        },
      ],
    });
    const host = createMockUnit({ name: "Quess Host", hp: 4 });
    const neoZeonAlly = createMockUnit({ name: "Neo Zeon Ally", traits: ["neo zeon"], hp: 6 });
    const outsider = createMockUnit({ name: "Outsider", traits: ["earth federation"], hp: 6 });
    const firstAttacker = createMockUnit({ name: "First Enemy Attacker", ap: 3, hp: 6 });
    const secondAttacker = createMockUnit({ name: "Second Enemy Attacker", ap: 3, hp: 6 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd05QuessParaya094],
        play: [host, { card: neoZeonAlly, exhausted: true }, outsider],
        resourceArea: activeResources(3),
        deck: 3,
      },
      {
        hand: [destroyHost],
        play: [firstAttacker, secondAttacker],
        resourceArea: activeResources(1),
        deck: 3,
      },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [hostId, neoZeonId, outsiderId] = p1.getCardsInZone("battleArea");
    const [firstAttackerId, secondAttackerId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.assignPilot(gd05QuessParaya094, hostId!));
    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.passActionStep());
    expectSuccess(p2.playCommand(destroyHost, { targets: [hostId!] }));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: [neoZeonId],
    });
    expectSuccess(p1.resolveEffect({ targets: [neoZeonId!] }));

    expectSuccess(p2.enterBattle(firstAttackerId!, neoZeonId!));
    expectSuccess(p1.passBlock());
    expectSuccess(p1.passBattleAction());
    expectSuccess(p2.passBattleAction());

    expectSuccess(p2.enterBattle(secondAttackerId!, neoZeonId!));
    expectSuccess(p1.passBlock());
    expectSuccess(p1.passBattleAction());
    expectSuccess(p2.passBattleAction());

    expect(p1.getDamage(neoZeonId!)).toBe(2);
    expect(p1.getDamage(outsiderId!)).toBe(0);
  });
});
