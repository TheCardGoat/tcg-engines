import { asPlayerId } from "@tcg/gundam-engine";
import { describe, expect, it } from "vite-plus/test";

import { createEngineAdapter } from "../adapter.ts";
import { DEV_PLAYER_ONE } from "../dev-runtime.ts";
import { reconstructFromSnapshot, snapshotFromDevRuntime } from "../snapshot.ts";
import { projectGundamMoveLogEntries } from "../../components/containers/move-log-projection.ts";
import { loadSt10DefenseActionLab } from "./st10-defense-action-lab.ts";

function cardIdNamed(
  dev: ReturnType<typeof loadSt10DefenseActionLab>,
  zone: "hand" | "battleArea" | "shieldArea" | "baseSection",
  playerId: string,
  name: string,
): string {
  const ids = dev.runtime.getState().ctx.zones.private.zoneCards[`${zone}:${playerId}`] ?? [];
  const found = ids.find((id) => {
    const instance = dev.staticResources.cardsMaps.instances.get(id);
    return instance && dev.staticResources.getDefinition(instance.definitionId)?.name === name;
  });
  if (!found) throw new Error(`Expected ${name} in ${zone}:${playerId}`);
  return found;
}

function submit(
  dev: ReturnType<typeof loadSt10DefenseActionLab>,
  move: string,
  args: Record<string, unknown> = {},
) {
  return dev.runtime.executeCommand(
    {
      commandID: crypto.randomUUID(),
      move,
      prevStateID: dev.runtime.getState().ctx._stateID,
      actorRole: "player",
      args,
    },
    asPlayerId(DEV_PLAYER_ONE),
  );
}

function projectedMessages(dev: ReturnType<typeof loadSt10DefenseActionLab>): string[] {
  const adapter = createEngineAdapter({
    runtime: dev.runtime,
    staticResources: dev.staticResources,
    viewerId: dev.p1Id,
  });
  return projectGundamMoveLogEntries(
    adapter.moveLogs(),
    String(dev.p1Id),
    dev.runtime.getState().ctx.status.phase ?? "",
    adapter.cardDefinitionOf,
    { moveHistory: adapter.moveHistory() },
  ).map((entry) => entry.message);
}

