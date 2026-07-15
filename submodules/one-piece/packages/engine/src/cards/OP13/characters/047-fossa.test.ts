import { describe, test } from "vite-plus/test";
import { op13Fossa047 } from "../../../../../cards/src/cards/OP13/characters/047-fossa.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP13-047 Fossa", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13Fossa047);
  });
});
