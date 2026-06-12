import { describe, test } from "vite-plus/test";
import { op01BoaHancock078 } from "../../../../../cards/src/cards/OP01/characters/078-boa-hancock.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-078 Boa Hancock", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01BoaHancock078);
  });
});
