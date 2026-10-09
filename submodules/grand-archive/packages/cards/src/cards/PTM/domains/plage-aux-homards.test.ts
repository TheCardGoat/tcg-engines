import { describe } from "vitest";
import { plageAuxHomards } from "./plage-aux-homards.ts";
import { proveEntryMill } from "../../../testing/entry-mill.ts";
/** @covers s25QNTvfem-a1 */
describe("plage-aux-homards — entry mill", () => proveEntryMill(plageAuxHomards, 2, "self"));
