import { describe, test } from "vite-plus/test";
import { op01Raizo052 } from "../../../../../cards/src/cards/OP01/characters/052-raizo.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-052 Raizo", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01Raizo052);
  });
});
