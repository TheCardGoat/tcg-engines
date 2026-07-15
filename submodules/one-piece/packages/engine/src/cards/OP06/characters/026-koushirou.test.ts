import { describe, test } from "vite-plus/test";
import { op06Koushirou026 } from "../../../../../cards/src/cards/OP06/characters/026-koushirou.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-026 Koushirou", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06Koushirou026);
  });
});
