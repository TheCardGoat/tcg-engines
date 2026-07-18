import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op08EdwardWeevil042,
  op08SilversRayleigh118,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP08-118 Silvers Rayleigh", () => {
  test("assigns ordered unequal reductions, K.O.s a third target, then expires after the opponent's next turn", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op08SilversRayleigh118],
        deck: [eb01Doma005, eb01Doma005],
        activeDon: op08SilversRayleigh118.cost,
      },
      {
        character: [eb01MountainGod018, op08EdwardWeevil042, eb01Doma005],
        deck: [eb01Doma005, eb01Doma005],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const minusThreeThousandId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const minusTwoThousandId = engine.findCardInZone("north", "character", op08EdwardWeevil042);
    const koTargetId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.playCard(op08SilversRayleigh118, "south");
    const reductions = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(reductions).toMatchObject({ kind: "selectEntity", min: 0, max: 2 });
    if (reductions?.kind !== "selectEntity") {
      throw new Error("Expected Rayleigh's ordered power targets.");
    }
    expect(reductions.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([minusThreeThousandId, minusTwoThousandId, koTargetId]),
    );
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [minusThreeThousandId, minusTwoThousandId] },
      "south",
    );

    let view = engine.getView("south");
    expect(
      view.players.north.characters.find((card) => card?.instanceId === minusThreeThousandId)
        ?.power,
    ).toBe((eb01MountainGod018.power ?? 0) - 3000);
    expect(
      view.players.north.characters.find((card) => card?.instanceId === minusTwoThousandId)?.power,
    ).toBe((op08EdwardWeevil042.power ?? 0) - 2000);

    const ko = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (ko?.kind !== "selectEntity") throw new Error("Expected Rayleigh's K.O. target.");
    expect(ko.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([minusTwoThousandId, koTargetId]),
    );
    expect(ko.candidates.map((candidate) => candidate.ref.id)).not.toContain(minusThreeThousandId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [koTargetId] }, "south");

    view = engine.getView("south");
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(koTargetId);
    expect(view.players.north.characters.map((card) => card?.instanceId)).toEqual(
      expect.arrayContaining([minusThreeThousandId, minusTwoThousandId]),
    );

    engine.endTurn("south");
    view = engine.getView("south");
    expect(
      view.players.north.characters.find((card) => card?.instanceId === minusThreeThousandId)
        ?.power,
    ).toBe((eb01MountainGod018.power ?? 0) - 3000);
    expect(
      view.players.north.characters.find((card) => card?.instanceId === minusTwoThousandId)?.power,
    ).toBe((op08EdwardWeevil042.power ?? 0) - 2000);

    engine.endTurn("north");
    view = engine.getView("south");
    expect(
      view.players.north.characters.find((card) => card?.instanceId === minusThreeThousandId)
        ?.power,
    ).toBe(eb01MountainGod018.power);
    expect(
      view.players.north.characters.find((card) => card?.instanceId === minusTwoThousandId)?.power,
    ).toBe(op08EdwardWeevil042.power);
    expect(view.prompts).toHaveLength(0);
  });
});
