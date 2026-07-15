import { describe, test } from "vite-plus/test";
import { op04BlackMaria052 } from "../../../../../cards/src/cards/OP04/characters/052-black-maria.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-052 Black Maria", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04BlackMaria052);
  });
});
