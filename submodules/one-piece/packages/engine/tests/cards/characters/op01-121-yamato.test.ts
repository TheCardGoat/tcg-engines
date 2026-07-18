import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op01Kawamatsu037,
  op01Yamato121,
} from "@tcg/op-cards";

import { cardNames } from "../../../src/shared.ts";
import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP01-121 Yamato", () => {
  test("has the Kouzuki Oden rules name and banishes two Life cards without Trigger", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op01Yamato121, playedOnTurn: 0 }],
      },
      {
        life: [op01Kawamatsu037, eb01Doma005, eb01Fourtricks025, eb01MountainGod018, eb01Doma005],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const yamatoId = engine.findCardInZone("south", "character", op01Yamato121);
    const triggerLifeId = engine.findCardInZone("north", "life", op01Kawamatsu037);
    const lifeBefore = engine.getView("south").players.north.lifeCount;

    expect(cardNames(op01Yamato121)).toContain("Kouzuki Oden");
    engine.declareAttack(yamatoId, engine.leader("north"), "south");

    const view = engine.getView("south");
    expect(view.players.north.lifeCount).toBe(lifeBefore - 2);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(triggerLifeId);
    expect(view.players.north.characters.some((card) => card?.instanceId === triggerLifeId)).toBe(
      false,
    );
    expect(view.prompts).toHaveLength(0);
  });
});
