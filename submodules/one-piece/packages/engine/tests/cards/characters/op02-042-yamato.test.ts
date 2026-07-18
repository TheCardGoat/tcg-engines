import { describe, expect, test } from "vite-plus/test";
import { eb01MountainGod018, op02MonkeyDLuffy041, op02Yamato042 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { cardNames } from "../../../src/shared.ts";

describe("OP02-042 Yamato", () => {
  test("has the Kouzuki Oden rules name and rests only an opposing cost-6-or-less Character", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op02Yamato042], activeDon: op02Yamato042.cost },
      { character: [eb01MountainGod018, op02MonkeyDLuffy041] },
    );
    const eligibleId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const excludedId = engine.findCardInZone("north", "character", op02MonkeyDLuffy041);

    expect(cardNames(op02Yamato042)).toContain("Kouzuki Oden");
    engine.playCard(op02Yamato042, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Yamato's rest target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(eligibleId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(
      view.players.north.characters.find((card) => card?.instanceId === eligibleId)?.rested,
    ).toBe(true);
    expect(
      view.players.north.characters.find((card) => card?.instanceId === excludedId)?.rested,
    ).toBe(false);
    expect(view.prompts).toHaveLength(0);
  });
});
