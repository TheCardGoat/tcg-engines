import { describe, test } from "vite-plus/test";
import { op08Jozu047 } from "../../../../../cards/src/cards/OP08/characters/047-jozu.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-047 Jozu", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08Jozu047);
  });
});
