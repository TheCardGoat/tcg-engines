import { describe, expect, it } from "vite-plus/test";
import type { Ability } from "@tcg/cyberpunk-types";
import {
  embracingPowerRetailStarterDeckYorinobuArasakaEmbracingDestruction,
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailFieldOperator,
} from "@tcg/cyberpunk-cards";
import { clearDefinitionOverride, overrideDefinition } from "../src/state/card-registry.ts";
import { resolveTarget } from "../src/effects/target-resolver.ts";
import { CyberpunkTestEngine, P1, P2 } from "../src/testing/index.ts";

const legend = embracingPowerRetailStarterDeckYorinobuArasakaEmbracingDestruction;

describe("event card filters and live card selection", () => {
  it.each(["field", "legendArea"] as const)(
    "fires for an attacker in the field only when the filter requires %s",
    (zone) => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          deck: [welcomeToNightCityRetailCorpoSecurity],
          field: [{ card: welcomeToNightCityRetailFieldOperator, spent: false, hasLag: false }],
          legendArea: [{ card: legend, faceDown: false }],
          gigArea: [
            { dieType: "d12", faceValue: 12 },
            { dieType: "d8", faceValue: 8 },
          ],
        },
        { gigArea: [{ dieType: "d6", faceValue: 3 }] },
        { preserveDeckOrder: true },
      );
      const ability: Ability = structuredClone(legend.abilities[0]!);
      if (ability.trigger?.trigger !== "event" || ability.trigger.event.event !== "cardAttacks") {
        throw new Error("Expected Yorinobu's cardAttacks ability");
      }
      ability.trigger.event.target.zones = [zone];
      overrideDefinition({ ...legend, abilities: [ability] });

      try {
        engine.attackRival(welcomeToNightCityRetailFieldOperator, { as: P1 });
        expect(engine.getHandCount(P1)).toBe(zone === "field" ? 1 : 0);
      } finally {
        clearDefinitionOverride(legend.id);
      }
    },
  );

  it.each([P1, P2])("matches owner control for a %s attacker", (attackerPlayer) => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        deck: [welcomeToNightCityRetailCorpoSecurity],
        field:
          attackerPlayer === P1
            ? [{ card: welcomeToNightCityRetailFieldOperator, spent: false, hasLag: false }]
            : [],
        legendArea: [{ card: legend, faceDown: false }],
        gigArea: [
          { dieType: "d12", faceValue: 12 },
          { dieType: "d8", faceValue: 8 },
        ],
      },
      {
        field:
          attackerPlayer === P2
            ? [{ card: welcomeToNightCityRetailFieldOperator, spent: false, hasLag: false }]
            : [],
        gigArea: [{ dieType: "d6", faceValue: 3 }],
      },
      { activePlayerId: attackerPlayer, preserveDeckOrder: true },
    );
    const ability: Ability = structuredClone(legend.abilities[0]!);
    if (ability.trigger?.trigger !== "event" || ability.trigger.event.event !== "cardAttacks") {
      throw new Error("Expected Yorinobu's cardAttacks ability");
    }
    ability.trigger.event.player = "any";
    ability.trigger.event.target.controller = "owner";
    overrideDefinition({ ...legend, abilities: [ability] });

    try {
      engine.attackRival(welcomeToNightCityRetailFieldOperator, { as: attackerPlayer });
      expect(engine.getHandCount(P1)).toBe(attackerPlayer === P1 ? 1 : 0);
    } finally {
      clearDefinitionOverride(legend.id);
    }
  });

  it.each(["ready", "spent"] as const)(
    "matches the event attacker's %s state exactly as the live selector does",
    (stateFilter) => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          deck: [welcomeToNightCityRetailCorpoSecurity],
          field: [{ card: welcomeToNightCityRetailFieldOperator, spent: false, hasLag: false }],
          legendArea: [{ card: legend, faceDown: false }],
          gigArea: [
            { dieType: "d12", faceValue: 12 },
            { dieType: "d8", faceValue: 8 },
          ],
        },
        { gigArea: [{ dieType: "d6", faceValue: 3 }] },
        { preserveDeckOrder: true },
      );
      const ability: Ability = structuredClone(legend.abilities[0]!);
      if (ability.trigger?.trigger !== "event" || ability.trigger.event.event !== "cardAttacks") {
        throw new Error("Expected Yorinobu's cardAttacks ability");
      }
      ability.trigger.event.target.state = stateFilter;
      overrideDefinition({ ...legend, abilities: [ability] });

      try {
        engine.attackRival(welcomeToNightCityRetailFieldOperator, { as: P1 });
        const attacker = engine.getCard(welcomeToNightCityRetailFieldOperator, "field", P1);
        const target = ability.trigger.event.target;
        const matchesLive = resolveTarget(target, {
          state: engine.getState(),
          sourceCardId: engine.getCard(legend, "legendArea", P1).instanceId,
          sourcePlayerId: P1,
          abilityIndex: 0,
          contextTargets: {},
          boundTargets: {},
        }).includes(attacker.instanceId as string);

        expect(matchesLive).toBe(stateFilter === "spent");
        expect(engine.getHandCount(P1)).toBe(matchesLive ? 1 : 0);
      } finally {
        clearDefinitionOverride(legend.id);
      }
    },
  );
});
