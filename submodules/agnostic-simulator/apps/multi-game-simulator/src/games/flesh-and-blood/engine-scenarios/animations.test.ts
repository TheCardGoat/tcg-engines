import { describe, expect, it } from "vitest";
import { snatchRed } from "./cards";
import { catalogIds } from "@tcg/flesh-and-blood-engine/simulator";
import { getFabEngineScenario } from "./index";
import { presentRuntime } from "../projection";
import { fabBoardTransfers } from "../transfers";
import { nullruneRobe } from "@tcg/flesh-and-blood-cards/cards/equipment/nullrune-robe";
import { volticBoltRed } from "@tcg/flesh-and-blood-cards/cards/actions/voltic-bolt";

// The playground uses the same state-derived transfers as hosted and practice boards.
describe("FAB animation playground engine fixtures", () => {
  it("pauses the Arcane Barrier fixture on the defending player's real prevention choice", () => {
    const scenario = getFabEngineScenario("damage-prevention");
    const match = scenario?.boot();
    if (!scenario || !match) throw new Error("Missing damage prevention scenario.");

    const wait = match.runtime.waitState();
    if (wait.kind !== "decision" || wait.decision.kind !== "option") {
      throw new Error("Expected the Arcane Barrier option decision.");
    }
    const presentation = presentRuntime(match.runtime, scenario.viewerId);

    expect(scenario.viewerId).toBe(match.player2Id);
    expect(wait.decision.actorId).toBe(scenario.viewerId);
    expect(wait.decision.label).toBe("Prevent incoming arcane damage?");
    expect(wait.decision.presentation).toEqual({
      kind: "direct",
      description: "Voltic Bolt would deal 5 arcane damage.",
      emptyLabel: "Take 5 arcane damage",
    });
    expect(wait.decision.options).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.stringMatching(/:arcane-barrier$/),
          label: "Nullrune Robe · Pay 1 resource · Prevent 1 · Take 4",
        }),
      ]),
    );
    expect(
      Object.values(presentation.cards).some(
        (card) =>
          card.ownerId === scenario.viewerId &&
          card.zone === "chest" &&
          card.cardId === nullruneRobe.canonicalId,
      ),
    ).toBe(true);
    expect(
      Object.values(presentation.cards).some(
        (card) => card.cardId === volticBoltRed.canonicalId && card.zone === "stack",
      ),
    ).toBe(true);
  });

  it("moves Snatch directly to the displayed combat chain", () => {
    const match = getFabEngineScenario("dual-target-open")!.boot();
    const player = match.engine.as(catalogIds.rhinar);
    const before = presentRuntime(match.engine.getRuntime(), player.id);
    player.playAttack(snatchRed);
    const after = presentRuntime(match.engine.getRuntime(), player.id);
    const plan = fabBoardTransfers(before, after, "play", player.id);
    expect(plan?.steps).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: "entityTransfer",
          from: expect.objectContaining({ id: `${player.id}:hand` }),
          to: expect.objectContaining({ id: `${player.id}:combat-chain` }),
        }),
      ]),
    );
    expect(plan?.steps.every((step) => step.type === "entityTransfer")).toBe(true);
  });
});
