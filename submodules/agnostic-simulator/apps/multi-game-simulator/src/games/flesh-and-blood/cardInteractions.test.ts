import { describe, expect, it } from "vitest";
import type { FabLegalCommand } from "@tcg/flesh-and-blood-engine/simulator";
import {
  projectFabAttackTargetCardActions,
  projectFabCardActions,
  sourceCardIds,
} from "./cardInteractions";

describe("FAB card action projection", () => {
  it("uses instanceId and instanceIds, never a generic player target", () => {
    const commands: FabLegalCommand[] = [
      {
        move: "begin-play",
        label: "Attack hero",
        payload: { instanceId: "attack-1", target: "p2" },
      },
      { move: "end-turn", label: "Choose player", payload: { target: "p2", choice: "p2" } },
      { move: "defend", label: "Defend together", payload: { instanceIds: ["a", "b"] } },
    ];

    expect(sourceCardIds(commands[0]!)).toEqual(["attack-1"]);
    expect(projectFabCardActions(commands).actions).toEqual([
      expect.objectContaining({ sourceEntityIds: ["attack-1"], label: "Attack hero" }),
      expect.objectContaining({ sourceEntityIds: ["a", "b"], label: "Defend together" }),
    ]);
  });

  it("keeps payment variants explicit and maps a multi-card defend to every source", () => {
    const commands: FabLegalCommand[] = [
      { move: "begin-play", label: "Play red", payload: { instanceId: "play", modeIds: ["red"] } },
      {
        move: "begin-play",
        label: "Play blue",
        payload: { instanceId: "play", modeIds: ["blue"] },
      },
      { move: "defend", label: "Defend with both", payload: { instanceIds: ["red", "blue"] } },
    ];
    const projection = projectFabCardActions(commands);

    expect(
      projection.actions.filter((action) => action.sourceEntityIds.includes("play")),
    ).toHaveLength(2);
    expect(
      projection.actions.find((action) => action.label === "Defend with both")?.sourceEntityIds,
    ).toEqual(["red", "blue"]);
  });

  it("keeps a hand card's play and activation as separate popup actions", () => {
    const commands: FabLegalCommand[] = [
      {
        move: "begin-play",
        label: "Play Cosmic Duality → Dash",
        payload: { instanceId: "cosmic", target: "dash" },
      },
      {
        move: "activate",
        label: "Activate Cosmic Duality — Instant - {r}, discard this",
        payload: { instanceId: "cosmic", ability: "AZS021-a1" },
      },
    ];

    expect(projectFabCardActions(commands).actions).toEqual([
      expect.objectContaining({
        sourceEntityIds: ["cosmic"],
        label: "Play Cosmic Duality → Dash",
      }),
      expect.objectContaining({
        sourceEntityIds: ["cosmic"],
        label: "Activate Cosmic Duality — Instant - {r}, discard this",
      }),
    ]);
  });

  it("collapses only otherwise-identical attacks into a board target draft", () => {
    const commands: FabLegalCommand[] = [
      {
        move: "begin-play",
        label: "Play Snatch → Bravo",
        payload: { instanceId: "snatch", target: "p2" },
      },
      {
        move: "begin-play",
        label: "Play Snatch → Runechant",
        payload: { instanceId: "snatch", target: "runechant" },
      },
      {
        move: "begin-play",
        label: "Play Snatch with an additional cost → Bravo",
        payload: { instanceId: "snatch", target: "p2", modeIds: ["extra"] },
      },
    ];
    const projection = projectFabAttackTargetCardActions(projectFabCardActions(commands));

    expect(projection.actions).toHaveLength(2);
    const draft = [...projection.draftByActionId.values()][0];
    expect(draft?.action).toMatchObject({
      sourceEntityIds: ["snatch"],
      label: "Choose attack target",
    });
    expect([...(draft?.commandByTargetId.keys() ?? [])]).toEqual(["p2", "runechant"]);
    expect(projection.actions.some((action) => action.label.includes("additional cost"))).toBe(
      true,
    );
  });

  it("keeps auto-yield configuration context-only while retaining its card source", () => {
    const command: FabLegalCommand = {
      move: "set-automation-preferences",
      label: "Auto-yield this card",
      payload: { addInstantYieldCardId: "cosmic-duality" },
      sourceInstanceId: "cosmic-copy-2",
      automation: "player-only",
    };

    expect(sourceCardIds(command)).toEqual(["cosmic-copy-2"]);
    expect(projectFabCardActions([command])).toEqual({
      actions: [],
      commandByActionId: new Map(),
    });
  });
});
