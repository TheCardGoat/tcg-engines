import { describe, expect, test } from "vitest";
import { makeZoneKey } from "./zones.ts";
import { createRandomAPI } from "./random.ts";
import type { ZoneConfig } from "../types/index.ts";

describe("engine-core adapter paths", () => {
  describe("makeZoneKey", () => {
    test("produces keys compatible with all game zone shapes", () => {
      const _deck: ZoneConfig = {
        id: "deck",
        name: "Deck",
        visibility: "secret",
        ordered: true,
        ownerScoped: true,
      };
      expect(makeZoneKey({ zone: "deck", playerId: "p1" })).toBe("deck:p1");
      expect(makeZoneKey({ zone: "deck" })).toBe("deck");
    });

    test("round-trips through parseZoneKey", () => {
      const key = makeZoneKey({ zone: "battleArea", playerId: "p2" });
      expect(key).toBe("battleArea:p2");
    });
  });

  describe("createRandomAPI", () => {
    test("produces deterministic sequences for replay", () => {
      const api1 = createRandomAPI("replay-test");
      const api2 = createRandomAPI("replay-test");

      const draws1 = Array.from({ length: 10 }, () => api1.random());
      const draws2 = Array.from({ length: 10 }, () => api2.random());

      expect(draws1).toEqual(draws2);
    });

    test("die roll bounds are inclusive", () => {
      const api = createRandomAPI("bounds");
      for (let i = 0; i < 50; i++) {
        const v = api.rollDie(6);
        expect(v).toBeGreaterThanOrEqual(1);
        expect(v).toBeLessThanOrEqual(6);
      }
    });
  });
});
