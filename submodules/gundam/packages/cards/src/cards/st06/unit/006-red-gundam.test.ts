import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockPilot,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { st06RedGundam006 } from "./006-red-gundam.ts";
import { st06ShujiIt010 } from "../pilot/010-shuji-it.ts";

describe("Red Gundam (ST06-006)", () => {
  it("can be placed in the battle area with its printed stats", () => {
    const engine = GundamTestEngine.create({ play: [st06RedGundam006] });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    expect(st06RedGundam006.type).toBe("unit");
    expect(st06RedGundam006.level).toBe(4);
    expect(st06RedGundam006.cost).toBe(2);
    expect(st06RedGundam006.ap).toBe(3);
    expect(st06RedGundam006.hp).toBe(4);
  });

  describe("Link: [Shuji Itō]", () => {
    it("can attack on its deployment turn after pairing with Shuji Itō", () => {
      const p1 = GundamTestEngine.create(
        { hand: [st06RedGundam006, st06ShujiIt010], resourceArea: activeResources(4), deck: 5 },
        { deck: 5 },
      ).asPlayer(PLAYER_ONE);

      expectSuccess(p1.deployUnit(st06RedGundam006));
      expectSuccess(p1.assignPilot(st06ShujiIt010, st06RedGundam006));
      expectSuccess(p1.enterBattle(st06RedGundam006, "direct"));
    });

    it("cannot attack on its deployment turn with a different Clan Pilot", () => {
      const pilot = createMockPilot({
        name: "Other Clan Pilot",
        traits: ["clan"],
        level: 4,
        cost: 1,
      });
      const p1 = GundamTestEngine.create(
        { hand: [st06RedGundam006, pilot], resourceArea: activeResources(4), deck: 5 },
        { deck: 5 },
      ).asPlayer(PLAYER_ONE);

      expectSuccess(p1.deployUnit(st06RedGundam006));
      expectSuccess(p1.assignPilot(pilot, st06RedGundam006));
      expectFailure(p1.enterBattle(st06RedGundam006, "direct"), "CANNOT_ATTACK");
    });
  });
});
