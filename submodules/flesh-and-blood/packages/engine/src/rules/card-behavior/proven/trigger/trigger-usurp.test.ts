/**
 * GENERATED AAA PLAN — do not mark complete without production proof.
 * Behavior: trigger:usurp
 * Representative card: packages/cards/src/cards/instants/runechant-of-greed.ts
 * Canonical id: MT8LQJTF6w8gPqMzNTrkr
 *
 * Arrange: import the representative real card and establish a legal,
 * player-reachable match state with the required heroes, zones, resources,
 * targets, counters, and opponent responses.
 * Act: dispatch only production FabTestEngine moves (play, pitch, defend,
 * resolve prompts, pass priority, and end the relevant phase).
 * Assert: verify player-visible outcomes such as life, zones, AP/resources,
 * combat state, prompts, legality error codes, or game result. Include the
 * negative/boundary case and any timing or interaction case before completion.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash } from "../../../fixtures.ts";
import { runechantOfGreedYellow } from "../../../../../../cards/src/cards/instants/runechant-of-greed.ts";
import { sinspeakerGloombladeRed } from "../../../../../../cards/src/cards/actions/sinspeaker-gloomblade.ts";
import { snatchRed } from "../../../fixtures.ts";

describe("trigger: usurp", () => {
  it("Greed draws for its controller after it is destroyed as an Usurp cost", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [sinspeakerGloombladeRed],
        arena: [runechantOfGreedYellow],
        deck: [snatchRed, snatchRed],
      },
      { hero: dash, hand: [], life: 20, deck: 4 },
      { autoPassPriority: false },
    );
    const player = game.as(bravo);
    player.play(sinspeakerGloombladeRed);
    player.target(runechantOfGreedYellow);
    game.advanceUntil({ stopAt: "defend" });
    expect(player.zone("graveyard")).toContain(runechantOfGreedYellow.canonicalId);
    expect(player.zone("hand")).toEqual([snatchRed.canonicalId]);
    expect(game.as(dash).zone("hand")).toHaveLength(0);
  });

  it("AAA boundary — Arrange: Runechant of Greed in arena; Act: non-usurp attack cannot target the aura", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 4 },
      {
        hero: dash,
        life: 20,
        arena: [runechantOfGreedYellow],
        deck: 4,
      },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);
    const auraId = Dash.findCardInZone("arena", runechantOfGreedYellow);

    const rejection = Bravo.expectFailure({
      move: "begin-play",
      payload: {
        instanceId: Bravo.findCardInZone("hand", snatchRed),
        target: auraId,
      },
    });
    expect(rejection.errorCode).toBe("illegal_attack_target");
    expect(Dash.zone("arena")).toContain(runechantOfGreedYellow.canonicalId);
  });
});
