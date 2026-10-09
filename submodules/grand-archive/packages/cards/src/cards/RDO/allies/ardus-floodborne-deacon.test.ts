import { describe } from "vitest";
import { ardusFloodborneDeacon } from "./ardus-floodborne-deacon.ts";
import { proveEntryMill } from "../../../testing/entry-mill.ts";
/** @covers EKiMJfgvSI-a1 */
describe("ardus-floodborne-deacon — entry mill", () =>
  proveEntryMill(ardusFloodborneDeacon, 3, "self"));
