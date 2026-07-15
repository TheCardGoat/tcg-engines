import { describe, test } from "vite-plus/test";
import { op08Kalgara099 } from "../../../../../cards/src/cards/OP08/characters/099-kalgara.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-099 Kalgara", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08Kalgara099);
  });
});
