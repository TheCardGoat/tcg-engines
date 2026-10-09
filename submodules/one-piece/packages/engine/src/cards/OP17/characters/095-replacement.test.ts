import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

const paymentCards = ["EB01-005", "EB01-025", "EB01-018"];

describe("OP17-095 Roronoa Zoro removal replacement", () => {
  test("the +3000 power condition follows Shinobu's temporary Momonosuke cost increase", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: "OP01-031",
        character: ["OP17-095", "OP16-084"],
        hand: ["OP16-087"],
        activeDon: 2,
      },
      {},
    );
    const zoroId = engine.findCardInZone("south", "character", "OP17-095");
    const momoId = engine.findCardInZone("south", "character", "OP16-084");
    const before = engine.getView("south").players.south;
    expect(before.characters.find((card) => card?.instanceId === zoroId)?.power).toBe(2000);
    expect(before.characters.find((card) => card?.instanceId === momoId)?.cost).toBe(5);

    engine.asSouth().play("OP16-087");
    engine.asSouth().acceptOptional();
    engine.resolveDecision("effectTargetSelection", { selectedIds: [momoId] }, "south");
    const boosted = engine.getView("south").players.south;
    expect(boosted.characters.find((card) => card?.instanceId === momoId)?.cost).toBe(25);
    expect(boosted.characters.find((card) => card?.instanceId === zoroId)?.power).toBe(5000);

    engine.endTurn("south");
    const expired = engine.getView("south").players.south;
    expect(expired.characters.find((card) => card?.instanceId === momoId)?.cost).toBe(5);
    expect(expired.characters.find((card) => card?.instanceId === zoroId)?.power).toBe(2000);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test.each(["yes", "no"])(
    "one payment protects a simultaneous K.O. group: %s (Q1401/Q1402)",
    (optionId) => {
      const engine = OnePieceTestEngine.create(
        { leaderCardId: "OP01-091", hand: ["OP01-094"], activeDon: 10 },
        { character: ["OP17-095", "EB01-005"], trash: [...paymentCards, "OP01-079"] },
      );
      const targets = engine
        .getView("north")
        .players.north.characters.flatMap((c) => (c?.instanceId ? [c.instanceId] : []));
      const trashIds = engine
        .getView("north")
        .players.north.trash.flatMap((c) => (c.instanceId ? [c.instanceId] : []));
      const deckBefore = engine.getView("north").players.north.deckCount;
      engine.asSouth().play("OP01-094");
      engine.asSouth().acceptOptional();
      engine.resolveDecision("effectKoReplacement", { optionId }, "north");
      if (optionId === "yes") {
        const payment = engine.pendingDecision("effectTargetSelection", "north").steps[0];
        expect(payment).toMatchObject({ kind: "selectEntity", min: 3, max: 3 });
        engine.resolveDecision(
          "effectTargetSelection",
          { selectedIds: trashIds.slice(0, 3) },
          "north",
        );
        const order = [trashIds[2]!, trashIds[0]!, trashIds[1]!];
        engine.resolveDecision("effectReturnToDeckOwnerOrder", { selectedIds: order }, "north");
        // Public commands select the order; raw observation verifies hidden physical deck order.
        expect(engine.getState().players.north.deck.slice(-3)).toEqual(order);
      }
      const view = engine.getView("north");
      expect(view.prompts).toHaveLength(0);
      expect(view.players.north.deckCount).toBe(deckBefore + (optionId === "yes" ? 3 : 0));
      expect(
        view.players.north.characters.flatMap((c) => (c?.instanceId ? [c.instanceId] : [])),
      ).toEqual(optionId === "yes" ? targets : []);
      expect(view.players.north.trash.map((c) => c.instanceId)).toEqual(
        optionId === "yes" ? [trashIds[3]] : [...trashIds, ...targets],
      );
    },
  );

  test("fewer than three trash cards cannot pay for protection", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["OP12-096"], activeDon: 6 },
      { character: ["OP17-095"], trash: paymentCards.slice(0, 2) },
    );
    engine.asSouth().play("OP12-096");
    engine.asSouth().chooseTargets("OP17-095");
    expect(engine.getView("north").players.north.trash.map((c) => c.cardId)).toContain("OP17-095");
    expect(engine.getView("north").prompts).toHaveLength(0);
  });

  test.each(["yes", "no"])("handles a grouped deck return: %s", (optionId) => {
    const engine = OnePieceTestEngine.create(
      { hand: ["OP05-058"], activeDon: 8 },
      { character: ["OP17-095", "EB01-005"], trash: paymentCards },
    );
    const targets = engine
      .getView("north")
      .players.north.characters.flatMap((c) => (c?.instanceId ? [c.instanceId] : []));
    const trashIds = engine
      .getView("north")
      .players.north.trash.flatMap((c) => (c.instanceId ? [c.instanceId] : []));
    engine.asSouth().play("OP05-058");
    engine.resolveDecision("effectReturnToDeckOwnerOrder", { selectedIds: targets }, "north");
    engine.resolveDecision("effectRemovalReplacement", { optionId }, "north");
    if (optionId === "yes")
      engine.resolveDecision(
        "effectReturnToDeckOwnerOrder",
        { selectedIds: [...trashIds].reverse() },
        "north",
      );
    expect(
      engine
        .getView("north")
        .players.north.characters.flatMap((c) => (c?.instanceId ? [c.instanceId] : [])),
    ).toEqual(optionId === "yes" ? targets : []);
    expect(engine.getView("north").players.north.trash).toHaveLength(optionId === "yes" ? 0 : 3);
    expect(engine.getView("north").prompts).toHaveLength(0);
  });

  test("does not protect against battle K.O.", () => {
    const engine = OnePieceTestEngine.create(
      { character: ["EB01-018"] },
      { character: [{ cardId: "OP17-095", rested: true }], trash: paymentCards },
    );
    engine.asSouth().attack("EB01-018", engine.findCardInZone("north", "character", "OP17-095"));
    const view = engine.getView("north");
    expect(view.players.north.trash.map((c) => c.cardId)).toEqual([...paymentCards, "OP17-095"]);
    expect(view.prompts).toHaveLength(0);
  });

  test("does not protect against its controller's own effect", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: "OP01-091",
        character: ["OP17-095"],
        trash: paymentCards,
        hand: ["OP01-094"],
        activeDon: 10,
      },
      {},
    );
    engine.asSouth().play("OP01-094");
    engine.asSouth().acceptOptional();
    expect(engine.getView("south").players.south.trash.map((c) => c.cardId)).toEqual([
      ...paymentCards,
      "OP17-095",
    ]);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
