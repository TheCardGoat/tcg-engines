import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op16DocQ109, st26MonkeyDLuffy005, st31MonkeyDLuffy004 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("ST31-004 Monkey.D.Luffy", () => {
  test("[On Play] debuffs one opposing Character per {Straw Hat Crew} card on the field", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [st31MonkeyDLuffy004],
        character: [
          { card: st26MonkeyDLuffy005 }, // Straw Hat Crew #2 (the played Luffy is #1)
          { card: eb01Doma005 }, // not Straw Hat
        ],
        activeDon: st31MonkeyDLuffy004.cost,
      },
      {
        character: [
          { cardId: "OP16-109", rested: false },
          { cardId: "OP13-013", rested: false },
        ],
      },
    );
    const docQId = engine.findCardInZone("north", "character", op16DocQ109);
    const higumaId = engine.findCardInZone("north", "character", "OP13-013");

    engine.playCard(st31MonkeyDLuffy004, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected the debuff target.");
    expect(target.candidates).toHaveLength(2);
    // Two Straw Hat Crew cards on the field allow debuffing both opponents.
    engine.resolveDecision("effectTargetSelection", { selectedIds: [docQId, higumaId] }, "south");

    const north = engine.getView("south").players.north;
    expect(north.characters.find((c) => c?.instanceId === docQId)?.power).toBe(-1000);
    expect(north.characters.find((c) => c?.instanceId === higumaId)?.power).toBe(2000);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("with only itself as {Straw Hat Crew} exactly one opponent is debuffed", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [st31MonkeyDLuffy004], activeDon: st31MonkeyDLuffy004.cost },
      { character: [{ cardId: "OP16-109", rested: false }] },
    );

    engine.playCard(st31MonkeyDLuffy004, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected the debuff target.");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [target.candidates[0]!.ref.id] },
      "south",
    );

    const view = engine.getView("south");
    expect(view.players.north.characters.find((c) => c?.cardId === op16DocQ109.id)?.power).toBe(
      -1000,
    );
    expect(view.prompts).toHaveLength(0);
  });

  test("with 3 or more given DON!! it gains [Rush] and can attack the turn it is played", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [st31MonkeyDLuffy004],
        character: [{ card: eb01Doma005, attachedDon: 3 }],
        activeDon: st31MonkeyDLuffy004.cost,
      },
      {},
    );
    const lifeBefore = engine.getView("south").players.north.lifeCount;

    engine.playCard(st31MonkeyDLuffy004, "south");
    // No opposing Characters exist, so the debuff window auto-resolves.
    expect(() =>
      engine
        .asSouth()
        .attack(
          engine.findCardInZone("south", "character", st31MonkeyDLuffy004),
          engine.asNorth().leader(),
        ),
    ).not.toThrow();
    expect(engine.getView("south").players.north.lifeCount).toBe(lifeBefore - 1);
  });
});
