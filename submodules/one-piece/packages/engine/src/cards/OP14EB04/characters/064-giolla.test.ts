import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op12UrsaShock096,
  op13Otama043,
} from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { op14eb04Giolla064 } from "../../../../../cards/src/cards/OP14EB04/characters/064-giolla.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP14-064 Giolla", () => {
  test("on K.O. may add one rested DON, then K.O. an opposing printed base-power-0 Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [op14eb04Giolla064],
        donDeckCount: 1,
      },
      {
        hand: [op12UrsaShock096],
        character: [{ card: op13Otama043, attachedDon: 1 }, eb01Doma005],
        deck: [eb01Fourtricks025, eb01MountainGod018],
        activeDon: op12UrsaShock096.cost,
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const giollaId = engine.findCardInZone("south", "character", op14eb04Giolla064);
    const zeroBasePowerId = engine.findCardInZone("north", "character", op13Otama043);
    const nonzeroBasePowerId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.playCard(op12UrsaShock096, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [giollaId] }, "north");

    const addDon = engine.pendingDecision("effectAddDon", "south").steps[0];
    if (addDon?.kind !== "chooseOption") throw new Error("Expected Giolla's DON!! choice.");
    expect(addDon.options.map((option) => option.id)).toEqual(["0", "1"]);
    engine.resolveDecision("effectAddDon", { optionId: "1" }, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Giolla's K.O. target.");
    expect(target).toMatchObject({ min: 0, max: 1 });
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(zeroBasePowerId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(
      nonzeroBasePowerId,
    );
    engine.resolveDecision("effectTargetSelection", { selectedIds: [zeroBasePowerId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(giollaId);
    expect(view.players.south).toMatchObject({ restedDon: 1, donDeckCount: 0 });
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(zeroBasePowerId);
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(
      nonzeroBasePowerId,
    );
    expect(view.prompts).toHaveLength(0);
  });

  test("may add no DON and K.O. no Character while completing both up-to actions", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [op14eb04Giolla064],
        donDeckCount: 1,
      },
      {
        hand: [op12UrsaShock096],
        character: [op13Otama043],
        deck: [eb01Doma005, eb01Fourtricks025],
        activeDon: op12UrsaShock096.cost,
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const giollaId = engine.findCardInZone("south", "character", op14eb04Giolla064);
    const untouchedId = engine.findCardInZone("north", "character", op13Otama043);

    engine.playCard(op12UrsaShock096, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [giollaId] }, "north");
    engine.resolveDecision("effectAddDon", { optionId: "0" }, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({ restedDon: 0, donDeckCount: 1 });
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(untouchedId);
    expect(view.players.north.trash.map((card) => card.instanceId)).not.toContain(untouchedId);
    expect(view.prompts).toHaveLength(0);
  });
});
