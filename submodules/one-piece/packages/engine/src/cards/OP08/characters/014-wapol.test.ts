import { describe, test } from "vite-plus/test";
import { op08Wapol014 } from "../../../../../cards/src/cards/OP08/characters/014-wapol.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-014 Wapol", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08Wapol014);
  });
});
