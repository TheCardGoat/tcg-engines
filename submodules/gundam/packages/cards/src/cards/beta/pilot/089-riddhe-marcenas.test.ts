import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  expectSuccess,
  createMockUnit,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import { betaRiddheMarcenas089 } from "./089-riddhe-marcenas.ts";
describe("Riddhe Marcenas (GD01-089)", () => {
  it("【Burst】 adds Riddhe to hand when his shield is destroyed", () => {
    // The conditional "if this Unit has <Repair>" sub-directive only applies
    // once Riddhe is paired to a <Repair> unit — baseline assertion covers
    // the unconditional "Add this card to your hand" clause.
    const attacker = createMockUnit({ ap: 3, hp: 5 });
    const engine = GundamTestEngine.create({ play: [attacker] }, { deck: [betaRiddheMarcenas089] });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_TWO, 1);
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);

    expectSuccess(p1.enterBattle(attacker, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    expect(p2.getHand()).toContain(shieldId!);
  });
});
