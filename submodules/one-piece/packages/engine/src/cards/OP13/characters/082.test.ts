import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  op13FiveElders082,
  op13StJaygarciaSaturn083,
  op13StMarcusMars091,
  op13StTopmanWarcury089,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

const FILLER = "OP16-096";

function createEngine(trash: string[], activeDon = 2) {
  return OnePieceTestEngine.create(
    {
      leaderCardId: "OP13-079",
      character: [{ card: op13FiveElders082, rested: true }],
      hand: [FILLER],
      trash,
      activeDon,
    },
    {},
  );
}

function payCosts(engine: ReturnType<typeof createEngine>) {
  engine.activateEffect(
    engine.findCardInZone("south", "character", op13FiveElders082),
    "activateMain",
    "south",
  );
  engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
  // With a fungible DON!! pool and a single hand card both costs are
  // unambiguous, so the engine auto-pays them; only the replay choice prompts.
  const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
  if (play?.kind !== "selectEntity") throw new Error("Expected the replay choice.");
  return play;
}

describe("OP13-082 Five Elders", () => {
  test("replays 5000-power {Five Elders} Characters from the trash after trashing its board", () => {
    const engine = createEngine([
      op13StJaygarciaSaturn083.id,
      op13StTopmanWarcury089.id,
      eb01Doma005.id,
    ]);
    const saturnId = engine.findCardInZone("south", "trash", op13StJaygarciaSaturn083);
    const warcuryId = engine.findCardInZone("south", "trash", op13StTopmanWarcury089);
    const selfId = engine.findCardInZone("south", "character", op13FiveElders082);

    const play = payCosts(engine);
    const candidates = play.candidates.map((candidate) => candidate.ref.id);
    expect(candidates).toContain(saturnId);
    expect(candidates).toContain(warcuryId);
    expect(candidates).not.toContain(selfId);
    expect(candidates).not.toContain(engine.findCardInZone("south", "trash", eb01Doma005));
    engine.resolveDecision("effectPlaySelection", { selectedIds: [saturnId, warcuryId] }, "south");
    // Saturn's own [On Play] search cascades after it re-enters play; the
    // reveal is "up to 1 {Five Elders}" and the filler deck offers none.
    engine.resolveDecision("effectSearchSelection", { selectedIds: [] }, "south");
    // Saturn's search then sends the unchosen look-ahead cards to the deck bottom.
    const order = engine.pendingDecision("effectSearchRemainderOrder", "south");
    expect(order.steps[0]).toMatchObject({ kind: "orderItems" });
    const orderStep = order.steps[0];
    if (orderStep?.kind !== "orderItems") throw new Error("Expected the deck-bottom order.");
    engine.resolveDecision(
      "effectSearchRemainderOrder",
      { selectedIds: orderStep.candidates.map((candidate) => candidate.ref.id) },
      "south",
    );

    const view = engine.getView("south");
    const south = view.players.south;
    const fieldIds = south.characters.map((card) => card?.instanceId);
    expect(fieldIds).toContain(saturnId);
    expect(fieldIds).toContain(warcuryId);
    expect(view.players.south.trash.map((card) => card.instanceId)).not.toContain(saturnId);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(selfId);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(
      engine.findCardInZone("south", "trash", eb01Doma005),
    );
    expect(south.activeDon).toBe(1);
    expect(south.restedDon).toBe(1);
    expect(south.hand).toHaveLength(0);
    expect(view.prompts).toHaveLength(0);
  });

  test("rejects replaying two copies of the same card name", () => {
    const engine = createEngine([op13StJaygarciaSaturn083.id, op13StJaygarciaSaturn083.id]);
    const trashCards = engine.getView("south").players.south.trash;
    const saturnIds = trashCards
      .filter((card) => card.cardId === op13StJaygarciaSaturn083.id)
      .map((card) => card.instanceId)
      .filter((id): id is string => id !== null);
    expect(saturnIds).toHaveLength(2);
    expect(saturnIds[0]).not.toBe(saturnIds[1]);

    payCosts(engine);
    expect(() =>
      engine.resolveDecision("effectPlaySelection", { selectedIds: saturnIds }, "south"),
    ).toThrow();
  });

  test("requires an [Imu] Leader and is rejected under any other Leader", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: "OP16-080",
        character: [{ card: op13FiveElders082, rested: true }],
        hand: [FILLER],
        activeDon: 2,
      },
      {},
    );

    expect(() =>
      engine.activateEffect(
        engine.findCardInZone("south", "character", op13FiveElders082),
        "activateMain",
        "south",
      ),
    ).toThrow();
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("declining the activation leaves the board, hand, and DON!! unchanged", () => {
    const engine = createEngine([op13StMarcusMars091.id]);
    const before = engine.getView("south").players.south;
    const boardBefore = before.characters.map((card) => card?.instanceId);
    const handBefore = before.hand.length;
    const donBefore = before.activeDon + before.restedDon;

    engine.activateEffect(
      engine.findCardInZone("south", "character", op13FiveElders082),
      "activateMain",
      "south",
    );
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const after = engine.getView("south").players.south;
    expect(after.characters.map((card) => card?.instanceId)).toEqual(boardBefore);
    expect(after.hand).toHaveLength(handBefore);
    expect(after.activeDon + after.restedDon).toBe(donBefore);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
