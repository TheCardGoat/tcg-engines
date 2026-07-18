import { describe, expect, test } from "vite-plus/test";
import { op03Kaku059, op03UsoppSRubberBandOfDoom054 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP03-059 Kaku", () => {
  test("may pay DON!! -1 to gain Banish for the battle", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op03Kaku059, playedOnTurn: 0 }], activeDon: 1 },
      { life: [op03UsoppSRubberBandOfDoom054] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const kakuId = engine.findCardInZone("south", "character", op03Kaku059);
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;
    engine.declareAttack(kakuId, engine.leader("north"), "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({ activeDon: 0, donDeckCount: donDeckBefore + 1 });
    expect(view.players.north.lifeCount).toBe(0);
    expect(view.players.north.trash.map((card) => card.cardId)).toContain(
      op03UsoppSRubberBandOfDoom054.id,
    );
    expect(() => engine.pendingDecision("lifeTrigger", "north")).toThrow();
  });

  test("may decline without returning DON!!", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op03Kaku059, playedOnTurn: 0 }], activeDon: 1 },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const kakuId = engine.findCardInZone("south", "character", op03Kaku059);
    const donBefore = engine.getView("south").players.south.activeDon;
    engine.declareAttack(kakuId, engine.leader("north"), "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");
    expect(engine.getView("south").players.south.activeDon).toBe(donBefore);
  });
});
