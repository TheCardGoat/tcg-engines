import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, op02Dogura010, op02Makino015 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP02-010 Dogura", () => {
  test("may rest itself to play only a red cost-1 Character other than every Dogura copy", () => {
    const engine = OnePieceTestEngine.create({
      character: [{ card: op02Dogura010, playedOnTurn: 0 }],
      hand: [op02Dogura010, op02Makino015, eb01Doma005, eb01Fourtricks025],
    });
    const doguraId = engine.findCardInZone("south", "character", op02Dogura010);
    const secondDoguraId = engine.findCardInZone("south", "hand", op02Dogura010);
    const makinoId = engine.findCardInZone("south", "hand", op02Makino015);
    const domaId = engine.findCardInZone("south", "hand", eb01Doma005);
    const fourtricksId = engine.findCardInZone("south", "hand", eb01Fourtricks025);

    engine.activateEffect(doguraId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    expect(play?.kind).toBe("selectEntity");
    if (play?.kind !== "selectEntity") throw new Error("Expected Dogura's hand-play selection.");
    expect(play.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([makinoId, domaId]),
    );
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(secondDoguraId);
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(fourtricksId);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [makinoId] }, "south");

    const view = engine.getView("south");
    expect(
      view.players.south.characters.find((card) => card?.instanceId === doguraId)?.rested,
    ).toBe(true);
    expect(view.players.south.characters.some((card) => card?.instanceId === makinoId)).toBe(true);
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline its rest cost without playing a hand card", () => {
    const engine = OnePieceTestEngine.create({
      character: [{ card: op02Dogura010, playedOnTurn: 0 }],
      hand: [op02Makino015],
    });
    const doguraId = engine.findCardInZone("south", "character", op02Dogura010);
    const makinoId = engine.findCardInZone("south", "hand", op02Makino015);

    engine.activateEffect(doguraId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(
      view.players.south.characters.find((card) => card?.instanceId === doguraId)?.rested,
    ).toBe(false);
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(makinoId);
    expect(view.prompts).toHaveLength(0);
  });
});
