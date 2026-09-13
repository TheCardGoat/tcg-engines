/**
 * AAA test for activated create-token with controller: any (target selection).
 * Representative card: Coat of Frost (ELE145) — Ice Chest Equipment.
 * Defense 0.
 * Activated (a1): "Action — Destroy Coat of Frost: Create a Frostbite token
 * under target hero's control. Go again"
 *   → activated: cost destroy-self → effect: create-token { frostbite, controller: any }
 *
 * The "any" controller requires the activating player to choose which hero
 * receives the token. Verifies that targeting the opponent places a Frostbite
 * token under their control.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, coatOfFrost } from "../../../fixtures.ts";

describe("create-token: controller any (Coat of Frost)", () => {
  it("AAA: activating Coat of Frost targeting opponent creates a Frostbite under their control", () => {
    const game = FabTestEngine.start(
      { hero: bravo, chest: [coatOfFrost], deck: 4 },
      { hero: dash, deck: 4 },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);
    const dashId = Dash.id;

    // Activate via the player handle (drains forced decisions only).
    Bravo.activate(coatOfFrost);

    // The controller:any effect produces an entity-target decision for which
    // hero receives the Frostbite token. Answer it — target Dash.
    const decision = game.getState().decision;
    if (decision && decision.kind === "entity-target") {
      const dashInstance =
        decision.candidates.find((c) => c.instanceId === dashId)?.instanceId ??
        decision.candidates[0]?.instanceId;
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "entity-target", instanceIds: [dashInstance] },
        },
      });
    }

    // Equipment destroyed.
    expect(Bravo.zone("chest")).not.toContain(coatOfFrost.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(coatOfFrost.canonicalId);
    // Frostbite token created under Dash's control.
    const dashArena = Dash.zone("arena");
    expect(dashArena.some((id) => id.toLowerCase().includes("frostbite"))).toBe(true);
  });

  it("AAA boundary: before activation the equipment is in the chest zone", () => {
    const game = FabTestEngine.start(
      { hero: bravo, chest: [coatOfFrost], deck: 4 },
      { hero: dash, deck: 4 },
    );
    const Bravo = game.as(bravo);

    expect(Bravo.zone("chest")).toContain(coatOfFrost.canonicalId);
    expect(Bravo.zone("graveyard")).not.toContain(coatOfFrost.canonicalId);
  });
});
