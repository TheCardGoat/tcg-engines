import { describe, expect, test } from "vite-plus/test";
import { eb01MountainGod018, op01KurozumiOrochi098, op01KurozumiSemimaru099 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP01-099 Kurozumi Semimaru", () => {
  test("prevents another compound Kurozumi Clan Character from being K.O.'d in battle", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [op01KurozumiSemimaru099, { card: op01KurozumiOrochi098, rested: true }],
      },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const orochiId = engine.findCardInZone("south", "character", op01KurozumiOrochi098);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.declareAttack(attackerId, orochiId, "north");

    const view = engine.getView("south");
    expect(view.players.south.characters.some((card) => card?.instanceId === orochiId)).toBe(true);
    expect(view.players.south.trash.map((card) => card.instanceId)).not.toContain(orochiId);
    expect(view.prompts).toHaveLength(0);
  });

  test("does not let one copy protect another Kurozumi Semimaru from battle K.O.", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [op01KurozumiSemimaru099, { card: op01KurozumiSemimaru099, rested: true }],
      },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const semimaruIds = engine
      .getView("south")
      .players.south.characters.flatMap((card) => (card ? [card.instanceId] : []));
    expect(semimaruIds).toHaveLength(2);
    const targetId = semimaruIds[1]!;
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.declareAttack(attackerId, targetId, "north");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(targetId);
    expect(view.prompts).toHaveLength(0);
  });
});
