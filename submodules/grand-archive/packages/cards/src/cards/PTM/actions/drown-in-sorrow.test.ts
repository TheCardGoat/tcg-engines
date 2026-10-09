import { describe } from "vitest";
import { drownInSorrow } from "./drown-in-sorrow.ts";
import { provePhantasmagoriaRecovery } from "../../../testing/phantasmagoria-recovery.ts";
/** @covers vA5ZmzZL9I-a1 @covers vA5ZmzZL9I-a2 */
describe("Drown in Sorrow", () => provePhantasmagoriaRecovery(drownInSorrow, 2, 1, 1));
