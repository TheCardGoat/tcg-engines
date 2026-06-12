import { describe, test } from "vite-plus/test";
import { op08Sheepshead083 } from "../../../../../cards/src/cards/OP08/characters/083-sheepshead.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-083 Sheepshead", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08Sheepshead083);
  });
});
