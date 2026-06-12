import { describe, test } from "vite-plus/test";
import { op13Koala081 } from "../../../../../cards/src/cards/OP13/characters/081-koala.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP13-081 Koala", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13Koala081);
  });
});
