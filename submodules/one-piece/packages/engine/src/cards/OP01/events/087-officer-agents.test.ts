import { describe, test } from "vite-plus/test";
import { op01OfficerAgents087 } from "../../../../../cards/src/cards/OP01/events/087-officer-agents.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-087 Officer Agents", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01OfficerAgents087);
  });
});
