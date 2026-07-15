import { describe, test } from "vite-plus/test";
import { op01Speed104 } from "../../../../../cards/src/cards/OP01/characters/104-speed.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-104 Speed", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01Speed104);
  });
});
