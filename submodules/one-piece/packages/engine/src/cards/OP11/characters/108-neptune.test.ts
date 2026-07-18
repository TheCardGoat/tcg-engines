import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op11Shirahoshi022,
} from "@tcg/op-cards";
import { op11Neptune108 } from "../../../../../cards/src/cards/OP11/characters/108-neptune.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP11-108 Neptune", () => {
  test("with Shirahoshi turns top Life face-down, draws two, then trashes one chosen hand card", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op11Shirahoshi022,
      hand: [op11Neptune108, eb01MountainGod018],
      deck: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018],
      life: [{ card: eb01Doma005, faceUp: true, publicKnowledge: true }],
      activeDon: op11Neptune108.cost,
    });
    const discardedId = engine.findCardInZone("south", "hand", eb01MountainGod018);

    engine.playCard(op11Neptune108, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const discard = engine.pendingDecision("effectTrashFromHandSelection", "south").steps[0];
    expect(discard).toMatchObject({ kind: "selectEntity", min: 1, max: 1 });
    engine.resolveDecision("effectTrashFromHandSelection", { selectedIds: [discardedId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.life[0]).toMatchObject({ hidden: true });
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(discardedId);
    expect(view.players.south.handCount).toBe(2);
    expect(view.prompts).toHaveLength(0);
  });

  test("without a Shirahoshi Leader does not offer or resolve the optional effect", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op11Neptune108],
      deck: [eb01Doma005, eb01Fourtricks025],
      life: [{ card: eb01Doma005, faceUp: true, publicKnowledge: true }],
      activeDon: op11Neptune108.cost,
    });

    engine.playCard(op11Neptune108, "south");

    const view = engine.getView("south");
    expect(view.players.south.handCount).toBe(0);
    expect(view.players.south.deckCount).toBe(2);
    expect(view.players.south.life[0]).toMatchObject({ hidden: false });
    expect(view.prompts).toHaveLength(0);
  });
});
