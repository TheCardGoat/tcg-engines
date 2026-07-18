import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  op06Inuarashi100,
  op06Raizo112,
  op10KouzukiMomonosuke028,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP10-028 Kouzuki Momonosuke", () => {
  test("rests 2 DON!!, trashes itself, and finds up to 2 included Akazaya Nine cards", () => {
    const engine = OnePieceTestEngine.create({
      character: [op10KouzukiMomonosuke028],
      activeDon: 2,
      deck: [
        op06Inuarashi100,
        op06Raizo112,
        eb01Doma005,
        eb01Fourtricks025,
        eb01Doma005,
        eb01Fourtricks025,
      ],
    });
    const momonosukeId = engine.findCardInZone("south", "character", op10KouzukiMomonosuke028);
    const inuarashiId = engine.findCardInZone("south", "deck", op06Inuarashi100);
    const raizoId = engine.findCardInZone("south", "deck", op06Raizo112);

    engine.activateEffect(momonosukeId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    expect(search).toMatchObject({ kind: "selectEntity", min: 0, max: 2 });
    if (search?.kind !== "selectEntity") throw new Error("Expected Momonosuke's search.");
    expect(search.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([inuarashiId, raizoId]),
    );
    engine.resolveDecision(
      "effectSearchSelection",
      { selectedIds: [inuarashiId, raizoId] },
      "south",
    );
    const remainder = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    if (remainder?.kind !== "orderItems") throw new Error("Expected remainder ordering.");
    engine.resolveDecision(
      "effectSearchRemainderOrder",
      { selectedIds: remainder.candidates.map((candidate) => candidate.ref.id) },
      "south",
    );

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({ activeDon: 0, restedDon: 2 });
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(momonosukeId);
    expect(view.players.south.hand.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([inuarashiId, raizoId]),
    );
    expect(view.prompts).toHaveLength(0);
  });
});
