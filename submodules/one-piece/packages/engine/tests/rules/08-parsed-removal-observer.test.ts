import { expect, test } from "vite-plus/test";
import { getCard } from "../../../cards/src/runtime-catalog.ts";
import { buildCardEffects } from "../../../../tools/op-card-parser/src/effect-parser/index.ts";
import { OnePieceTestEngine } from "../../src/index.ts";

test("Buggy's parsed removal observer activates after a battle K.O.", () => {
  const buggy = getCard("OP16-041");
  const original = buggy.effects;
  try {
    // Parser integration: use the parsed printed text, not the authored definition.
    buggy.effects = buildCardEffects(buggy.effect ?? "");
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: "OP16-041",
        character: [{ cardId: "OP16-072", rested: true }],
        hand: ["OP16-042"],
        activeDon: 1,
      },
      { character: ["OP16-003"] },
    );
    const removed = engine.findCardInZone("south", "character", "OP16-072");
    const prisoner = engine.findCardInZone("south", "hand", "OP16-042");
    engine.attachDon(engine.leader("south"), 1, "south");
    engine.endTurn("south");
    engine.asNorth().attack("OP16-003", "OP16-072");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectPlaySelection", { selectedIds: [prisoner] }, "south");
    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(removed);
    expect(view.players.south.characters.some((card) => card?.instanceId === prisoner)).toBe(true);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  } finally {
    buggy.effects = original;
  }
});
