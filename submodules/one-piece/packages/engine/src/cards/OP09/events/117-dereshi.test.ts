import { describe, test } from "vite-plus/test";
import { op09Dereshi117 } from "../../../../../cards/src/cards/OP09/events/117-dereshi.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-117 Dereshi!", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09Dereshi117);
  });
});
