import { describe, test } from "vite-plus/test";
import { op08Carrot023 } from "../../../../../cards/src/cards/OP08/characters/023-carrot.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-023 Carrot", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08Carrot023);
  });
});
