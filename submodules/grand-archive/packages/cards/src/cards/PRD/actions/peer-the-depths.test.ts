import { describe } from "vitest";
import { peerTheDepths } from "./peer-the-depths.ts";

import { provePhaseRestrictedAction } from "../../../testing/phase-restricted-action.ts";
/** @covers 6JMwc6cpRm-a1 */
describe("peerTheDepths activation phase", () => {
  provePhaseRestrictedAction(peerTheDepths, "recollection", true, "opponent");
});
