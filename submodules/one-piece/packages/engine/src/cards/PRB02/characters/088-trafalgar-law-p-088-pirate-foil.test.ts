import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op01TrafalgarLaw002, op02Sanji026 } from "@tcg/op-cards";
import { prb02ShanksP083PirateFoil083 } from "../../../../../cards/src/cards/PRB02/characters/083-shanks-p-083-pirate-foil.ts";
import { prb02TrafalgarLawP088PirateFoil088 } from "../../../../../cards/src/cards/PRB02/characters/088-trafalgar-law-p-088-pirate-foil.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("P-088 Trafalgar Law - P-088 (Pirate Foil)", () => {
  test("Life Trigger plays this physical card for an included Supernovas Leader at five total Life", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: prb02ShanksP083PirateFoil083, playedOnTurn: 0 }],
        life: [eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005],
      },
      {
        leaderCardId: op01TrafalgarLaw002,
        life: [prb02TrafalgarLawP088PirateFoil088],
        deck: [eb01Doma005, eb01Doma005, eb01Doma005],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", prb02ShanksP083PirateFoil083);
    const lawId = engine.findCardInZone("north", "life", prb02TrafalgarLawP088PirateFoil088);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    expect(engine.pendingDecision("lifeTrigger", "north").actorId).toBe("north");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const view = engine.getView("north");
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(lawId);
    expect(view.players.north.hand.map((card) => card.instanceId)).not.toContain(lawId);
    expect(view.prompts).toHaveLength(0);
  });

  test("Life Trigger does not play the card when total Life remains six after taking damage", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: prb02ShanksP083PirateFoil083, playedOnTurn: 0 }],
        life: [eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005],
      },
      {
        leaderCardId: op01TrafalgarLaw002,
        life: [prb02TrafalgarLawP088PirateFoil088],
        deck: [eb01Doma005, eb01Doma005, eb01Doma005],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", prb02ShanksP083PirateFoil083);
    const lawId = engine.findCardInZone("north", "life", prb02TrafalgarLawP088PirateFoil088);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const view = engine.getView("north");
    expect(view.players.north.characters.map((card) => card?.instanceId)).not.toContain(lawId);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(lawId);
    expect(view.prompts).toHaveLength(0);
  });

  test("Life Trigger does not play the card when the Leader lacks Supernovas", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: prb02ShanksP083PirateFoil083, playedOnTurn: 0 }],
        life: [eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005],
      },
      {
        leaderCardId: op02Sanji026,
        life: [prb02TrafalgarLawP088PirateFoil088],
        deck: [eb01Doma005, eb01Doma005, eb01Doma005],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", prb02ShanksP083PirateFoil083);
    const lawId = engine.findCardInZone("north", "life", prb02TrafalgarLawP088PirateFoil088);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const view = engine.getView("north");
    expect(view.players.north.characters.map((card) => card?.instanceId)).not.toContain(lawId);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(lawId);
    expect(view.prompts).toHaveLength(0);
  });
});
