import { describe } from "vitest";
import { direwolf } from "./direwolf.ts";
import { proveEndSacrifice } from "../../../testing/end-sacrifice.ts";
/** @covers jev2kkxuq2-a1 */
describe("Direwolf end sacrifice", () => proveEndSacrifice(direwolf, "jev2kkxuq2-a1"));
