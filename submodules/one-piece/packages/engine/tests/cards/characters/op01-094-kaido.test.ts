import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, op01Kaido094, op01King091 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP01-094 Kaido", () => {
  test("with an Animal Kingdom Pirates Leader, returns 6 DON!! to K.O. all other Characters", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op01King091,
        hand: [op01Kaido094],
        character: [eb01Doma005],
        activeDon: op01Kaido094.cost,
      },
      { character: [eb01Fourtricks025] },
    );
    const ownCharacterId = engine.findCardInZone("south", "character", eb01Doma005);
    const opposingCharacterId = engine.findCardInZone("north", "character", eb01Fourtricks025);
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;

    engine.playCard(op01Kaido094, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const kaidoId = engine.findCardInZone("south", "character", op01Kaido094);
    const view = engine.getView("south");
    expect(view.players.south.characters.some((card) => card?.instanceId === kaidoId)).toBe(true);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(ownCharacterId);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(opposingCharacterId);
    expect(view.players.south.donDeckCount).toBe(donDeckBefore + 6);
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline DON!! -6 and leaves every other Character in play", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op01Kaido094],
        character: [eb01Doma005],
        activeDon: op01Kaido094.cost,
      },
      { character: [eb01Fourtricks025] },
    );
    const ownCharacterId = engine.findCardInZone("south", "character", eb01Doma005);
    const opposingCharacterId = engine.findCardInZone("north", "character", eb01Fourtricks025);
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;

    engine.playCard(op01Kaido094, "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const kaidoId = engine.findCardInZone("south", "character", op01Kaido094);
    const view = engine.getView("south");
    expect(view.players.south.characters.some((card) => card?.instanceId === kaidoId)).toBe(true);
    expect(view.players.south.characters.some((card) => card?.instanceId === ownCharacterId)).toBe(
      true,
    );
    expect(
      view.players.north.characters.some((card) => card?.instanceId === opposingCharacterId),
    ).toBe(true);
    expect(view.players.south.donDeckCount).toBe(donDeckBefore);
    expect(view.prompts).toHaveLength(0);
  });
});
