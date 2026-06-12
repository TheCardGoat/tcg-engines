import { describe, test } from "vite-plus/test";
import { op13BoaHancock051 } from "../../../../../cards/src/cards/OP13/characters/051-boa-hancock.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP13-051 Boa Hancock", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13BoaHancock051);
  });
});
