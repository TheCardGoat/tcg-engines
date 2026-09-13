import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import {
  passTurnThroughPublicMoves,
  restUnitsByAttackingDirectly,
} from "../../../test-helpers/legal-gameplay-test-helpers.ts";
import { eb01MarinaIsmailPtolemaios2087 } from "./087-marina-ismail-ptolemaios-2.ts";

describe("Marina Ismail & Ptolemaios 2 (EB01-087)", () => {
  it("recovers 2 HP after a friendly green G Generation Unit destroys an enemy Unit in battle", () => {
    const attacker = createMockUnit({ color: "green", traits: ["g generation"], ap: 3 });
    const damagedAlly = createMockUnit({ hp: 5 });
    const defender = createMockUnit({ ap: 0, hp: 1 });
    const engine = GundamTestEngine.create(
      {
        baseSection: [eb01MarinaIsmailPtolemaios2087],
        play: [attacker, { card: damagedAlly, damage: 3 }],
        deck: 5,
      },
      { play: [defender], deck: 5 },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [attackerId, damagedAllyId] = p1.getCardsInZone("battleArea");
    const defenderId = p2.getCardsInZone("battleArea")[0]!;

    restUnitsByAttackingDirectly(engine, PLAYER_TWO, [defenderId]);
    passTurnThroughPublicMoves(engine, PLAYER_TWO);
    expectSuccess(p1.enterBattle(attackerId!, defenderId));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    expect(p2.getCardZone(defenderId)).toBe(`trash:${PLAYER_TWO}`);
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: expect.arrayContaining([damagedAllyId]),
    });
    expectSuccess(p1.resolveEffect({ targets: [damagedAllyId!] }));
    expect(p1.getDamage(damagedAllyId!)).toBe(1);
  });
});
