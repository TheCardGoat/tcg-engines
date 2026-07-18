import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op01DonquixoteDoflamingo060,
  op14eb04BulletString078,
} from "@tcg/op-cards";
import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP14-078 Bullet String", () => {
  test("Counter returns one DON!! and gives the same chosen card +2000 for battle and turn", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        leaderCardId: op01DonquixoteDoflamingo060,
        hand: [op14eb04BulletString078],
        character: [eb01Doma005],
        activeDon: 3,
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const eventId = engine.findCardInZone("north", "hand", op14eb04BulletString078);
    const recipientId = engine.findCardInZone("north", "character", eb01Doma005);
    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [eventId] }, "north");
    engine.resolveDecision("effectCostReturnDon", { selectedIds: ["active-don:0"] }, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [recipientId] }, "north");
    const view = engine.getView("north");
    expect(
      view.players.north.characters.find((card) => card?.instanceId === recipientId)?.power,
    ).toBe(5000);
    expect(view.players.north.activeDon + view.players.north.restedDon).toBe(2);
    expect(view.prompts).toHaveLength(0);
  });
});
