import { describe, test } from "vite-plus/test";
import { op13PhoenixPyreapple058 } from "../../../../../cards/src/cards/OP13/events/058-phoenix-pyreapple.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP13-058 Phoenix Pyreapple", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13PhoenixPyreapple058);
  });
});
