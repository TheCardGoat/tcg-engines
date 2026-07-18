import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op11Arlong023,
  op11BulgeEyedNeptunian027,
  op11Ishilly025,
  op11Shirahoshi030,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP11-030 Shirahoshi", () => {
  test("pays both costs, privately searches either printed trait, and orders the remainder", () => {
    const engine = OnePieceTestEngine.create({
      character: [op11Shirahoshi030],
      deck: [
        op11BulgeEyedNeptunian027,
        op11Ishilly025,
        op11Arlong023,
        eb01Doma005,
        eb01MountainGod018,
        eb01Doma005,
      ],
      activeDon: 1,
    });
    const shirahoshiId = engine.findCardInZone("south", "character", op11Shirahoshi030);
    const neptunianId = engine.findCardInZone("south", "deck", op11BulgeEyedNeptunian027);
    const fishManIslandId = engine.findCardInZone("south", "deck", op11Ishilly025);
    const arlongId = engine.findCardInZone("south", "deck", op11Arlong023);
    const excludedId = engine.findCardInZone("south", "deck", eb01MountainGod018);

    engine.activateEffect(shirahoshiId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    expect(search).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (search?.kind !== "selectEntity") throw new Error("Expected Shirahoshi's search choice.");
    expect(search.candidates.find((candidate) => candidate.ref.id === neptunianId)?.legal).toBe(
      true,
    );
    expect(search.candidates.find((candidate) => candidate.ref.id === fishManIslandId)?.legal).toBe(
      true,
    );
    expect(search.candidates.find((candidate) => candidate.ref.id === arlongId)?.legal).toBe(true);
    expect(search.candidates.find((candidate) => candidate.ref.id === excludedId)?.legal).toBe(
      false,
    );
    engine.resolveDecision("effectSearchSelection", { selectedIds: [fishManIslandId] }, "south");

    const remainder = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    expect(remainder?.kind).toBe("orderItems");
    if (remainder?.kind !== "orderItems") throw new Error("Expected bottom-deck ordering.");
    const bottomOrder = remainder.candidates.map((candidate) => candidate.ref.id).reverse();
    engine.resolveDecision("effectSearchRemainderOrder", { selectedIds: bottomOrder }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(fishManIslandId);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === shirahoshiId)?.rested,
    ).toBe(true);
    expect(view.players.south).toMatchObject({ activeDon: 0, restedDon: 1 });
    expect(view.prompts).toHaveLength(0);
  });
});
