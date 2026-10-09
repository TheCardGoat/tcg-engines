import { eb01Doma005 } from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { op13Shanks028 } from "../../../../../cards/src/cards/characters/op13-028-shanks.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP13-028 Shanks", () => {
  test("sets every DON!! active and prevents hand plays only for the current turn", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op13Shanks028, eb01Doma005],
      activeDon: op13Shanks028.cost,
      restedDon: 2,
    });
    const domaId = engine.findCardInZone("south", "hand", eb01Doma005);

    engine.playCard(op13Shanks028, "south");

    let view = engine.getView("south");
    expect(view.players.south).toMatchObject({ activeDon: 12, restedDon: 0 });
    expect(
      engine.expectFailure({ type: "playCard", seat: "south", instanceId: domaId }).reason,
    ).toBe("A card effect prevents this card from being played.");

    engine.endTurn("south");
    engine.endTurn("north");
    engine.playCard(eb01Doma005, "south");

    view = engine.getView("south");
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(domaId);
    expect(view.prompts).toHaveLength(0);
  });
  test("the special ruling still permits an effect to play a Character from hand", () => {
    let engine = OnePieceTestEngine.create({
      leaderCardId: "ST10-001",
      hand: [op13Shanks028, eb01Doma005],
      activeDon: 10,
    });
    const doma = engine.findCardInZone("south", "hand", eb01Doma005);
    engine.asSouth().play(op13Shanks028);
    engine = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(engine.getState())));
    engine.asSouth().activateMain(engine.leader("south"));
    engine.asSouth().acceptOptional();
    const selection = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    if (selection?.kind !== "selectEntity") throw new Error("Expected Law hand play");
    expect(selection.candidates.map((c) => c.ref.id)).toContain(doma);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [doma] }, "south");
    expect(engine.getView("south").players.south.characters.map((c) => c?.instanceId)).toContain(
      doma,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
