import { describe } from "vitest";
import { penetratorRound } from "./penetrator-round.ts";
import { proveLoadBullet } from "../../../testing/load-bullet.ts";
/** @covers 97n2jnltv5-a2 */
describe("penetratorRound — load into an unloaded Gun", () => {
  proveLoadBullet({ card: penetratorRound, abilityId: "97n2jnltv5-a2", reserveCost: 0 });
});
