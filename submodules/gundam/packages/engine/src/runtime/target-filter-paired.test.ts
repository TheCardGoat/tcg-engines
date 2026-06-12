/**
 * TargetFilter — `paired` and `pairedPilotTrait` AttributeFilters.
 *
 * Card text on Super Gundam (GD03-075), Fighting Alone (GD04-119), Kyrios
 * Tail Booster (GD04-023) and others discriminates Units by pair state and
 * by their paired Pilot's traits — these primitives unlock those cards.
 */

import { describe, it, expect } from "vite-plus/test";
import type { PlayerId } from "../types/branded.ts";
import { evaluateTargetFilter } from "./target-dsl.ts";
import {
  GundamTestEngine,
  PLAYER_ONE,
  buildTargetResolutionContext,
  createMockPilot,
  createMockUnit,
  expectSuccess,
  activeResources,
} from "../index.ts";

function setup() {
  const newtypePilot = createMockPilot({
    name: "Test Newtype Pilot",
    traits: ["newtype"],
    level: 1,
    cost: 1,
  });
  const unitWithPilot = createMockUnit({ ap: 2, hp: 3 });
  const unitWithoutPilot = createMockUnit({ ap: 2, hp: 3 });

  const engine = GundamTestEngine.create({
    hand: [newtypePilot],
    play: [unitWithPilot, unitWithoutPilot],
    resourceArea: activeResources(2),
  });
  const p1 = engine.asPlayer(PLAYER_ONE);
  const [pairedId, unpairedId] = p1.getCardsInZone("battleArea");

  expectSuccess(p1.assignPilot(newtypePilot, pairedId!));

  const runtime = engine.getRuntime();
  const framework = runtime.getFrameworkReadAPI();
  const ctx = buildTargetResolutionContext(engine.getG(), PLAYER_ONE, framework);
  const cards = framework.zones
    .getCards({ zone: "battleArea", playerId: PLAYER_ONE as PlayerId })
    .map((id) => framework.cards.get(id))
    .filter((c): c is NonNullable<typeof c> => c !== undefined);

  return { engine, ctx, cards, pairedId, unpairedId };
}

describe("AttributeFilter.paired", () => {
  it("matches paired Units when value=true", () => {
    const { ctx, cards, pairedId } = setup();
    const matched = evaluateTargetFilter(
      {
        owner: "friendly",
        cardType: "unit",
        attributeFilters: [{ attribute: "paired", comparison: "eq", value: true }],
      },
      cards,
      ctx,
    );
    expect(matched).toContain(pairedId);
    expect(matched).toHaveLength(1);
  });

  it("matches unpaired Units when value=false", () => {
    const { ctx, cards, unpairedId } = setup();
    const matched = evaluateTargetFilter(
      {
        owner: "friendly",
        cardType: "unit",
        attributeFilters: [{ attribute: "paired", comparison: "eq", value: false }],
      },
      cards,
      ctx,
    );
    expect(matched).toContain(unpairedId);
    expect(matched).toHaveLength(1);
  });
});

describe("AttributeFilter.pairedPilotTrait", () => {
  it("matches a Unit whose paired Pilot has the named trait (includes)", () => {
    const { ctx, cards, pairedId } = setup();
    const matched = evaluateTargetFilter(
      {
        owner: "friendly",
        cardType: "unit",
        attributeFilters: [
          { attribute: "pairedPilotTrait", comparison: "includes", value: "Newtype" },
        ],
      },
      cards,
      ctx,
    );
    expect(matched).toContain(pairedId);
    expect(matched).toHaveLength(1);
  });

  it("does NOT match a Unit whose paired Pilot lacks the named trait", () => {
    const { ctx, cards } = setup();
    const matched = evaluateTargetFilter(
      {
        owner: "friendly",
        cardType: "unit",
        attributeFilters: [
          { attribute: "pairedPilotTrait", comparison: "includes", value: "Cyber-Newtype" },
        ],
      },
      cards,
      ctx,
    );
    expect(matched).toHaveLength(0);
  });

  it("with comparison=excludes, matches unpaired Units (no Pilot to fail the predicate)", () => {
    const { ctx, cards, unpairedId, pairedId } = setup();
    const matched = evaluateTargetFilter(
      {
        owner: "friendly",
        cardType: "unit",
        attributeFilters: [
          { attribute: "pairedPilotTrait", comparison: "excludes", value: "Newtype" },
        ],
      },
      cards,
      ctx,
    );
    expect(matched).toContain(unpairedId);
    expect(matched).not.toContain(pairedId);
  });
});
