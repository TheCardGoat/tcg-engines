import { describe } from "vitest";
import { remnantOfWill } from "./remnant-of-will.ts";
import { provePhantasmagoriaRecovery } from "../../../testing/phantasmagoria-recovery.ts";
/** @covers XK3NiQ5MdR-a1 @covers XK3NiQ5MdR-a2 */
describe("Remnant of Will", () => provePhantasmagoriaRecovery(remnantOfWill, 1, 4, 2));
