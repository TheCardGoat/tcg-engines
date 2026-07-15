import { describe, test } from "vite-plus/test";
import { op03HullDismantlerSlash073 } from "../../../../../cards/src/cards/OP03/events/073-hull-dismantler-slash.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-073 Hull Dismantler Slash", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03HullDismantlerSlash073);
  });
});
