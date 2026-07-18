import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb03Shirahoshi052,
  op11BulgeEyedNeptunian027,
  op11Shirahoshi022,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB03-052 Shirahoshi", () => {
  test("trashes itself to add the deck top to Life and boost all Neptunian Characters this turn", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op11Shirahoshi022,
      hand: [eb03Shirahoshi052],
      character: [op11BulgeEyedNeptunian027, eb01Doma005],
      deck: [eb01Fourtricks025, eb01Doma005],
      activeDon: eb03Shirahoshi052.cost,
    });
    const deckTopId = engine.findCardInZone("south", "deck", eb01Fourtricks025);
    const neptunianId = engine.findCardInZone("south", "character", op11BulgeEyedNeptunian027);
    const otherId = engine.findCardInZone("south", "character", eb01Doma005);

    engine.playCard(eb03Shirahoshi052, "south");
    const shirahoshiId = engine.findCardInZone("south", "character", eb03Shirahoshi052);
    engine.activateEffect(shirahoshiId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    let view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(shirahoshiId);
    expect(engine.getState().players.south.life[0]).toBe(deckTopId);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === neptunianId)?.power,
    ).toBe(7000);
    expect(view.players.south.characters.find((card) => card?.instanceId === otherId)?.power).toBe(
      eb01Doma005.power,
    );
    expect(view.prompts).toHaveLength(0);

    engine.endTurn("south");
    view = engine.getView("south");
    expect(
      view.players.south.characters.find((card) => card?.instanceId === neptunianId)?.power,
    ).toBe(op11BulgeEyedNeptunian027.power);
  });

  test("may trash itself when the Leader condition fails and still boosts Neptunians", () => {
    const engine = OnePieceTestEngine.create({
      hand: [eb03Shirahoshi052],
      character: [op11BulgeEyedNeptunian027, eb01Doma005],
      deck: [eb01Fourtricks025, eb01Doma005],
      activeDon: eb03Shirahoshi052.cost,
    });
    const deckIds = [...engine.getState().players.south.deck];
    const lifeCount = engine.getView("south").players.south.lifeCount;
    const neptunianId = engine.findCardInZone("south", "character", op11BulgeEyedNeptunian027);
    const otherId = engine.findCardInZone("south", "character", eb01Doma005);

    engine.playCard(eb03Shirahoshi052, "south");
    const shirahoshiId = engine.findCardInZone("south", "character", eb03Shirahoshi052);
    engine.activateEffect(shirahoshiId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(shirahoshiId);
    expect(engine.getState().players.south.deck).toEqual(deckIds);
    expect(view.players.south.lifeCount).toBe(lifeCount);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === neptunianId)?.power,
    ).toBe(7000);
    expect(view.players.south.characters.find((card) => card?.instanceId === otherId)?.power).toBe(
      eb01Doma005.power,
    );
    expect(view.prompts).toHaveLength(0);
  });
});
