import { describe, expect, it } from "vitest";
import {
  fleshAndBloodServerAdapter,
  FleshAndBloodServerEngine,
} from "@tcg/flesh-and-blood-server-adapter";
import { listLegalCommands } from "@tcg/flesh-and-blood-engine/simulator";
import { restoreFabReplayFork } from "./replay-fork";

async function createRecordedMatch() {
  const cardsMaps = fleshAndBloodServerAdapter.buildCardInstances(
    ["p1", "p2"].map((owner) => ({
      owner,
      deck: [
        { cardId: "rhinar-reckless-rampage", qty: 1, sectionId: "hero" },
        { cardId: "jBtfGzCwLCCTGrtzKPRJW", qty: 8, sectionId: "main" },
      ],
    })),
  );
  if (!fleshAndBloodServerAdapter.createServerEngine)
    throw new Error("FAB server engine is unavailable");
  const engine = await fleshAndBloodServerAdapter.createServerEngine({
    gameSlug: "flesh-and-blood",
    seed: "replay-continuation",
    player1Id: "p1",
    player2Id: "p2",
    cardsMaps,
  });
  if (!(engine instanceof FleshAndBloodServerEngine)) throw new Error("Expected FAB runtime");
  return engine;
}

describe("FAB replay continuation contract", () => {
  it("restores real hidden cards and accepts a new move without altering the source", async () => {
    const source = await createRecordedMatch();
    const attack = listLegalCommands(source.runtime, "p1").find(
      (command) => command.move === "begin-play",
    );
    if (!attack) throw new Error("Expected a playable attack");
    expect(source.runtime.dispatch(attack.move, "p1", attack.payload).accepted).toBe(true);
    const original = source.runtime.snapshot();
    const fork = await restoreFabReplayFork(source.getReplayForkState());
    expect(fork.runtime.snapshot()).toEqual(original);
    expect(fork.runtime.dispatch("pass", "p1", {}).accepted).toBe(true);
    expect(fork.runtime.dispatch("pass", "p2", {}).accepted).toBe(true);
    expect(fork.runtime.dispatch("pass", "p1", {}).accepted).toBe(true);
    expect(fork.runtime.dispatch("pass", "p2", {}).accepted).toBe(true);
    const defense = listLegalCommands(fork.runtime, "p2").find(
      (command) => command.move === "defend",
    );
    if (!defense) throw new Error("Expected a legal defense after restoring the announced attack");
    const result = fork.runtime.dispatch(defense.move, fork.player2Id, defense.payload);
    expect(result.accepted).toBe(true);
    expect(fork.runtime.getStateID()).toBeGreaterThan(source.runtime.getStateID());
    expect(source.runtime.snapshot()).toEqual(original);
  });

  it("rejects a public viewer projection instead of creating fake hidden cards", async () => {
    const source = await createRecordedMatch();
    await expect(
      restoreFabReplayFork({
        snapshot: source.runtime.viewer({ role: "replay" }),
        cardDefinitionIds: Object.keys(source.runtime.getState().cardDefinitions),
      }),
    ).rejects.toThrow("The saved engine version is not supported");
  });
});
