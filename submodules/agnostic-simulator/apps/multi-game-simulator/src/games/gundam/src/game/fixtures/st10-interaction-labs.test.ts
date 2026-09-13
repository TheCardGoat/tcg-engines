import { asPlayerId } from "@tcg/gundam-engine";
import { describe, expect, it } from "vite-plus/test";

import { DEV_PLAYER_ONE } from "../dev-runtime.ts";
import { createEngineAdapter } from "../adapter.ts";
import { FIXTURES } from "./index.ts";
import { RELEASE_REVIEW_CARDS } from "./release-card-review-labs.ts";
import { GUNDAM_FIXTURE_SCENARIOS } from "./scenarios.ts";

const ST10_LAB_IDS = [
  "st10-development-lab",
  "st10-pair-link-lab",
  "st10-shield-assault-lab",
  "st10-defense-action-lab",
] as const;

const ALL_ST10_CARD_NUMBERS = Array.from(
  { length: 16 },
  (_, index) => `ST10-${String(index + 1).padStart(3, "0")}`,
);
describe("ST10 simulator interaction labs", () => {
  it("groups all 16 Generation Pulse cards exactly once in the fixture catalog", () => {
    const scenarios = GUNDAM_FIXTURE_SCENARIOS.filter((scenario) =>
      ST10_LAB_IDS.includes(scenario.id as (typeof ST10_LAB_IDS)[number]),
    );

    expect(scenarios.map((scenario) => scenario.id)).toEqual(ST10_LAB_IDS);
    expect(scenarios.every((scenario) => scenario.group === "ST10 · Generation Pulse")).toBe(true);
    expect(scenarios.flatMap((scenario) => scenario.cards ?? []).sort()).toEqual(
      ALL_ST10_CARD_NUMBERS,
    );
  });

  it("gives every structured-effect Freedom Ascension card a release-review route", () => {
    const gd05Scenarios = GUNDAM_FIXTURE_SCENARIOS.filter(
      (scenario) => scenario.group === "GD05 · Release review",
    );
    const gd05EffectCards = RELEASE_REVIEW_CARDS.filter((card) =>
      card.cardNumber.startsWith("GD05-"),
    );

    expect(new Set(gd05Scenarios.flatMap((scenario) => scenario.cards ?? []))).toEqual(
      new Set(gd05EffectCards.map((card) => card.cardNumber)),
    );
    expect(gd05Scenarios.every((scenario) => scenario.cards?.length === 1)).toBe(true);
  });

  it("gives every structured-effect Generation Pulse card a release-review route", () => {
    const st10Scenarios = GUNDAM_FIXTURE_SCENARIOS.filter(
      (scenario) => scenario.group === "ST10 · Release review",
    );
    const st10EffectCards = RELEASE_REVIEW_CARDS.filter((card) =>
      card.cardNumber.startsWith("ST10-"),
    );

    expect(new Set(st10Scenarios.flatMap((scenario) => scenario.cards ?? []))).toEqual(
      new Set(st10EffectCards.map((card) => card.cardNumber)),
    );
    expect(st10Scenarios.every((scenario) => scenario.cards?.length === 1)).toBe(true);
  });

  it.each([
    ["st10-development-lab", "main-phase", undefined, ["deployUnit", "playCommand"]],
    ["st10-pair-link-lab", "main-phase", undefined, ["assignPilot"]],
    ["st10-shield-assault-lab", "main-phase", undefined, ["enterBattle"]],
    ["st10-defense-action-lab", "battle-phase", "block-step", ["declareBlock", "passBlock"]],
  ] as const)(
    "%s opens at an immediately actionable state",
    async (fixtureId, phase, step, expectedMoves) => {
      const factory = await FIXTURES[fixtureId]();
      const dev = factory();

      try {
        const state = dev.runtime.getState();
        const availableMoves = dev.runtime.getAvailableMoves(asPlayerId(DEV_PLAYER_ONE));

        expect(state.ctx.status.gameSegment).toBe("turnCycle");
        expect(state.ctx.status.phase).toBe(phase);
        expect(state.ctx.status.step).toBe(step);
        expect(availableMoves).toEqual(expect.arrayContaining([...expectedMoves]));
      } finally {
        dev.bot?.dispose();
      }
    },
  );

  it.each(ST10_LAB_IDS)("%s uses every card documented for that lab", async (fixtureId) => {
    const scenario = GUNDAM_FIXTURE_SCENARIOS.find((candidate) => candidate.id === fixtureId);
    const factory = await FIXTURES[fixtureId]();
    const dev = factory();

    try {
      const definitionIds = new Set(
        [...dev.staticResources.cardsMaps.definitions.values()].map((card) => card.cardNumber),
      );
      expect(scenario?.cards?.every((cardNumber) => definitionIds.has(cardNumber))).toBe(true);
    } finally {
      dev.bot?.dispose();
    }
  });

  it("advances through the End Phase action window so Repair resolves after Pass Turn", async () => {
    const factory = await FIXTURES["st10-development-lab"]();
    const dev = factory();

    try {
      const before = dev.runtime.getState();
      if (before.ctx.time.mode !== "dynamic") {
        throw new Error("Expected the ST10 fixture to use a dynamic clock");
      }
      expect(before.ctx.time.players[DEV_PLAYER_ONE]?.reserveMsRemaining).toBe(10 * 60 * 1_000);
      const battleArea = before.ctx.zones.private.zoneCards[`battleArea:${DEV_PLAYER_ONE}`] ?? [];
      const superGundamId = battleArea.find((instanceId) => {
        const instance = dev.staticResources.cardsMaps.instances.get(instanceId);
        if (!instance) return false;
        return dev.staticResources.getDefinition(instance.definitionId)?.name === "Super Gundam";
      });

      expect(superGundamId).toBeDefined();
      expect(before.G.damage[superGundamId!]).toBe(2);

      const result = dev.runtime.executeCommand(
        {
          commandID: crypto.randomUUID(),
          move: "passTurn",
          prevStateID: before.ctx._stateID,
          actorRole: "player",
          args: {},
        },
        asPlayerId(DEV_PLAYER_ONE),
      );

      expect(result.success, JSON.stringify(result)).toBe(true);
      expect(dev.runtime.getState().G.damage[superGundamId!]).toBeUndefined();
      const repairLog = dev.runtime
        .getGameLogHistory()
        .find(({ entry }) => entry.type === "gundam.effect.hpRecovered");
      expect(repairLog).toMatchObject({
        entry: {
          playerId: DEV_PLAYER_ONE,
          message: expect.stringContaining("recovered 2 HP"),
          data: {
            values: { cardId: superGundamId, amount: 2 },
          },
        },
      });

      const adapter = createEngineAdapter({
        runtime: dev.runtime,
        staticResources: dev.staticResources,
        viewerId: dev.p1Id,
      });
      expect(adapter.logEntries()).toContainEqual(repairLog);
      expect(
        adapter
          .packetAnimations()
          .find(
            ({ animation }) =>
              animation?.data.kind === "generic" && animation.data.name === "hpRecovered",
          ),
      ).toMatchObject({
        animation: {
          data: {
            params: { cardId: superGundamId, amount: 2 },
          },
        },
      });
    } finally {
      dev.bot?.dispose();
    }
  });

  it("keeps deployed units in play when the Development lab advances to the next turn", async () => {
    const factory = await FIXTURES["st10-development-lab"]();
    const dev = factory();

    try {
      const beforeDeploy = dev.runtime.getState();
      const hand = beforeDeploy.ctx.zones.private.zoneCards[`hand:${DEV_PLAYER_ONE}`] ?? [];
      const zetaId = hand.find((instanceId) => {
        const instance = dev.staticResources.cardsMaps.instances.get(instanceId);
        if (!instance) return false;
        return dev.staticResources.getDefinition(instance.definitionId)?.name === "Zeta Gundam";
      });
      expect(zetaId).toBeDefined();

      const deploy = dev.runtime.executeCommand(
        {
          commandID: crypto.randomUUID(),
          move: "deployUnit",
          prevStateID: beforeDeploy.ctx._stateID,
          actorRole: "player",
          args: { cardId: zetaId },
        },
        asPlayerId(DEV_PLAYER_ONE),
      );
      expect(deploy.success, JSON.stringify(deploy)).toBe(true);

      const prompt = dev.runtime.getPendingChoice({
        role: "player",
        playerId: asPlayerId(DEV_PLAYER_ONE),
      });
      expect(prompt?.kind).toBe("targetSelection");
      if (
        !prompt ||
        prompt.kind !== "targetSelection" ||
        prompt.optionalDirectiveIndex === undefined
      ) {
        return;
      }

      const skipDevelopment = dev.runtime.executeCommand(
        {
          commandID: crypto.randomUUID(),
          move: "resolveEffect",
          prevStateID: dev.runtime.getState().ctx._stateID,
          actorRole: "player",
          args: {
            pendingEffectId: prompt.effectId,
            optionalAnswers: { [prompt.optionalDirectiveIndex]: false },
          },
        },
        asPlayerId(DEV_PLAYER_ONE),
      );
      expect(skipDevelopment.success).toBe(true);

      const passTurn = dev.runtime.executeCommand(
        {
          commandID: crypto.randomUUID(),
          move: "passTurn",
          prevStateID: dev.runtime.getState().ctx._stateID,
          actorRole: "player",
          args: {},
        },
        asPlayerId(DEV_PLAYER_ONE),
      );
      expect(passTurn.success).toBe(true);

      expect(
        dev.runtime.getState().ctx.zones.private.zoneCards[`battleArea:${DEV_PLAYER_ONE}`],
      ).toContain(zetaId);
    } finally {
      dev.bot?.dispose();
    }
  });

  it("preserves the complete lab sequence across the turn boundary", async () => {
    const factory = await FIXTURES["st10-development-lab"]();
    const dev = factory();
    const playerOne = asPlayerId(DEV_PLAYER_ONE);
    const zone = (name: string) =>
      dev.runtime.getState().ctx.zones.private.zoneCards[`${name}:${DEV_PLAYER_ONE}`] ?? [];
    const namedCard = (zoneName: string, cardName: string) =>
      zone(zoneName).find((instanceId) => {
        const instance = dev.staticResources.cardsMaps.instances.get(instanceId);
        if (!instance) return false;
        return dev.staticResources.getDefinition(instance.definitionId)?.name === cardName;
      });
    const submit = (
      move: "playCommand" | "deployUnit" | "resolveEffect" | "passTurn",
      args: Record<string, unknown>,
    ) =>
      dev.runtime.executeCommand(
        {
          commandID: crypto.randomUUID(),
          move,
          prevStateID: dev.runtime.getState().ctx._stateID,
          actorRole: "player",
          args,
        },
        playerOne,
      );
    const resolveOptionalTargets = (targets: readonly string[]) => {
      const prompt = dev.runtime.getPendingChoice({ role: "player", playerId: playerOne });
      expect(prompt?.kind).toBe("targetSelection");
      if (
        !prompt ||
        prompt.kind !== "targetSelection" ||
        prompt.optionalDirectiveIndex === undefined
      ) {
        return;
      }
      expect(
        submit("resolveEffect", {
          pendingEffectId: prompt.effectId,
          optionalAnswers: { [prompt.optionalDirectiveIndex]: true },
          targets,
        }).success,
      ).toBe(true);
    };
    const resolveTargets = (targets: readonly string[]) => {
      const prompt = dev.runtime.getPendingChoice({ role: "player", playerId: playerOne });
      expect(prompt?.kind).toBe("targetSelection");
      if (!prompt || prompt.kind !== "targetSelection") return;
      expect(
        submit("resolveEffect", {
          pendingEffectId: prompt.effectId,
          targets,
        }).success,
      ).toBe(true);
    };

    try {
      const trainedZetaId = namedCard("battleArea", "Zeta Gundam");
      const tacticalId = namedCard("hand", "Tactical Training");
      const deployedZetaId = namedCard("hand", "Zeta Gundam");
      const barbatosId = namedCard("hand", "Gundam Barbatos 1st Form");
      const unlockingId = namedCard("hand", "Unlocking the Development Diagram");
      expect(trainedZetaId).toBeDefined();
      expect(tacticalId).toBeDefined();
      expect(deployedZetaId).toBeDefined();
      expect(barbatosId).toBeDefined();
      expect(unlockingId).toBeDefined();

      expect(submit("playCommand", { cardId: tacticalId }).success).toBe(true);
      resolveTargets([trainedZetaId!]);

      expect(submit("deployUnit", { cardId: deployedZetaId }).success).toBe(true);
      resolveOptionalTargets(zone("trash").slice(0, 2));
      const enemyBattleArea =
        dev.runtime.getState().ctx.zones.private.zoneCards["battleArea:player_two"] ?? [];
      resolveTargets([enemyBattleArea[0]!]);

      expect(submit("deployUnit", { cardId: barbatosId }).success).toBe(true);
      resolveOptionalTargets(
        zone("trash")
          .filter((id) => id !== tacticalId)
          .slice(0, 2),
      );
      const discardPrompt = dev.runtime.getPendingChoice({
        role: "player",
        playerId: playerOne,
      });
      expect(discardPrompt?.kind).toBe("targetSelection");
      if (!discardPrompt || discardPrompt.kind !== "targetSelection") return;
      resolveTargets([discardPrompt.legalTargetIds.find((id) => id !== unlockingId)!]);

      expect(submit("playCommand", { cardId: unlockingId, mode: "normal" }).success).toBe(true);
      expect(submit("passTurn", {}).success).toBe(true);

      expect(zone("battleArea")).toEqual(
        expect.arrayContaining([trainedZetaId, deployedZetaId, barbatosId]),
      );
      expect(zone("hand")).not.toEqual(
        expect.arrayContaining([deployedZetaId, barbatosId, tacticalId, unlockingId]),
      );
    } finally {
      dev.bot?.dispose();
    }
  });
});
