import { describe, test } from "vite-plus/test";
import { op08PageOne092 } from "../../../../../cards/src/cards/OP08/characters/092-page-one.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-092 Page One", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08PageOne092);
  });
});
