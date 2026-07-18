import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op01Shanks120,
  op08SHawk114,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP08-114 S-Hawk", () => {
  test("with DON!! and fewer Life gains +2000 and survives battle against Slash", () => {
    const engine = OnePieceTestEngine.create(
      {
        life: 3,
        character: [{ card: op01Shanks120, playedOnTurn: 0 }],
      },
      {
        life: 1,
        character: [{ card: op08SHawk114, attachedDon: 1, rested: true }],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", op01Shanks120);
    const sHawkId = engine.findCardInZone("north", "character", op08SHawk114);

    expect(
      engine.getView("south").players.north.characters.find((card) => card?.instanceId === sHawkId)
        ?.power,
    ).toBe((op08SHawk114.power ?? 0) + 2000);

    engine.declareAttack(attackerId, sHawkId, "south");

    const view = engine.getView("south");
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(sHawkId);
    expect(view.players.north.trash.map((card) => card.instanceId)).not.toContain(sHawkId);
  });

  test("the same permanent conditions do not protect it from a non-Slash attacker", () => {
    const engine = OnePieceTestEngine.create(
      {
        life: 3,
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      },
      {
        life: 1,
        character: [{ card: op08SHawk114, attachedDon: 1, rested: true }],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const sHawkId = engine.findCardInZone("north", "character", op08SHawk114);

    expect(
      engine.getView("south").players.north.characters.find((card) => card?.instanceId === sHawkId)
        ?.power,
    ).toBe((op08SHawk114.power ?? 0) + 2000);
    engine.declareAttack(attackerId, sHawkId, "south");

    expect(engine.getView("south").players.north.trash.map((card) => card.instanceId)).toContain(
      sHawkId,
    );
  });

  test("at 2 or less Life trashes a hand card and plays its physical Trigger card", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        hand: [eb01Doma005],
        life: [op08SHawk114, eb01Fourtricks025],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const sHawkId = engine.findCardInZone("north", "life", op08SHawk114);
    const discardId = engine.findCardInZone("north", "hand", eb01Doma005);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "north");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "north");

    const view = engine.getView("north");
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(sHawkId);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(discardId);
    expect(view.prompts).toHaveLength(0);
  });

  test("above 2 Life still pays the Trigger cost but does not play itself", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        hand: [eb01Doma005],
        life: [op08SHawk114, eb01Doma005, eb01Fourtricks025, eb01MountainGod018],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const sHawkId = engine.findCardInZone("north", "life", op08SHawk114);
    const discardId = engine.findCardInZone("north", "hand", eb01Doma005);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "north");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "north");

    const view = engine.getView("north");
    expect(view.players.north.characters.map((card) => card?.instanceId)).not.toContain(sHawkId);
    expect(view.players.north.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([sHawkId, discardId]),
    );
    expect(view.prompts).toHaveLength(0);
  });
});
