import { describe, expect, test } from "vite-plus/test";
import {
  eb01MountainGod018,
  op01Mr1DazBonez083,
  op01Mr3Galdino085,
  op01OfficerAgents087,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP01-087 Officer Agents", () => {
  test("pays for the Counter Event then maps the low-cost Baroque Works Character play", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      },
      {
        hand: [op01OfficerAgents087, op01Mr1DazBonez083, op01Mr3Galdino085],
        activeDon: 2,
        life: 2,
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const eventId = engine.findCardInZone("north", "hand", op01OfficerAgents087);
    const selectedId = engine.findCardInZone("north", "hand", op01Mr1DazBonez083);
    const otherId = engine.findCardInZone("north", "hand", op01Mr3Galdino085);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [eventId] }, "north");

    const playDecision = engine.pendingDecision("effectPlaySelection", "north");
    const playStep = playDecision.steps[0];
    expect(playStep?.kind).toBe("selectEntity");
    if (playStep?.kind !== "selectEntity") {
      throw new Error("Expected the defender to choose a Baroque Works Character to play.");
    }
    expect(playStep.candidates.map((candidate) => candidate.ref.id)).toEqual([selectedId, otherId]);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [selectedId] }, "north");

    const view = engine.getView("north");
    expect(view.players.north.characters.some((card) => card?.instanceId === selectedId)).toBe(
      true,
    );
    expect(view.players.north.hand.map((card) => card.instanceId)).toContain(otherId);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(eventId);
    expect(view.players.north).toMatchObject({ activeDon: 0, restedDon: 2 });
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("activates the Counter effect from Life without paying the Event cost", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      },
      {
        hand: [op01Mr1DazBonez083],
        life: [op01OfficerAgents087],
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const selectedId = engine.findCardInZone("north", "hand", op01Mr1DazBonez083);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "north");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    engine.resolveDecision("effectPlaySelection", { selectedIds: [selectedId] }, "north");

    const view = engine.getView("north");
    expect(view.players.north.characters.some((card) => card?.instanceId === selectedId)).toBe(
      true,
    );
    expect(view.players.north).toMatchObject({ activeDon: 0, restedDon: 0 });
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
