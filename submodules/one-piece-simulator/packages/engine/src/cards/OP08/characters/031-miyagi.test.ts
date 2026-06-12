import { describe, test } from "vite-plus/test";
import { op08Miyagi031 } from "../../../../../cards/src/cards/OP08/characters/031-miyagi.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-031 Miyagi", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08Miyagi031);
  });
});
