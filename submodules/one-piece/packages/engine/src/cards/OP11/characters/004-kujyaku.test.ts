import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op10XDrake114,
  op11Smoker005,
} from "@tcg/op-cards";
import { op11Kujyaku004 } from "../../../../../cards/src/cards/OP11/characters/004-kujyaku.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP11-004 Kujyaku", () => {
  test("finds an included Navy card while excluding Kujyaku itself", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op11Kujyaku004],
      deck: [
        op11Smoker005,
        op10XDrake114,
        op11Kujyaku004,
        eb01Doma005,
        eb01Fourtricks025,
        eb01MountainGod018,
        eb01Doma005,
      ],
      activeDon: op11Kujyaku004.cost,
    });
    const smokerId = engine.findCardInZone("south", "deck", op11Smoker005);
    const compoundNavyId = engine.findCardInZone("south", "deck", op10XDrake114);
    const kujyakuId = engine.findCardInZone("south", "deck", op11Kujyaku004);

    engine.playCard(op11Kujyaku004, "south");
    const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    if (search?.kind !== "selectEntity") throw new Error("Expected Kujyaku's Navy search.");
    expect(search.candidates.find((candidate) => candidate.ref.id === smokerId)?.legal).toBe(true);
    expect(search.candidates.find((candidate) => candidate.ref.id === compoundNavyId)?.legal).toBe(
      true,
    );
    expect(search.candidates.find((candidate) => candidate.ref.id === kujyakuId)?.legal).toBe(
      false,
    );
  });

  test("trashes itself to give an own Character +1000 power for the turn", () => {
    const engine = OnePieceTestEngine.create({ character: [op11Kujyaku004, eb01Doma005] });
    const kujyakuId = engine.findCardInZone("south", "character", op11Kujyaku004);
    const targetId = engine.findCardInZone("south", "character", eb01Doma005);
    const powerBefore = engine
      .getView("south")
      .players.south.characters.find((card) => card?.instanceId === targetId)?.power;

    engine.activateEffect(kujyakuId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(kujyakuId);
    expect(view.players.south.characters.find((card) => card?.instanceId === targetId)?.power).toBe(
      (powerBefore ?? 0) + 1000,
    );
    expect(view.prompts).toHaveLength(0);
  });
});
