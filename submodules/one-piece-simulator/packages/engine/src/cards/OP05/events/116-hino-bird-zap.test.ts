import { describe, test } from "vite-plus/test";
import { op05HinoBirdZap116 } from "../../../../../cards/src/cards/OP05/events/116-hino-bird-zap.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-116 Hino Bird Zap", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05HinoBirdZap116);
  });
});
