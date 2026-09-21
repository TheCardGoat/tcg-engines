import { expect, it, describe } from "vitest";
import { listLegalCommands, visibleFabPlayerLog } from "@tcg/flesh-and-blood-engine/simulator";
import { expectFabPlayer, type FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { getFabEngineScenario } from "./index";
import { catalogIds, warmongerSDiplomacyBlue } from "./cards";
import { projectFabPlayerNarrativeHistory } from "../player-narrative-projection";

function passUntilDecision(game: FabTestEngine): void {
  for (let step = 0; step < 8; step += 1) {
    const wait = game.getRuntime().waitState();
    if (wait.kind !== "priority") return;
    game.pass(wait.playerId);
  }
  throw new Error("Warmonger's Diplomacy fixture priority never resolved into a decision.");
}

describe("FAB engine scenarios · Warmonger's Diplomacy", () => {
  it("freezes at the viewer's war-or-peace decision after the opponent plays", () => {
    const scenario = getFabEngineScenario("warmongers-diplomacy-choice");
    const match = scenario?.boot();
    if (!scenario || !match) {
      throw new Error("Missing Warmonger's Diplomacy choice scenario.");
    }

    expect(scenario.viewerId).toBe(match.player1Id);
    const wait = match.runtime.waitState();
    expect(wait.kind).toBe("decision");
    if (wait.kind !== "decision" || wait.decision.kind !== "effect-resolution") return;
    // "Starting with the hero to your left": the viewer (opponent of the
    // playing hero) answers the prompt first.
    expect(wait.decision.actorId).toBe(match.player1Id);
    expect(wait.decision.options.map((option) => option.id)).toEqual(["war", "peace"]);
  });

  it("opens the resolved fixture at the viewer's action phase with the card playable", () => {
    const scenario = getFabEngineScenario("warmongers-diplomacy-resolved");
    const match = scenario?.boot();
    if (!scenario || !match) {
      throw new Error("Missing Warmonger's Diplomacy resolved scenario.");
    }

    // Nothing has happened yet: the viewer holds priority on their own turn.
    expect(match.runtime.waitState()).toMatchObject({
      kind: "priority",
      playerId: match.player1Id,
    });

    // Warmonger's Diplomacy sits in hand and is legal to play right now.
    const state = match.runtime.getState();
    const hand = state.containers.zonesByPlayerId[match.player1Id]?.hand ?? [];
    const diplomacyId = hand.find(
      (instanceId) =>
        state.objects[instanceId]?.canonicalId === warmongerSDiplomacyBlue.canonicalId,
    );
    expect(diplomacyId).toBeDefined();
    expect(
      listLegalCommands(match.runtime, match.player1Id).some(
        (command) => command.sourceInstanceId === diplomacyId,
      ),
    ).toBe(true);
  });

  it("drives the pre-play fixture through the play, both prompts, and the stamps", () => {
    const scenario = getFabEngineScenario("warmongers-diplomacy-resolved");
    const match = scenario?.boot();
    if (!scenario || !match) {
      throw new Error("Missing Warmonger's Diplomacy resolved scenario.");
    }

    const Bravo = match.engine.as(catalogIds.bravo);
    const Rhinar = match.engine.as(catalogIds.rhinar);
    Bravo.play(warmongerSDiplomacyBlue.canonicalId);
    passUntilDecision(match.engine);

    // "Starting with the hero to your left": the bot seat answers first.
    const firstChoice = match.runtime.waitState();
    expect(firstChoice.kind).toBe("decision");
    if (firstChoice.kind !== "decision" || firstChoice.decision.kind !== "effect-resolution") {
      return;
    }
    expect(firstChoice.decision.actorId).toBe(match.player2Id);
    Rhinar.choose("war");
    passUntilDecision(match.engine);
    Bravo.choose("war");

    expectFabPlayer(Bravo).toHaveDiplomacyChoice("war");
    expectFabPlayer(Rhinar).toHaveDiplomacyChoice("war");
    expect(match.runtime.waitState()).toMatchObject({
      kind: "priority",
      playerId: match.player1Id,
    });
  });

  it("projects the viewer's own play into the viewer's history rows", () => {
    const scenario = getFabEngineScenario("warmongers-diplomacy-resolved");
    const match = scenario?.boot();
    if (!scenario || !match) {
      throw new Error("Missing Warmonger's Diplomacy resolved scenario.");
    }

    // Drive the play the way the fixture user would from the about-to-play
    // state, then confirm the narrative carries the viewer's play row.
    match.engine.as(catalogIds.bravo).play(warmongerSDiplomacyBlue.canonicalId);
    const viewerId = match.player1Id;
    const rows = projectFabPlayerNarrativeHistory(
      match.engine.playerNarratives().map((log) => visibleFabPlayerLog(log, viewerId)),
      { viewerId, seatIds: [match.player1Id, match.player2Id] },
    );
    const playRow = rows.find((row) => row.title.includes("Warmonger's Diplomacy"));
    expect(
      playRow,
      `expected a history row for the viewer's play; got: ${rows.map((row) => row.title).join(" | ")}`,
    ).toBeDefined();
    expect(playRow?.actorSeatId).toBe(match.player1Id);
  });
});
