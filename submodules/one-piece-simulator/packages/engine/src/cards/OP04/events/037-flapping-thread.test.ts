import { describe, test } from "vite-plus/test";
import { op04FlappingThread037 } from "../../../../../cards/src/cards/OP04/events/037-flapping-thread.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-037 Flapping Thread", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04FlappingThread037);
  });
});
