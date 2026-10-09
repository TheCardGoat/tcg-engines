import { describe, expect, test } from "vite-plus/test";
import { op16Kuzan063, op16Sengoku060 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP16-060 Sengoku", () => {
  test("returns 8 active DON!! to replay differently named {Admiral} Characters from hand", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op16Sengoku060,
        hand: [op16Kuzan063, "OP16-038"],
        activeDon: 10,
      },
      {},
    );
    const kuzanId = engine.findCardInZone("south", "hand", op16Kuzan063);
    const southBefore = engine.getView("south").players.south;
    const donBefore = southBefore.activeDon;
    const donDeckBefore = southBefore.donDeckCount;

    engine.activateEffect(engine.leader("south"), "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    // Active DON!! cards are fungible, so the 8-DON!! return auto-pays.

    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    if (play?.kind !== "selectEntity") throw new Error("Expected the replay choice.");
    const candidates = play.candidates.map((candidate) => candidate.ref.id);
    expect(candidates).toEqual([kuzanId]);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [kuzanId] }, "south");

    // Kuzan's own [On Play] cascade: add up to 2 rested DON!! from the deck.
    const addDon = engine.pendingDecision("effectAddDon", "south").steps[0];
    if (addDon?.kind !== "chooseOption") throw new Error("Expected the DON!! choice.");
    engine.resolveDecision("effectAddDon", { optionId: "0" }, "south");

    const view = engine.getView("south").players.south;
    expect(view.characters.map((card) => card?.instanceId)).toContain(kuzanId);
    expect(view.donDeckCount).toBe(donDeckBefore + 8);
    expect(view.activeDon).toBe(donBefore - 8);
    expect(view.hand).toHaveLength(1);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("is unavailable with fewer than 8 active DON!!", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op16Sengoku060,
        hand: [op16Kuzan063],
        activeDon: 7,
      },
      {},
    );

    expect(() => engine.activateEffect(engine.leader("south"), "activateMain", "south")).toThrow();
    expect(engine.getView("south").players.south.hand).toHaveLength(1);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("declining the activation leaves hand and DON!! untouched", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: "OP16-060",
        hand: [op16Kuzan063],
        activeDon: 10,
      },
      {},
    );
    const before = engine.getView("south").players.south;
    const handBefore = before.hand.length;
    const donBefore = before.activeDon;
    const donDeckBefore = before.donDeckCount;

    engine.activateEffect(engine.leader("south"), "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const after = engine.getView("south").players.south;
    expect(after.hand.length).toBe(handBefore);
    expect(after.activeDon).toBe(donBefore);
    expect(after.donDeckCount).toBe(donDeckBefore);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
  test.each([
    { activeDon: 7, restedDon: 1, attachedDon: 0 },
    { activeDon: 7, restedDon: 0, attachedDon: 1 },
    { activeDon: 0, restedDon: 8, attachedDon: 0 },
  ])("only active DON can pay the eight-DON cost: %j", ({ activeDon, restedDon, attachedDon }) => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: "OP16-060",
        activeDon,
        restedDon,
        character: [{ cardId: "EB01-005", attachedDon }],
      },
      {},
    );
    expect(() => engine.asSouth().activateMain(engine.leader("south"))).toThrow();
    expect(engine.getView("south").players.south.activeDon).toBe(activeDon);
    expect(engine.getView("south").players.south.restedDon).toBe(restedDon);
  });

  test("eight active DON pay automatically without touching rested or attached DON", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: "OP16-060",
        activeDon: 8,
        restedDon: 1,
        hand: [],
        character: [{ cardId: "EB01-005", attachedDon: 1 }],
      },
      {},
    );
    const before = engine.getView("south").players.south.donDeckCount;
    engine.asSouth().activateMain(engine.leader("south"));
    engine.asSouth().acceptOptional();
    const view = engine.getView("south");
    expect(view.players.south.activeDon).toBe(0);
    expect(view.players.south.restedDon).toBe(1);
    expect(view.players.south.characters[0]?.attachedDon).toBe(1);
    expect(view.players.south.donDeckCount).toBe(before + 8);
    expect(view.prompts).toHaveLength(0);
  });
  test.each([1, 2])(
    "may play only %i differently named Admirals from a larger hand (FAQ)",
    (amount) => {
      let e = OnePieceTestEngine.create(
        { leaderCardId: "OP16-060", activeDon: 8, hand: ["OP16-063", "OP16-065", "OP16-065"] },
        {},
      );
      e.asSouth().activateMain(e.leader("south"));
      e.asSouth().acceptOptional();
      const kuzan = e.findCardInZone("south", "hand", "OP16-063"),
        sakazuki = e.findCardInZone("south", "hand", "OP16-065");
      e = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(e.getState())));
      e.resolveDecision(
        "effectPlaySelection",
        { selectedIds: amount === 1 ? [kuzan] : [kuzan, sakazuki] },
        "south",
      );
      e.resolveDecision("effectAddDon", { optionId: "0" }, "south");
      expect(e.getView("south").players.south.characters.filter(Boolean)).toHaveLength(amount);
      expect(e.getView("south").players.south.hand).toHaveLength(3 - amount);
      expect(e.getView("south").players.south.activeDon).toBe(0);
    },
  );
});
