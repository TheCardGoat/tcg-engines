import { describe } from "vitest";
import { jovianHiltXUltra } from "./jovian-hilt-x-ultra.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { proveIntrinsicLink } from "../../../testing/intrinsic-link.ts";

/** @covers sZTH5LanyW-a1 */
describe("Jovian Hilt X Ultra — Sword Weapon Link", () => {
  proveIntrinsicLink({
    card: jovianHiltXUltra,
    host: trainingSword,
    invalidHost: woodlandSquirrels,
  });
});

import { proveLinkedStats } from "../../../testing/linked-stats.ts";

/** @covers sZTH5LanyW-a3 */
describe("Linked stat bonus", () => {
  proveLinkedStats({ card: jovianHiltXUltra, host: "weapon", power: 2, life: 0 });
});
