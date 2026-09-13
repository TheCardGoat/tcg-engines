import { afterEach, describe, expect, it } from "vitest";

import { DEV_PLAYER_ONE, DEV_PLAYER_TWO, resetDevRuntimeInstanceCounter } from "../dev-runtime.ts";
import { FIXTURES, PARAMETERIZED_FIXTURES, type FixtureName } from "./index.ts";

function cardsInZone(
  dev: ReturnType<Awaited<ReturnType<(typeof FIXTURES)[FixtureName]>>>,
  playerIndex: 0 | 1,
  zone: "hand" | "battleArea",
) {
  const playerId = playerIndex === 0 ? DEV_PLAYER_ONE : DEV_PLAYER_TWO;
  const instanceIds =
    dev.runtime.getState().ctx.zones.private.zoneCards[`${zone}:${playerId}`] ?? [];
  return instanceIds.flatMap((instanceId) => {
    const definitionId = dev.staticResources.cardsMaps.instances.get(instanceId)?.definitionId;
    const definition = definitionId
      ? dev.staticResources.cardsMaps.definitions.get(definitionId)
      : undefined;
    return definition ? [{ instanceId, definition }] : [];
  });
}

afterEach(() => {
  resetDevRuntimeInstanceCounter();
});

describe("Gundam visual fixture card integrity", () => {
  const fixtureNames = (Object.keys(FIXTURES) as FixtureName[]).filter(
    (name) => !PARAMETERIZED_FIXTURES.has(name),
  );

  it.each(fixtureNames)("%s registers production card definitions only", async (fixtureName) => {
    const factory = await FIXTURES[fixtureName]();
    const dev = factory();

    try {
      const definitions = [...dev.staticResources.cardsMaps.definitions.values()];
      expect(definitions.length).toBeGreaterThan(0);
      expect(
        definitions.filter((card) => card.cardNumber.startsWith("TEST-")),
        `${fixtureName} registered synthetic card definitions`,
      ).toEqual([]);
      expect(
        definitions.filter((card) => !card.imageUrl),
        `${fixtureName} registered cards without production artwork`,
      ).toEqual([]);
    } finally {
      dev.bot?.dispose();
    }
  });

  it("provides a varied Unit deployment matrix", async () => {
    const factory = await FIXTURES["deploy-unit-demo"]();
    const dev = factory();

    try {
      const units = cardsInZone(dev, 0, "hand").filter((card) => card.definition.type === "unit");
      expect(units).toHaveLength(3);
      expect(new Set(units.map((card) => card.definition.cardNumber)).size).toBe(3);
    } finally {
      dev.bot?.dispose();
    }
  });

  it("provides a varied Base deployment matrix", async () => {
    const factory = await FIXTURES["deploy-base-demo"]();
    const dev = factory();

    try {
      const bases = cardsInZone(dev, 0, "hand").filter((card) => card.definition.type === "base");
      expect(bases).toHaveLength(3);
      expect(new Set(bases.map((card) => card.definition.cardNumber)).size).toBe(3);
    } finally {
      dev.bot?.dispose();
    }
  });

  it("provides multiple Pilots and Units for pairing combinations", async () => {
    const factory = await FIXTURES["pilot-pair-demo"]();
    const dev = factory();

    try {
      const pilots = cardsInZone(dev, 0, "hand").filter((card) => card.definition.type === "pilot");
      const units = cardsInZone(dev, 0, "battleArea").filter(
        (card) => card.definition.type === "unit",
      );
      expect(new Set(pilots.map((card) => card.definition.cardNumber)).size).toBeGreaterThanOrEqual(
        2,
      );
      expect(new Set(units.map((card) => card.definition.cardNumber)).size).toBeGreaterThanOrEqual(
        2,
      );
    } finally {
      dev.bot?.dispose();
    }
  });

  it("provides multiple legal board choices for staged target QA", async () => {
    const factory = await FIXTURES["command-multi-target-demo"]();
    const dev = factory();

    try {
      expect(cardsInZone(dev, 0, "battleArea")).toHaveLength(3);
      expect(cardsInZone(dev, 1, "battleArea")).toHaveLength(2);
    } finally {
      dev.bot?.dispose();
    }
  });

  it("provides multiple opponent Units for return-to-hand QA", async () => {
    const factory = await FIXTURES["return-to-hand-demo"]();
    const dev = factory();

    try {
      expect(cardsInZone(dev, 1, "battleArea")).toHaveLength(3);
    } finally {
      dev.bot?.dispose();
    }
  });

  it("provides varied eligible targets for Intercept Orders", async () => {
    const factory = await FIXTURES["command-rest-demo"]();
    const dev = factory();

    try {
      const targets = cardsInZone(dev, 1, "battleArea");
      expect(targets).toHaveLength(3);
      expect(new Set(targets.map((card) => card.definition.cardNumber)).size).toBe(3);
      expect(targets.every((card) => card.definition.type === "unit")).toBe(true);
    } finally {
      dev.bot?.dispose();
    }
  });

  it("provides varied unaffordable Units without conflating card identity", async () => {
    const factory = await FIXTURES["insufficient-resources-demo"]();
    const dev = factory();

    try {
      const units = cardsInZone(dev, 0, "hand").filter((card) => card.definition.type === "unit");
      expect(units).toHaveLength(3);
      expect(new Set(units.map((card) => card.definition.cardNumber)).size).toBe(3);
      expect(new Set(units.map((card) => card.definition.color)).size).toBeGreaterThanOrEqual(2);
    } finally {
      dev.bot?.dispose();
    }
  });
});
