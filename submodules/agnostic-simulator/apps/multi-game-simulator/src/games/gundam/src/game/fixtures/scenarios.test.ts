import { asPlayerId, pilotSatisfiesUnitLinkCondition } from "@tcg/gundam-engine";
import { describe, expect, it } from "vite-plus/test";

import { DEV_PLAYER_ONE, DEV_PLAYER_TWO } from "../dev-runtime.ts";
import { FIXTURES, PARAMETERIZED_FIXTURES, type FixtureName } from "./index.ts";
import {
  GUNDAM_FIXTURE_GROUPS,
  GUNDAM_FIXTURE_SCENARIOS,
  getGundamFixtureScenario,
} from "./scenarios.ts";

const indexedFixtureNames = (Object.keys(FIXTURES) as FixtureName[])
  .filter((name) => !PARAMETERIZED_FIXTURES.has(name))
  .sort();

describe("Gundam simulator fixture scenarios", () => {
  it("documents every indexed fixture exactly once", () => {
    const scenarioIds = GUNDAM_FIXTURE_SCENARIOS.map((scenario) => scenario.id);

    expect([...scenarioIds].sort()).toEqual(indexedFixtureNames);
    expect(new Set(scenarioIds).size).toBe(scenarioIds.length);
    expect(GUNDAM_FIXTURE_SCENARIOS.length).toBeGreaterThanOrEqual(40);
    expect(GUNDAM_FIXTURE_SCENARIOS.every((scenario) => scenario.description.length >= 30)).toBe(
      true,
    );
    expect(GUNDAM_FIXTURE_SCENARIOS.every((scenario) => scenario.instructions.length >= 30)).toBe(
      true,
    );
  });

  it("covers every declared game-testing group and start-point family", () => {
    const groups = new Set(GUNDAM_FIXTURE_SCENARIOS.map((scenario) => scenario.group));
    const startPoints = new Set(GUNDAM_FIXTURE_SCENARIOS.map((scenario) => scenario.startPoint));

    expect([...groups].sort()).toEqual([...GUNDAM_FIXTURE_GROUPS].sort());
    expect(startPoints).toEqual(
      new Set(["before-game", "main-phase", "battle", "end-phase", "automation"]),
    );
  });

  it.each(GUNDAM_FIXTURE_SCENARIOS)(
    "$id boots at its documented game point with production card definitions",
    async (scenario) => {
      const factory = await FIXTURES[scenario.id]();
      const dev = factory();

      try {
        const state = dev.runtime.getState();
        const definitions = [...dev.staticResources.cardsMaps.definitions.values()];

        expect(
          definitions.some((card) => card.cardNumber.startsWith("TEST-")),
          `${scenario.id} exposed a synthetic card definition`,
        ).toBe(false);

        if (scenario.startPoint === "before-game") {
          expect(state.ctx.status.gameSegment).toBe("setup");
        } else if (scenario.startPoint === "main-phase") {
          expect(state.ctx.status.gameSegment).toBe("turnCycle");
          expect(state.ctx.status.phase).toBe("main-phase");
        } else if (scenario.startPoint === "battle") {
          expect(state.ctx.status.gameSegment).toBe("turnCycle");
          expect(state.ctx.status.phase).toBe("battle-phase");
        } else if (scenario.startPoint === "end-phase") {
          expect(state.ctx.status.gameSegment).toBe("turnCycle");
          expect(state.ctx.status.phase).toBe("end-phase");
        }
      } finally {
        dev.bot?.dispose();
      }
    },
  );

  it("exposes public moves for representative setup, Main Phase, battle, and End Phase states", async () => {
    const expectedMoves = [
      ["setup-default", "chooseFirstPlayer"],
      ["main-phase-demo", "deployUnit"],
      ["block-step-demo", "passBlock"],
      ["discard-limit-demo", "discardToHandLimit"],
    ] as const;

    for (const [fixtureId, expectedMove] of expectedMoves) {
      const scenario = getGundamFixtureScenario(fixtureId);
      expect(scenario).toBeDefined();

      const factory = await FIXTURES[fixtureId]();
      const dev = factory();
      try {
        expect(dev.runtime.getAvailableMoves(asPlayerId(DEV_PLAYER_ONE))).toContain(expectedMove);
      } finally {
        dev.bot?.dispose();
      }
    }
  });

  it("lets the defending player declare the staged real-card blocker", async () => {
    const factory = await FIXTURES["block-step-demo"]();
    const dev = factory();

    try {
      const state = dev.runtime.getState();
      const battleArea = state.ctx.zones.private.zoneCards[`battleArea:${DEV_PLAYER_ONE}`] ?? [];
      const blockerId = battleArea.find((instanceId) => {
        const instance = dev.staticResources.cardsMaps.instances.get(instanceId);
        if (!instance) return false;
        return dev.staticResources.getDefinition(instance.definitionId)?.name === "Demi Trainer";
      });

      expect(blockerId).toBeDefined();
      expect(dev.runtime.getAvailableMoves(asPlayerId(DEV_PLAYER_ONE))).toContain("declareBlock");

      const result = dev.runtime.executeCommand(
        {
          commandID: crypto.randomUUID(),
          move: "declareBlock",
          prevStateID: state.ctx._stateID,
          actorRole: "player",
          args: { blockerId },
        },
        asPlayerId(DEV_PLAYER_ONE),
      );

      expect(result.success).toBe(true);
    } finally {
      dev.bot?.dispose();
    }
  });

  it("lets a printed Attack effect interrupt battle before counterdamage", async () => {
    const factory = await FIXTURES["step-interrupt-demo"]();
    const dev = factory();

    try {
      const state = dev.runtime.getState();
      const attackerId = state.ctx.zones.private.zoneCards[`battleArea:${DEV_PLAYER_ONE}`]?.[0];
      const defenderId = state.ctx.zones.private.zoneCards[`battleArea:${DEV_PLAYER_TWO}`]?.[0];
      expect(attackerId).toBeDefined();
      expect(defenderId).toBeDefined();

      const attack = dev.runtime.executeCommand(
        {
          commandID: crypto.randomUUID(),
          move: "enterBattle",
          prevStateID: state.ctx._stateID,
          actorRole: "player",
          args: { attackerId, target: defenderId },
        },
        asPlayerId(DEV_PLAYER_ONE),
      );
      expect(attack.success).toBe(true);

      const prompt = dev.runtime.getPendingChoice({
        role: "player",
        playerId: asPlayerId(DEV_PLAYER_ONE),
      });
      expect(prompt).toMatchObject({ kind: "targetSelection", legalTargetIds: [defenderId] });
      if (!prompt || prompt.kind !== "targetSelection" || !defenderId || !attackerId) return;

      const resolve = dev.runtime.executeCommand(
        {
          commandID: crypto.randomUUID(),
          move: "resolveEffect",
          prevStateID: dev.runtime.getState().ctx._stateID,
          actorRole: "player",
          args: { pendingEffectId: prompt.effectId, targets: [defenderId] },
        },
        asPlayerId(DEV_PLAYER_ONE),
      );

      expect(resolve.success).toBe(true);
      expect(dev.runtime.getState().ctx.status.phase).toBe("main-phase");
      expect(
        dev.runtime.getState().ctx.zones.private.zoneCards[`trash:${DEV_PLAYER_TWO}`],
      ).toContain(defenderId);
      expect(dev.runtime.getState().G.damage[attackerId]).toBeUndefined();
    } finally {
      dev.bot?.dispose();
    }
  });

  it("stages a survivable High-Maneuver attack against a real Blocker", async () => {
    const factory = await FIXTURES["high-maneuver-demo"]();
    const dev = factory();

    try {
      const state = dev.runtime.getState();
      const definitionsIn = (zone: string) =>
        (state.ctx.zones.private.zoneCards[zone] ?? []).flatMap((instanceId) => {
          const instance = dev.staticResources.cardsMaps.instances.get(instanceId);
          const definition = instance
            ? dev.staticResources.getDefinition(instance.definitionId)
            : undefined;
          return definition ? [definition] : [];
        });
      const attacker = definitionsIn(`battleArea:${DEV_PLAYER_ONE}`).find(
        (card) => card.name === "Wing Gundam Zero",
      );
      const blocker = definitionsIn(`battleArea:${DEV_PLAYER_TWO}`).find(
        (card) => card.name === "Demi Trainer",
      );
      const shields = state.ctx.zones.private.zoneCards[`shieldArea:${DEV_PLAYER_TWO}`] ?? [];

      expect(attacker?.type).toBe("unit");
      expect(attacker?.keywordEffects).toContainEqual({ keyword: "HighManeuver" });
      expect(blocker?.type).toBe("unit");
      expect(blocker?.keywordEffects).toContainEqual({ keyword: "Blocker" });
      expect(shields).toHaveLength(2);
    } finally {
      dev.bot?.dispose();
    }
  });

  it("keeps the Link deploy fixture's printed Unit and matching Pilot", async () => {
    const factory = await FIXTURES["link-unit-deploy-demo"]();
    const dev = factory();

    try {
      const hand =
        dev.runtime.getState().ctx.zones.private.zoneCards[`hand:${DEV_PLAYER_ONE}`] ?? [];
      const definitions = hand.flatMap((instanceId) => {
        const instance = dev.staticResources.cardsMaps.instances.get(instanceId);
        const definition = instance
          ? dev.staticResources.getDefinition(instance.definitionId)
          : undefined;
        return definition ? [definition] : [];
      });
      const unit = definitions.find((definition) => definition.name === "Gundam");
      const pilot = definitions.find((definition) => definition.name === "Amuro Ray");

      expect(unit?.type).toBe("unit");
      expect(unit?.type === "unit" ? unit.linkCondition : undefined).toBe("[Amuro Ray]");
      expect(pilotSatisfiesUnitLinkCondition(pilot, unit)).toBe(true);
    } finally {
      dev.bot?.dispose();
    }
  });
});
