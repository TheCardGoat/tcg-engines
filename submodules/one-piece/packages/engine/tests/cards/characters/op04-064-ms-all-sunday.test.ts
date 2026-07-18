import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op04Crocodile058,
  op04MsAllSunday064,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

function chooseOneDon(engine: OnePieceTestEngine, seat: "south" | "north") {
  const decision = engine.pendingDecision("effectAddDon", seat).steps[0];
  expect(decision?.kind).toBe("chooseOption");
  if (decision?.kind !== "chooseOption") throw new Error("Expected an add-DON!! choice.");
  expect(decision.options.map((option) => option.id)).toEqual(["0", "1"]);
  engine.resolveDecision("effectAddDon", { optionId: "1" }, seat);
}

describe("OP04-064 Ms. All Sunday", () => {
  test("adds rested DON!! before checking six field DON!! and drawing", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op04MsAllSunday064],
      deck: [eb01Doma005],
      activeDon: 5,
    });
    const drawId = engine.findCardInZone("south", "deck", eb01Doma005);

    engine.playCard(op04MsAllSunday064, "south");
    chooseOneDon(engine, "south");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({ activeDon: 0, restedDon: 6, deckCount: 0 });
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(drawId);
    expect(view.prompts).toHaveLength(0);
  });

  test("may add zero DON!! and does not draw below six on the field", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op04MsAllSunday064],
      deck: [eb01Doma005],
      activeDon: 5,
    });

    engine.playCard(op04MsAllSunday064, "south");
    engine.resolveDecision("effectAddDon", { optionId: "0" }, "south");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({
      activeDon: 0,
      restedDon: 5,
      deckCount: 1,
      handCount: 0,
    });
    expect(view.prompts).toHaveLength(0);
  });

  test("does not draw when Trigger play leaves fewer than six DON!! on the field", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        life: [op04MsAllSunday064],
        deck: [eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005],
        activeDon: 2,
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "north");
    chooseOneDon(engine, "north");

    expect(engine.getView("north").players.north).toMatchObject({
      activeDon: 0,
      restedDon: 1,
      deckCount: 4,
      handCount: 0,
    });
  });

  test("matches the official Crocodile Q&A ordering for its Life Trigger", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        leaderCardId: op04Crocodile058,
        life: [op04MsAllSunday064],
        deck: [eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005],
        activeDon: 6,
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const sundayId = engine.findCardInZone("north", "life", op04MsAllSunday064);
    const drawId = engine.getState().players.north.deck[0]!;

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "north");
    expect(engine.getView("north").players.north.activeDon).toBe(4);

    // OP04-058 resolves first, replacing one of the two returned DON!! as active.
    chooseOneDon(engine, "north");
    expect(engine.getView("north").players.north).toMatchObject({ activeDon: 5, restedDon: 0 });

    // The physical Trigger card is played, then its On Play adds the sixth field DON!! rested.
    expect(
      engine
        .getView("north")
        .players.north.characters.some((card) => card?.instanceId === sundayId),
    ).toBe(true);
    chooseOneDon(engine, "north");

    const view = engine.getView("north");
    expect(view.players.north).toMatchObject({ activeDon: 5, restedDon: 1, deckCount: 3 });
    expect(view.players.north.hand.map((card) => card.instanceId)).toContain(drawId);
    expect(view.players.north.trash.map((card) => card.instanceId)).not.toContain(sundayId);
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline the Life Trigger cost without paying or playing the physical card", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { life: [op04MsAllSunday064], activeDon: 2 },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const sundayId = engine.findCardInZone("north", "life", op04MsAllSunday064);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "north");

    const view = engine.getView("north");
    expect(view.players.north.activeDon).toBe(2);
    expect(view.players.north.characters.some((card) => card?.instanceId === sundayId)).toBe(false);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(sundayId);
  });
});
