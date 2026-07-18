import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  eb03Nami053,
  eb03Stussy043,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB03-053 Nami", () => {
  test("gives rested DON!! to the Leader, then may move the opponent's top Life to hand at 3 Life", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [eb03Nami053],
        activeDon: eb03Nami053.cost,
        restedDon: 1,
      },
      {
        life: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018],
      },
    );
    const opponentLifeTopId = engine.findCardInZone("north", "life", eb01Doma005);

    engine.playCard(eb03Nami053, "south");
    const giveDon = engine.pendingDecision("effectGiveDonCount", "south").steps[0];
    expect(giveDon?.kind).toBe("chooseOption");
    if (giveDon?.kind !== "chooseOption") throw new Error("Expected Nami's DON!! count.");
    expect(giveDon.options.map((option) => option.id)).toEqual(["0", "1"]);
    engine.resolveDecision("effectGiveDonCount", { optionId: "1" }, "south");

    const lifeCount = engine.pendingDecision("effectRemoveFromLifeCount", "south").steps[0];
    expect(lifeCount?.kind).toBe("chooseOption");
    if (lifeCount?.kind !== "chooseOption") throw new Error("Expected Nami's Life count.");
    expect(lifeCount.options.map((option) => option.id)).toEqual(["0", "1"]);
    engine.resolveDecision("effectRemoveFromLifeCount", { optionId: "1" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.leader.attachedDon).toBe(1);
    expect(view.players.north.lifeCount).toBe(2);
    expect(engine.getView("north").players.north.hand.map((card) => card.instanceId)).toContain(
      opponentLifeTopId,
    );
    expect(view.prompts).toHaveLength(0);
  });

  test("turns the top Life face-up on K.O. and plays only a 6000-power-or-less Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb03Nami053, rested: true, playedOnTurn: 0 }],
        hand: [eb01Doma005, eb03Stussy043],
        life: [eb01Fourtricks025],
      },
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const namiId = engine.findCardInZone("south", "character", eb03Nami053);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const eligibleId = engine.findCardInZone("south", "hand", eb01Doma005);
    const excludedId = engine.findCardInZone("south", "hand", eb03Stussy043);
    const lifeId = engine.findCardInZone("south", "life", eb01Fourtricks025);

    engine.declareAttack(attackerId, namiId, "north");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    expect(play?.kind).toBe("selectEntity");
    if (play?.kind !== "selectEntity") throw new Error("Expected Nami's play choice.");
    expect(play.candidates.map((candidate) => candidate.ref.id)).toEqual([eligibleId]);
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedId);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.some((card) => card?.instanceId === eligibleId)).toBe(
      true,
    );
    expect(engine.getState().cards[lifeId]?.faceUp).toBe(true);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(namiId);
    expect(view.prompts).toHaveLength(0);
  });
});
