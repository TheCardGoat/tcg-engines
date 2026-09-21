import { describe, test } from "vite-plus/test";
import { op01Speed104 } from "../../../../../cards/src/cards/characters/op01-104-speed.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-104 Speed", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01Speed104);
  });
});
