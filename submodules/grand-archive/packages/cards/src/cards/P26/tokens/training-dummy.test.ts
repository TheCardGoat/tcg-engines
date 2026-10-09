import { describe } from "vitest";
import { trainingDummy } from "./training-dummy.ts";
import { proveCannotAttack } from "../../../testing/cannot-attack.ts";
/** @covers EeFXEYMmF3-a1 */
describe("Training Dummy — cannot attack, can retaliate with power", () =>
  proveCannotAttack(trainingDummy, false));
