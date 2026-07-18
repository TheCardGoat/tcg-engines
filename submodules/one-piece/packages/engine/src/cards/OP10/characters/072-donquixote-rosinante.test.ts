import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op10DonquixoteRosinante072,
  op10GodThread079,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP10-072 Donquixote Rosinante", () => {
  test("may trash exactly an Event from hand to draw 2 cards", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op10DonquixoteRosinante072, op10GodThread079, eb01Doma005],
      deck: [eb01Doma005, eb01MountainGod018, eb01Doma005],
      activeDon: 5,
    });
    const eventId = engine.findCardInZone("south", "hand", op10GodThread079);
    const characterId = engine.findCardInZone("south", "hand", eb01Doma005);

    engine.playCard(op10DonquixoteRosinante072, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(eventId);
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(characterId);
    expect(view.players.south.hand).toHaveLength(3);
    expect(view.prompts).toHaveLength(0);
  });

  test("at turn end with 7 DON!! sets up to 2 rested DON!! active", () => {
    const engine = OnePieceTestEngine.create({
      character: [op10DonquixoteRosinante072],
      restedDon: 7,
      deck: [eb01Doma005, eb01Doma005],
    });

    engine.endTurn("south");
    const target = engine.pendingDecision("effectSetActiveDon", "south").steps[0];
    expect(target?.kind).toBe("chooseOption");
    engine.resolveDecision("effectSetActiveDon", { optionId: "2" }, "south");

    expect(engine.getView("south").players.south).toMatchObject({ activeDon: 2, restedDon: 5 });
  });
});