describe("ST10 defense Action lab", () => {
  it("projects the opening defensive fork", () => {
    const dev = loadSt10DefenseActionLab();
    const adapter = createEngineAdapter({
      runtime: dev.runtime,
      staticResources: dev.staticResources,
      viewerId: dev.p1Id,
    });

    try {
      const actions = adapter.interactionView().actions;
      expect(actions.filter((action) => action.enabled).map((action) => action.id)).toEqual(
        expect.arrayContaining(["declareBlock", "passBlock"]),
      );
      expect(dev.runtime.getAvailableMoves(asPlayerId(DEV_PLAYER_ONE))).toEqual(
        expect.arrayContaining(["declareBlock", "passBlock"]),
      );
    } finally {
      dev.bot?.dispose();
    }
  });

  it("preserves the authored opening attack in the hydrated player log", () => {
    const dev = loadSt10DefenseActionLab();

    try {
      const match = reconstructFromSnapshot(snapshotFromDevRuntime("st10-defense-action-lab", dev));
      const adapter = createEngineAdapter({
        runtime: match.runtime,
        staticResources: match.staticResources,
        viewerId: match.p1Id,
      });

      expect(adapter.moveLogs().map(({ log }) => log.type)).toContain("attack");
      expect(
        projectGundamMoveLogEntries(
          adapter.moveLogs(),
          String(match.p1Id),
          match.runtime.getState().ctx.status.phase ?? "",
          adapter.cardDefinitionOf,
          { moveHistory: adapter.moveHistory() },
        ).map((entry) => entry.message),
      ).toContain("Attacked direct with Guncannon.");
    } finally {
      dev.bot?.dispose();
    }
  });

  it("runs the Blocker and Diffuse Beam Cannon branch through battle damage", () => {
    const dev = loadSt10DefenseActionLab();

    try {
      const blockerId = cardIdNamed(dev, "battleArea", DEV_PLAYER_ONE, "Graze Duel Type");
      const attackerId = cardIdNamed(dev, "battleArea", "player_two", "Guncannon");
      const commandId = cardIdNamed(dev, "hand", DEV_PLAYER_ONE, "Diffuse Beam Cannon");

      expect(submit(dev, "declareBlock", { blockerId }).success).toBe(true);
      expect(dev.runtime.getState().G.turnMetadata.pendingCombat).toMatchObject({
        attackerId,
        blockerId,
      });
      expect(dev.runtime.getAvailableMoves(asPlayerId(DEV_PLAYER_ONE))).toEqual(
        expect.arrayContaining(["playCommand", "passBattleAction"]),
      );

      expect(submit(dev, "playCommand", { cardId: commandId }).success).toBe(true);
      const prompt = dev.runtime.getPendingChoice({
        role: "player",
        playerId: asPlayerId(DEV_PLAYER_ONE),
      });
      expect(prompt?.kind).toBe("targetSelection");
      expect(submit(dev, "resolveEffect", { targets: [attackerId] }).success).toBe(true);

      expect(submit(dev, "passBattleAction").success).toBe(true);
      expect(dev.runtime.getState().ctx.status.phase).toBe("main-phase");
      expect(dev.runtime.getState().G.damage[attackerId]).toBe(2);
      expect(dev.runtime.getState().G.damage[blockerId]).toBe(1);

      expect(projectedMessages(dev)).toEqual(
        expect.arrayContaining([
          "Blocked Guncannon with Graze Duel Type.",
          "Played Diffuse Beam Cannon.",
          "Guncannon gets AP -3 during this battle.",
          "Guncannon took 2 damage.",
          "Combat resolved.",
        ]),
      );
    } finally {
      dev.bot?.dispose();
    }
  });

  it("runs the no-block branch through Luna Mana & Carry Base Burst and Deploy", () => {
    const dev = loadSt10DefenseActionLab();

    try {
      const grazeId = cardIdNamed(dev, "battleArea", DEV_PLAYER_ONE, "Graze Duel Type");
      const lunaId = cardIdNamed(dev, "shieldArea", DEV_PLAYER_ONE, "Luna Mana & Carry Base");

      expect(submit(dev, "passBlock").success).toBe(true);
      expect(dev.runtime.getAvailableMoves(asPlayerId(DEV_PLAYER_ONE))).toContain(
        "passBattleAction",
      );
      expect(submit(dev, "passBattleAction").success).toBe(true);

      const burst = dev.runtime.getPendingChoice({
        role: "player",
        playerId: asPlayerId(DEV_PLAYER_ONE),
      });
      expect(burst?.kind).toBe("optional");
      expect(submit(dev, "resolveEffect", { optionalAnswers: { [-1]: true } }).success).toBe(true);

      expect(
        dev.runtime.getState().ctx.zones.private.zoneCards[`baseSection:${DEV_PLAYER_ONE}`],
      ).toContain(lunaId);
      expect(dev.runtime.getState().G.damage[grazeId]).toBeUndefined();

      const messages = projectedMessages(dev);
      expect(messages).toEqual(
        expect.arrayContaining([
          "Revealed Luna Mana & Carry Base from Shields.",
          "Started resolving Luna Mana & Carry Base · Burst.",
          "Luna Mana & Carry Base moved from trash to base section.",
          "Started resolving Luna Mana & Carry Base · Deploy.",
          "Added 1 Shield to hand.",
          "Graze Duel Type recovered 1 HP.",
          "Finished resolving Luna Mana & Carry Base · Deploy.",
          "Finished resolving Luna Mana & Carry Base · Burst.",
        ]),
      );
      const triggeredStart = messages.indexOf("Started resolving Luna Mana & Carry Base · Deploy.");
      const shieldToHand = messages.indexOf("Added 1 Shield to hand.");
      const recovery = messages.indexOf("Graze Duel Type recovered 1 HP.");
      const triggeredFinish = messages.indexOf(
        "Finished resolving Luna Mana & Carry Base · Deploy.",
      );
      expect(triggeredStart).toBeLessThan(shieldToHand);
      expect(shieldToHand).toBeLessThan(recovery);
      expect(triggeredStart).toBeLessThan(recovery);
      expect(recovery).toBeLessThan(triggeredFinish);
    } finally {
      dev.bot?.dispose();
    }
  });
});
