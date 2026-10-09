import { describe } from "vitest";
import { sharpenBlade } from "./sharpen-blade.ts";
import { proveTargetedClassCounter } from "../../../testing/targeted-class-counter.ts";
/** @covers bscxwjbqjd-a2 */
describe("Sharpen Blade — Class Bonus preparation", () =>
  proveTargetedClassCounter(sharpenBlade, "preparation", "dagger"));
