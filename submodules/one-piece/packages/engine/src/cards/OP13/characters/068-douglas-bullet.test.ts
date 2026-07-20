import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op01RoronoaZoro001, op13GolDRoger003 } from "@tcg/op-cards";
import { op13DouglasBullet068 } from "../../../../../cards/src/cards/OP13/characters/068-douglas-bullet.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP13-068 Douglas Bullet", () => {
  test("with an included Roger Pirates Leader, adds one rested DON!! and crosses the eight-DON power threshold", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op13GolDRoger003,
      hand: [op13DouglasBullet068],
      character: [{ card: eb01Doma005, attachedDon: 1 }],
      activeDon: op13DouglasBullet068.cost,
      restedDon: 3,
      donDeckCount: 1,
    });

    engine.playCard(op13DouglasBullet068, "south");
    const bulletId = engine.findCardInZone("south", "character", op13DouglasBullet068);
    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === bulletId)
        ?.power,
    ).toBe(op13DouglasBullet068.power);

    const decision = engine.pendingDecision("effectAddDon", "south");
    expect(decision.actorId).toBe("south");
    expect(decision.steps[0]).toMatchObject({
      kind: "chooseOption",
      options: [{ id: "0" }, { id: "1" }],
    });
    engine.resolveDecision("effectAddDon", { optionId: "1" }, "south");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({ restedDon: 7, donDeckCount: 0 });
    expect(view.players.south.characters.find((card) => card?.instanceId === bulletId)?.power).toBe(
      (op13DouglasBullet068.power ?? 0) + 2000,
    );
    expect(view.prompts).toHaveLength(0);
  });

  test("may add zero DON!! and remains below the permanent power threshold", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op13GolDRoger003,
      hand: [op13DouglasBullet068],
      character: [{ card: eb01Doma005, attachedDon: 1 }],
      activeDon: op13DouglasBullet068.cost,
      restedDon: 3,
      donDeckCount: 1,
    });

    engine.playCard(op13DouglasBullet068, "south");
    const bulletId = engine.findCardInZone("south", "character", op13DouglasBullet068);
    engine.resolveDecision("effectAddDon", { optionId: "0" }, "south");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({ restedDon: 6, donDeckCount: 1 });
    expect(view.players.south.characters.find((card) => card?.instanceId === bulletId)?.power).toBe(
      op13DouglasBullet068.power,
    );
    expect(view.prompts).toHaveLength(0);
  });

  test("without a Roger Pirates Leader, does not add DON!! while its independent eight-DON power bonus still applies", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op01RoronoaZoro001,
      hand: [op13DouglasBullet068],
      character: [{ card: eb01Doma005, attachedDon: 1 }],
      activeDon: op13DouglasBullet068.cost,
      restedDon: 4,
      donDeckCount: 1,
    });

    engine.playCard(op13DouglasBullet068, "south");
    const bulletId = engine.findCardInZone("south", "character", op13DouglasBullet068);

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({ restedDon: 7, donDeckCount: 1 });
    expect(view.players.south.characters.find((card) => card?.instanceId === bulletId)?.power).toBe(
      (op13DouglasBullet068.power ?? 0) + 2000,
    );
    expect(view.prompts).toHaveLength(0);
  });
});
