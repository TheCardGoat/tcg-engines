import { describe } from "vitest";
import { dynastyChancellor } from "./dynasty-chancellor.ts";

import { proveDelugeDeath } from "../../../testing/deluge-death.ts";
/** @covers do1blsupu0-a3 */
describe("dynastyChancellor Deluge death trigger", () =>
  proveDelugeDeath(dynastyChancellor, 3, 1, 0));
