import { describe, expect, it } from "vitest";
import type { FabViewerEffect } from "@tcg/flesh-and-blood-engine/simulator";

import {
  effectsForEntity,
  effectsForPlayer,
  gameEffects,
  groupFabBoardEffects,
  projectFabPresentationEffect,
} from "./activeEffects";

const seismicSurgeEffect: FabViewerEffect = {
  id: "seismic-surge-discount",
  controllerId: "player-1",
  source: {
    instanceId: "seismic-surge-token",
    canonicalId: "seismic-surge-token",
    name: "Seismic Surge",
  },
  origin: { kind: "continuous", source: "layer" },
  scopes: [{ kind: "future-object", playerId: "player-1" }],
  status: "armed",
  expiresAt: { kind: "turn", turnNumber: 3 },
  remainingUses: 1,
  appliesTo: {
    names: [],
    supertypes: [],
    types: ["Action"],
    subtypes: ["Attack"],
    traits: ["Guardian"],
    hasAdditionalConstraints: false,
  },
  impacts: [{ kind: "numeric", property: "cost", operation: "subtract", amount: 1 }],
};

const rokEffect = (impact: FabViewerEffect["impacts"][number]): FabViewerEffect => ({
  id: `rok-${impact.kind === "rule" ? impact.action : impact.kind}`,
  controllerId: "player-2",
  source: {
    instanceId: "rok",
    canonicalId: "KrjrwRtnjcK7hNhcBdH9h",
    name: "Rok",
  },
  origin: { kind: "continuous", source: "static" },
  scopes: [{ kind: "player", playerId: "player-2" }],
  status: "applying",
  expiresAt: { kind: "permanent" },
  remainingUses: null,
  appliesTo: null,
  impacts: [impact],
});

describe("FAB active effect presentation", () => {
  it("turns a future Seismic Surge discount into concise, rules-facing copy", () => {
    expect(projectFabPresentationEffect(seismicSurgeEffect)).toMatchObject({
      id: "seismic-surge-discount",
      sourceEntityId: "seismic-surge-token",
      label: "Cost −1",
      detail: "Your next Guardian attack action card costs 1 less. Source: Seismic Surge.",
      tone: "buff",
      durationLabel: "This turn",
      status: "armed",
      remainingUses: 1,
    });
  });

  it("explains Rok's conditional activation and unpreventable damage in player language", () => {
    expect(
      projectFabPresentationEffect(rokEffect({ kind: "rule", mode: "allow", action: "play" })),
    ).toMatchObject({
      sourceLabel: "Rok",
      label: "Rok available",
      detail: "Rok can be played or activated while its condition is met.",
    });
    expect(
      projectFabPresentationEffect(
        rokEffect({ kind: "rule", mode: "restrict", action: "be-prevented" }),
      ),
    ).toMatchObject({
      sourceLabel: "Rok",
      label: "Damage can't be prevented",
      detail: "Damage that would be dealt by Rok can't be prevented.",
    });
  });

  it("selects player, entity, and game effects without duplicating ownership logic in UI", () => {
    const future = projectFabPresentationEffect(seismicSurgeEffect);
    const state = {
      activeEffects: [
        future,
        { ...future, id: "object", scopes: [{ kind: "object" as const, instanceId: "attack" }] },
        { ...future, id: "game", scopes: [{ kind: "game" as const }] },
      ],
    };

    expect(effectsForPlayer(state, "player-1").map((effect) => effect.id)).toEqual([
      "seismic-surge-discount",
    ]);
    expect(effectsForEntity(state, "attack").map((effect) => effect.id)).toEqual(["object"]);
    expect(gameEffects(state).map((effect) => effect.id)).toEqual(["game"]);
  });

  it("groups board effects by seat and game while excluding object-only effects", () => {
    const future = projectFabPresentationEffect(seismicSurgeEffect);
    const state = {
      activeEffects: [
        future,
        {
          ...future,
          id: "both-seats",
          scopes: [
            { kind: "player" as const, playerId: "player-1" },
            { kind: "player" as const, playerId: "player-2" },
          ],
        },
        { ...future, id: "object", scopes: [{ kind: "object" as const, instanceId: "attack" }] },
        {
          ...future,
          id: "game",
          scopes: [{ kind: "game" as const }, { kind: "player" as const, playerId: "player-1" }],
        },
      ],
    };

    const groups = groupFabBoardEffects(state, "player-1", "player-2");

    expect(groups.self.map((effect) => effect.id)).toEqual([
      "seismic-surge-discount",
      "both-seats",
    ]);
    expect(groups.opponent.map((effect) => effect.id)).toEqual(["both-seats"]);
    expect(groups.game.map((effect) => effect.id)).toEqual(["game"]);
    expect(groups.count).toBe(3);
    expect(groups.all).toHaveLength(4);
  });
});
