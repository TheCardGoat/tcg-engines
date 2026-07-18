import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op08IDNeverShootYou017 } from "@tcg/op-cards";
import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP08-017 I'd Never Shoot You!!!!", () => {
  test("Counter saves its recipient and gives a separate opposing target -1000 for the turn", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }, eb01Doma005] },
      { hand: [op08IDNeverShootYou017], life: 2, activeDon: 2 },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attacker = engine.findCardInZone("south", "character", eb01MountainGod018);
    const debuff = engine.findCardInZone("south", "character", eb01Doma005);
    const event = engine.findCardInZone("north", "hand", op08IDNeverShootYou017);
    const before = engine.getView("north").players.north.lifeCount;
    engine.declareAttack(attacker, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [event] }, "north");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("north")] },
      "north",
    );
    engine.resolveDecision("effectTargetSelection", { selectedIds: [debuff] }, "north");
    expect(engine.getView("north").players.north.lifeCount).toBe(before);
    expect(
      engine.getView("north").players.south.characters.find((c) => c?.instanceId === debuff)?.power,
    ).toBe(2000);
    expect(engine.getView("north").prompts).toHaveLength(0);
  });
});
