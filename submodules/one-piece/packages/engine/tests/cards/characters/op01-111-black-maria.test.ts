import { describe, expect, test } from "vite-plus/test";
import { eb01Fourtricks025, op01BlackMaria111 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP01-111 Black Maria", () => {
  test("blocks, returns one DON!! on block, and gains +1000 for the turn before damage", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [op01BlackMaria111],
        activeDon: 1,
      },
      { character: [{ card: eb01Fourtricks025, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const mariaId = engine.findCardInZone("south", "character", op01BlackMaria111);
    const attackerId = engine.findCardInZone("north", "character", eb01Fourtricks025);
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    engine.resolveDecision("battleBlocker", { selectedIds: [mariaId] }, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    let view = engine.getView("south");
    expect(view.players.south.donDeckCount).toBe(donDeckBefore + 1);
    expect(view.players.south.characters.some((card) => card?.instanceId === mariaId)).toBe(true);
    expect(view.players.south.characters.find((card) => card?.instanceId === mariaId)?.power).toBe(
      6000,
    );
    expect(view.prompts).toHaveLength(0);

    engine.endTurn("north");
    view = engine.getView("south");
    expect(view.players.south.characters.find((card) => card?.instanceId === mariaId)?.power).toBe(
      5000,
    );
  });
});
