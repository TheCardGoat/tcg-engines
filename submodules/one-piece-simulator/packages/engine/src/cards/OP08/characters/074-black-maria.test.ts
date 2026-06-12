import { describe, test } from "vite-plus/test";
import { op08BlackMaria074 } from "../../../../../cards/src/cards/OP08/characters/074-black-maria.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-074 Black Maria", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08BlackMaria074);
  });
});
