import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb03Yamato057,
  op01KouzukiOden031,
  op01Shanks120,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB03-057 Yamato", () => {
  test("gives three rested DON!! to an included Land of Wano Leader", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op01KouzukiOden031,
      hand: [eb03Yamato057],
      activeDon: eb03Yamato057.cost,
      restedDon: 3,
    });
    engine.playCard(eb03Yamato057, "south");

    const donCount = engine.pendingDecision("effectGiveDonCount", "south").steps[0];
    expect(donCount?.kind).toBe("chooseOption");
    if (donCount?.kind !== "chooseOption") throw new Error("Expected Yamato's DON!! count.");
    expect(donCount.options.map((option) => option.id)).toEqual(["0", "1", "2", "3"]);
    engine.resolveDecision("effectGiveDonCount", { optionId: "3" }, "south");

    expect(engine.getView("south").players.south.leader.attachedDon).toBe(3);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("trashes up to one opposing top Life card when K.O.'d", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb03Yamato057, rested: true, playedOnTurn: 0 }],
      },
      {
        character: [{ card: op01Shanks120, playedOnTurn: 0 }],
        life: [eb01Doma005, eb01Fourtricks025],
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const yamatoId = engine.findCardInZone("south", "character", eb03Yamato057);
    const opponentTopLifeId = engine.findCardInZone("north", "life", eb01Doma005);
    const attackerId = engine.findCardInZone("north", "character", op01Shanks120);

    engine.declareAttack(attackerId, yamatoId, "north");

    const lifeCount = engine.pendingDecision("effectRemoveFromLifeCount", "south").steps[0];
    expect(lifeCount?.kind).toBe("chooseOption");
    if (lifeCount?.kind !== "chooseOption") throw new Error("Expected Yamato's Life count.");
    expect(lifeCount.options.map((option) => option.id)).toEqual(["0", "1"]);
    engine.resolveDecision("effectRemoveFromLifeCount", { optionId: "1" }, "south");

    const view = engine.getView("south");
    expect(view.players.north.lifeCount).toBe(1);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(opponentTopLifeId);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(yamatoId);
    expect(view.prompts).toHaveLength(0);
  });
});
