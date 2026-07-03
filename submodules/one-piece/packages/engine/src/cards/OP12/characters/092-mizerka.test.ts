import { describe, test } from "vite-plus/test";
import { op12Mizerka092 } from "../../../../../cards/src/cards/OP12/characters/092-mizerka.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP12-092 Mizerka", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op12Mizerka092);
  });
});
