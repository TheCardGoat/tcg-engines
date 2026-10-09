import { ordinaryHorse } from "../../AMB/allies/ordinary-horse.ts";
import { describe } from "vitest";
import { horseArcher } from "./horse-archer.ts";
import { proveRangedAlly } from "../../../testing/ranged-ally.ts";

/** @covers k6d4367ixj-a1 */
describe("Horse Archer Ranged", () => {
  proveRangedAlly({ card: horseArcher, power: 1, ranged: 2, classBonus: true });
});

/** @covers k6d4367ixj-a2 */
describe("Horse Archer Equestrian", () => {
  proveRangedAlly({
    card: horseArcher,
    power: 1,
    ranged: 2,
    classBonus: true,
    supportCard: ordinaryHorse,
    supportRanged: 3,
  });
});
