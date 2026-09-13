/**
 * Hand-authored AAA for destroy-self create-token equipment.
 * Each module: destroy-self Action + create-token + go again (unless noted).
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash } from "../../../fixtures.ts";

import { flatTrackers } from "../../../../../../cards/src/cards/equipment/flat-trackers.ts";
import { heartThrob } from "../../../../../../cards/src/cards/equipment/heart-throb.ts";
import { fiddleDee } from "../../../../../../cards/src/cards/equipment/fiddle-dee.ts";
import { quickstep } from "../../../../../../cards/src/cards/equipment/quickstep.ts";
import { calmingGesture } from "../../../../../../cards/src/cards/equipment/calming-gesture.ts";

type Case = {
  code: string;
  name: string;
  zone: "head" | "chest" | "arms" | "legs";
  equipment: { canonicalId: string };
  tokenSubstr: string;
  count: number;
};

const CASES: readonly Case[] = [
  {
    code: "HVY155",
    name: "flat-trackers",
    zone: "legs",
    equipment: flatTrackers,
    tokenSubstr: "agility",
    count: 1,
  },
  {
    code: "TCC052",
    name: "heart-throb",
    zone: "chest",
    equipment: heartThrob,
    tokenSubstr: "vigor",
    count: 1,
  },
  {
    code: "TCC053",
    name: "fiddle-dee",
    zone: "arms",
    equipment: fiddleDee,
    tokenSubstr: "might",
    count: 1,
  },
  {
    code: "TCC054",
    name: "quickstep",
    zone: "legs",
    equipment: quickstep,
    tokenSubstr: "quicken",
    count: 1,
  },
  {
    code: "ROS250",
    name: "calming-gesture",
    zone: "arms",
    equipment: calmingGesture,
    tokenSubstr: "spectral",
    count: 1,
  },
];

describe.each(CASES)(
  "$code $name — destroy-self create $tokenSubstr ×$count",
  ({ zone, equipment, tokenSubstr, count }) => {
    it(`core: destroy-self creates ${count} token(s) and go again refunds AP`, () => {
      const setup: Record<string, unknown> = {
        hero: bravo,
        hand: [],
        actionPoints: 1,
        deck: 6,
      };
      setup[zone] = [equipment];
      const game = FabTestEngine.start(
        setup as never,
        { hero: dash, deck: 6 },
        { autoPassPriority: false },
      );
      const Bravo = game.as(bravo);
      Bravo.activate(equipment);
      game.passBoth();

      expect(Bravo.zone(zone)).not.toContain(equipment.canonicalId);
      expect(Bravo.zone("graveyard")).toContain(equipment.canonicalId);
      const tokens = Bravo.zone("arena").filter((id) => id.toLowerCase().includes(tokenSubstr));
      expect(tokens.length).toBe(count);
      expect(Bravo.actionPoints()).toBe(1);
    });
  },
);
