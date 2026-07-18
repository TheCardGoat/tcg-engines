import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  op03UsoppSRubberBandOfDoom054,
  op10Lim037,
  op10Smoker030,
  op14eb04BirdNeptunian016,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP10-030 Smoker", () => {
  test("sets 1 DON!! active and prevents later Character effects from doing so this turn", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op10Lim037],
      character: [op10Smoker030, op14eb04BirdNeptunian016],
      restedDon: 2,
    });
    const smokerId = engine.findCardInZone("south", "character", op10Smoker030);
    const birdId = engine.findCardInZone("south", "character", op14eb04BirdNeptunian016);

    engine.activateEffect(smokerId, "activateMain", "south");
    engine.resolveDecision("effectSetActiveDon", { optionId: "1" }, "south");
    engine.activateEffect(birdId, "activateMain", "south");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({ activeDon: 1, restedDon: 1 });
    expect(view.prompts).toHaveLength(0);

    engine.endTurn("south");
    engine.endTurn("north");
    engine.playCard(op10Lim037, "south");
    engine.activateEffect(birdId, "activateMain", "south");
    engine.resolveDecision("effectSetActiveDon", { optionId: "1" }, "south");

    expect(engine.getView("south").players.south).toMatchObject({ activeDon: 4, restedDon: 0 });
  });

  test("Banish trashes damaged Life without activating its Trigger", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op10Smoker030, playedOnTurn: 0 }] },
      { life: [op03UsoppSRubberBandOfDoom054], character: [eb01Doma005] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const smokerId = engine.findCardInZone("south", "character", op10Smoker030);
    const lifeId = engine.findCardInZone("north", "life", op03UsoppSRubberBandOfDoom054);

    engine.declareAttack(smokerId, engine.leader("north"), "south");

    const view = engine.getView("north");
    expect(view.players.north.lifeCount).toBe(0);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(lifeId);
    expect(() => engine.pendingDecision("lifeTrigger", "north")).toThrow();
  });
});
