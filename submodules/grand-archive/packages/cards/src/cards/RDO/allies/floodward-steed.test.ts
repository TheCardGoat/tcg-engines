import { describe } from "vitest";
import { floodwardSteed } from "./floodward-steed.ts";
import { proveEntryCounter } from "../../../testing/entry-counter.ts";
/** @covers b8CsivHOkC-a1 */
describe("floodward-steed — entry counter", () => proveEntryCounter(floodwardSteed, "bulwark", 1));
