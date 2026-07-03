import { describe, test } from "vite-plus/test";
import { op13Brook034 } from "../../../../../cards/src/cards/OP13/characters/034-brook.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP13-034 Brook", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13Brook034);
  });
});
