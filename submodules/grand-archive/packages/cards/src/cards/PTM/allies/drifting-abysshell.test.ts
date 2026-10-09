import { describe } from "vitest";
import { driftingAbysshell } from "./drifting-abysshell.ts";
import { provePhantasmagoriaEntry } from "../../../testing/phantasmagoria-entry.ts";
/** @covers cDp9Ap6ASE-a1 */
describe("Drifting Abysshell mastery counter", () => provePhantasmagoriaEntry(driftingAbysshell));
