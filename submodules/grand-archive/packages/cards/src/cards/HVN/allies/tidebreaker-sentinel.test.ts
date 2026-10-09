import { describe } from "vitest";
import { proveClassFoster } from "../../../testing/class-foster.ts";
import { tidebreakerSentinel } from "./tidebreaker-sentinel.ts";
/** @covers 3kwkn38b7v-a1 */
describe("tidebreaker-sentinel — Class Bonus Foster", () => proveClassFoster(tidebreakerSentinel));
