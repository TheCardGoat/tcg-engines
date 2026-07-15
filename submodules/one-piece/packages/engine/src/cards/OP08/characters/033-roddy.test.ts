import { describe, test } from "vite-plus/test";
import { op08Roddy033 } from "../../../../../cards/src/cards/OP08/characters/033-roddy.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-033 Roddy", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08Roddy033);
  });
});
