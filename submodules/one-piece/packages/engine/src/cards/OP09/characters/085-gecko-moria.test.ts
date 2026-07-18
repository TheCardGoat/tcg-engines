import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op07CaptainJohn082,
  op09GeckoMoria085,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP09-085 Gecko Moria", () => {
  test("plays a cost-2 compound-trait Thriller Bark Pirates Character from trash rested", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op09GeckoMoria085],
      trash: [op07CaptainJohn082, eb01MountainGod018],
      deck: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018],
      activeDon: op09GeckoMoria085.cost,
    });
    const eligibleId = engine.findCardInZone("south", "trash", op07CaptainJohn082);
    const ineligibleId = engine.findCardInZone("south", "trash", eb01MountainGod018);

    engine.playCard(op09GeckoMoria085, "south");
    const target = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    expect(target).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (target?.kind !== "selectEntity") throw new Error("Expected Moria's trash-play choice.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([eligibleId]);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(ineligibleId);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).not.toContain(eligibleId);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === eligibleId)?.rested,
    ).toBe(true);
  });
});
