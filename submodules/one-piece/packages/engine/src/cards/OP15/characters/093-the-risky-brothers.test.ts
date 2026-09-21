import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op15TheRiskyBrothers093 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

const FILLER = "OP13-013";

function createEngine(trashCount: number) {
  return OnePieceTestEngine.create(
    {
      character: [
        { card: op15TheRiskyBrothers093 },
        { cardId: "OP16-095", rested: false, playedOnTurn: 0 },
      ],
      trash: Array.from({ length: trashCount }, () => FILLER),
      activeDon: 3,
    },
    { character: [{ card: eb01Doma005, rested: true }] },
  );
}

describe("OP15-093 The Risky Brothers", () => {
  test("with 15+ trash it self-trashes to grant a [Monkey.D.Luffy] [Rush: Character]", () => {
    const engine = createEngine(15);
    const brothersId = engine.findCardInZone("south", "character", op15TheRiskyBrothers093);
    const luffyId = engine.findCardInZone("south", "character", "OP16-095");

    engine.activateEffect(brothersId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const grant = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (grant?.kind !== "selectEntity") throw new Error("Expected the grant target.");
    expect(grant.candidates.map((candidate) => candidate.ref.id)).toEqual([luffyId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [luffyId] }, "south");

    // The second half of the printed effect grants the "Slash" attribute to
    // the same Character.
    const attribute = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (attribute?.kind !== "selectEntity") throw new Error("Expected the attribute grant.");
    expect(attribute.candidates.map((candidate) => candidate.ref.id)).toEqual([luffyId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [luffyId] }, "south");

    const view = engine.getView("south").players.south;
    expect(view.trash.map((card) => card.cardId)).toContain(op15TheRiskyBrothers093.id);
    // The granted "Slash" attribute is player-visible on the buffed card.
    const luffyCard = view.characters.find((c) => c?.instanceId === luffyId);
    console.log(
      "ATTR:",
      JSON.stringify({
        mods: Object.values(engine.getState().modifiers).map((m) => [
          m.type,
          m.targetId,
          m.attribute,
        ]),
      }),
    );
    expect(luffyCard?.attribute).toContain("slash");
    // Rush: Character — the just-played Luffy can now attack.
    expect(() => engine.asSouth().attack(luffyId, engine.asNorth().leader())).not.toThrow();
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("does not open with 14 or fewer cards in trash", () => {
    const engine = createEngine(14);
    const brothersId = engine.findCardInZone("south", "character", op15TheRiskyBrothers093);

    expect(() => engine.activateEffect(brothersId, "activateMain", "south")).toThrow();
    expect(engine.getView("south").players.south.trash).toHaveLength(14);
  });
  test("declining the self-trash leaves the Character and trash untouched", () => {
    const engine = createEngine(15);
    const brothersId = engine.findCardInZone("south", "character", op15TheRiskyBrothers093);
    const trashBefore = engine.getView("south").players.south.trash.length;

    engine.activateEffect(brothersId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const view = engine.getView("south").players.south;
    expect(view.trash.length).toBe(trashBefore);
    expect(view.characters.map((card) => card?.instanceId)).toContain(brothersId);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
