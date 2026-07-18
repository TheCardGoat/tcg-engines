import { describe, expect, test } from "vite-plus/test";
import { eb01MountainGod018, op04Viola021 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP04-021 Viola", () => {
  test("may rest 2 DON!! on an opponent's attack to rest one opposing DON!!", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op04Viola021], activeDon: 2 },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }], activeDon: 2 },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    expect(engine.pendingDecision("effectOptional", "south").actorId).toBe("south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const count = engine.pendingDecision("effectRestDonCount", "south");
    expect(count.actorId).toBe("south");
    expect(count.steps[0]).toMatchObject({
      kind: "chooseOption",
      options: [{ id: "0" }, { id: "1" }],
    });
    engine.resolveDecision("effectRestDonCount", { optionId: "1" }, "south");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({ activeDon: 0, restedDon: 2 });
    expect(view.players.north).toMatchObject({ activeDon: 1, restedDon: 1 });
    expect(view.prompts).toHaveLength(0);
  });

  test("may pay 2 DON!! and choose to rest zero opposing DON!!", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op04Viola021], activeDon: 2 },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }], activeDon: 2 },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectRestDonCount", { optionId: "0" }, "south");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({ activeDon: 0, restedDon: 2 });
    expect(view.players.north).toMatchObject({ activeDon: 2, restedDon: 0 });
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline without resting DON!!", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op04Viola021], activeDon: 2 },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }], activeDon: 1 },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({ activeDon: 2, restedDon: 0 });
    expect(view.players.north).toMatchObject({ activeDon: 1, restedDon: 0 });
    expect(view.prompts).toHaveLength(0);
  });

  test("does not offer the effect without 2 active DON!! to pay its cost", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op04Viola021], activeDon: 1 },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }], activeDon: 1 },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.declareAttack(attackerId, engine.leader("south"), "north");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({ activeDon: 1, restedDon: 0 });
    expect(view.players.north).toMatchObject({ activeDon: 1, restedDon: 0 });
    expect(view.prompts).toHaveLength(0);
  });
});
