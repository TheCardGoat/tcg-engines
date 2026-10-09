import { describe } from "vitest";
import { springCleaning } from "./spring-cleaning.ts";

import { proveLineageFloatingMemory } from "../../../testing/lineage-floating-memory.ts";
/** @covers dZ0Y2ILgZW-a2 */
describe("Ciel Bonus Floating Memory", () => proveLineageFloatingMemory(springCleaning, "Ciel"));
