import { describe, test } from "vite-plus/test";
import { op01Kaido061 } from "../../../../../cards/src/cards/OP01/leaders/061-kaido.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-061 Kaido", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01Kaido061);
  });
});
