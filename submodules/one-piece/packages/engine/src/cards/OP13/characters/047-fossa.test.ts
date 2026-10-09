import { eb01Doma005, eb01Fourtricks025, op01Kaido094, op12UrsaShock096 } from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { op13Fossa047 } from "../../../../../cards/src/cards/characters/op13-047-fossa.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP13-047 Fossa", () => {
  test("may trash itself instead of an opponent effect K.O.'ing an included Whitebeard Pirates Character", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op13Fossa047, eb01Doma005] },
      { hand: [op12UrsaShock096], activeDon: op12UrsaShock096.cost },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const fossaId = engine.findCardInZone("south", "character", op13Fossa047);
    const protectedId = engine.findCardInZone("south", "character", eb01Doma005);

    engine.playCard(op12UrsaShock096, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [protectedId] }, "north");
    const replacement = engine.pendingDecision("effectKoReplacement", "south");
    expect(replacement.actorId).toBe("south");
    engine.resolveDecision("effectKoReplacement", { optionId: "yes" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(protectedId);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(fossaId);
    expect(view.prompts).toHaveLength(0);
  });

  test("does not replace an opponent effect K.O. for a nonmatching Character", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op13Fossa047, eb01Fourtricks025] },
      { hand: [op12UrsaShock096], activeDon: op12UrsaShock096.cost },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const fossaId = engine.findCardInZone("south", "character", op13Fossa047);
    const targetId = engine.findCardInZone("south", "character", eb01Fourtricks025);

    engine.playCard(op12UrsaShock096, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "north");

    const view = engine.getView("south");
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(fossaId);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(targetId);
    expect(view.prompts).toHaveLength(0);
  });

  test("does not replace a battle K.O. of a matching Character", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op13Fossa047, { card: eb01Doma005, rested: true, playedOnTurn: 0 }] },
      { character: [{ card: op01Kaido094, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const fossaId = engine.findCardInZone("south", "character", op13Fossa047);
    const targetId = engine.findCardInZone("south", "character", eb01Doma005);
    const attackerId = engine.findCardInZone("north", "character", op01Kaido094);

    engine.declareAttack(attackerId, targetId, "north");

    const view = engine.getView("south");
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(fossaId);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(targetId);
    expect(view.prompts).toHaveLength(0);
  });
  test("can trash itself to replace its own effect K.O. without a K.O. observer firing", () => {
    const engine = OnePieceTestEngine.create(
      { character: ["OP13-047"] },
      { leaderCardId: "OP01-061", hand: ["OP08-117"], activeDon: 5, life: 1, donDeckCount: 5 },
      { activeSeat: "north" },
    );
    const source = engine.findCardInZone("south", "character", "OP13-047");
    engine.asNorth().play("OP08-117");
    engine.asNorth().acceptOptional();
    engine.asNorth().chooseTargets(source);
    engine.resolveDecision("effectKoReplacement", { optionId: "yes" }, "south");
    expect(engine.getView("south").players.south.trash.map((c) => c.instanceId)).toContain(source);
    expect(engine.getView("north").players.north.donDeckCount).toBe(5);
    expect(engine.getView("north").prompts).toHaveLength(0);
  });
});
