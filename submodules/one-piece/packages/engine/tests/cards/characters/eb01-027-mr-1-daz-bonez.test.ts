import { describe, expect, test } from "vite-plus/test";
import {
  eb01Chambres020,
  eb01Doma005,
  eb01GumGumChampionRifle028,
  eb01Mr1DazBonez027,
  eb01OhComeMyWay038,
  eb01Fourtricks025,
  eb01MountainGod018,
  op01Crocodile062,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB01-027 Mr. 1 (Daz.Bonez)", () => {
  test("draws then trashes while counting only complete Event pairs for power", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op01Crocodile062,
      hand: [eb01Mr1DazBonez027, eb01Doma005],
      deck: [eb01Fourtricks025, eb01MountainGod018, eb01Doma005],
      trash: [eb01Chambres020, eb01GumGumChampionRifle028, eb01OhComeMyWay038],
      activeDon: 5,
    });

    engine.playCard(eb01Mr1DazBonez027);
    const mr1Id = engine.findCardInZone("south", "character", eb01Mr1DazBonez027);

    const trash = engine.pendingDecision("effectTrashFromHandSelection", "south").steps[0];
    expect(trash?.kind).toBe("selectEntity");
    if (trash?.kind !== "selectEntity") {
      throw new Error("Expected Mr. 1's controller to choose the post-draw discard.");
    }
    expect(trash).toMatchObject({ min: 1, max: 1 });
    const selectedId = trash.candidates[0]!.ref.id;
    engine.resolveDecision("effectTrashFromHandSelection", { selectedIds: [selectedId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand).toHaveLength(2);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(selectedId);
    expect(view.players.south.characters.find((card) => card?.instanceId === mr1Id)?.power).toBe(
      7000,
    );
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
