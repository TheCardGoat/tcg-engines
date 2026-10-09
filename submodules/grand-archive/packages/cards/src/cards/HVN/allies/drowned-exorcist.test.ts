import { describe } from "vitest";
import { drownedExorcist } from "./drowned-exorcist.ts";

import { proveDelugeDeath } from "../../../testing/deluge-death.ts";
/** @covers qe1pkerbi3-a2 */
describe("drownedExorcist Deluge death trigger", () => proveDelugeDeath(drownedExorcist, 8, 2, 0));
