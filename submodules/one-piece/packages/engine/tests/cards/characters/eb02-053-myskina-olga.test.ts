import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  eb02MyskinaOlga053,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB02-053 Myskina Olga", () => {
  test("privately repositions either player's top Life on play and when another Olga is K.O.'d", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [eb02MyskinaOlga053],
        character: [{ card: eb02MyskinaOlga053, rested: true, playedOnTurn: 0 }],
        life: [eb01Doma005, eb01Fourtricks025],
        deck: [eb01Doma005],
        activeDon: 3,
      },
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
        life: [eb01Fourtricks025, eb01Doma005],
        deck: [eb01Doma005, eb01Doma005],
      },
      { firstPlayer: "south", activeSeat: "south" },
    );
    const koOlgaId = engine.findCardInZone("south", "character", eb02MyskinaOlga053);
    const opposingTopLifeId = engine.findCardInZone("north", "life", eb01Fourtricks025);
    const ownTopLifeId = engine.findCardInZone("south", "life", eb01Doma005);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.playCard(eb02MyskinaOlga053, "south");
    const onPlayOwner = engine.pendingDecision("effectLookAtLifeOwner", "south").steps[0];
    expect(onPlayOwner?.kind).toBe("chooseOption");
    if (onPlayOwner?.kind !== "chooseOption") throw new Error("Expected Olga's Life owner choice.");
    expect(onPlayOwner.options.map((option) => option.id)).toEqual(["skip", "self", "opponent"]);
    engine.resolveDecision("effectLookAtLifeOwner", { optionId: "opponent" }, "south");
    expect(engine.pendingDecision("effectLookAtLifePosition", "south").message).toContain(
      eb01Fourtricks025.name,
    );
    expect(JSON.stringify(engine.getView("north").decisions)).not.toContain(eb01Fourtricks025.name);
    engine.resolveDecision("effectLookAtLifePosition", { optionId: "bottom" }, "south");
    expect(engine.getState().players.north.life.at(-1)).toBe(opposingTopLifeId);

    engine.endTurn("south");
    engine.declareAttack(attackerId, koOlgaId, "north");

    const onKoOwner = engine.pendingDecision("effectLookAtLifeOwner", "south").steps[0];
    expect(onKoOwner?.kind).toBe("chooseOption");
    if (onKoOwner?.kind !== "chooseOption") throw new Error("Expected Olga's On K.O. Life choice.");
    engine.resolveDecision("effectLookAtLifeOwner", { optionId: "self" }, "south");
    engine.resolveDecision("effectLookAtLifePosition", { optionId: "bottom" }, "south");

    expect(engine.getState().players.south.life.at(-1)).toBe(ownTopLifeId);
    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
      koOlgaId,
    );
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
