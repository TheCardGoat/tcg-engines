import { describe, test } from "vite-plus/test";
import { op01JeanBart045 } from "../../../../../cards/src/cards/OP01/characters/045-jean-bart.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-045 Jean Bart", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01JeanBart045);
  });
});
