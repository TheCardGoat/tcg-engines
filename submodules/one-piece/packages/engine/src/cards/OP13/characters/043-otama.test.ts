import { eb01Doma005, eb01Fourtricks025, eb01MountainGod018 } from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { op13Otama043 } from "../../../../../cards/src/cards/OP13/characters/043-otama.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP13-043 Otama", () => {
  test("at three Life draws two, then trashes the selected physical hand card", () => {
    const engine = OnePieceTestEngine.create({
      life: 3,
      hand: [op13Otama043, eb01Doma005],
      deck: [eb01Fourtricks025, eb01MountainGod018, eb01Doma005],
      activeDon: op13Otama043.cost,
    });
    const discardedId = engine.findCardInZone("south", "hand", eb01Doma005);

    engine.playCard(op13Otama043, "south");
    const trash = engine.pendingDecision("effectTrashFromHandSelection", "south");
    expect(trash.actorId).toBe("south");
    engine.resolveDecision("effectTrashFromHandSelection", { selectedIds: [discardedId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({ handCount: 2, deckCount: 1 });
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(discardedId);
    expect(view.prompts).toHaveLength(0);
  });

  test("at four Life neither draws nor asks its controller to trash", () => {
    const engine = OnePieceTestEngine.create({
      life: 4,
      hand: [op13Otama043, eb01Doma005],
      deck: [eb01Fourtricks025, eb01MountainGod018],
      activeDon: op13Otama043.cost,
    });
    const retainedId = engine.findCardInZone("south", "hand", eb01Doma005);

    engine.playCard(op13Otama043, "south");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({ handCount: 1, deckCount: 2 });
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(retainedId);
    expect(view.prompts).toHaveLength(0);
  });
});
