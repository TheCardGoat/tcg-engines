import { describe, expect, it } from "bun:test";
import { badanonVillainSupportCenter } from "./203-bad-anon-villain-support-center";
import { ratigansPartySeedyBackRoom } from "./136-ratigans-party-seedy-back-room";
import { ratigansPartySeedyBackRoomEnchanted } from "./216-ratigans-party-seedy-back-room-enchanted";
import { badanonVillainSupportCenterEnchanted } from "./222-bad-anon-villain-support-center-enchanted";

describe("set 005 location enchanted parity", () => {
  it("matches Ratigan's Party enchanted parity", () => {
    expect(ratigansPartySeedyBackRoomEnchanted.canonicalId).toBe(
      ratigansPartySeedyBackRoom.canonicalId,
    );
    expect(ratigansPartySeedyBackRoomEnchanted.missingImplementation).toBe(
      ratigansPartySeedyBackRoom.missingImplementation,
    );
    expect(ratigansPartySeedyBackRoomEnchanted.missingTests).toBe(
      ratigansPartySeedyBackRoom.missingTests,
    );
    expect(ratigansPartySeedyBackRoomEnchanted.abilities).toEqual(
      ratigansPartySeedyBackRoom.abilities,
    );
  });

  it("matches Bad-Anon enchanted parity", () => {
    expect(badanonVillainSupportCenterEnchanted.canonicalId).toBe(
      badanonVillainSupportCenter.canonicalId,
    );
    expect(badanonVillainSupportCenterEnchanted.missingImplementation).toBe(
      badanonVillainSupportCenter.missingImplementation,
    );
    expect(badanonVillainSupportCenterEnchanted.missingTests).toBe(
      badanonVillainSupportCenter.missingTests,
    );
    expect(badanonVillainSupportCenterEnchanted.abilities).toEqual(
      badanonVillainSupportCenter.abilities,
    );
  });
});
