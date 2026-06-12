import { describe, test } from "vite-plus/test";
import { op10Caribou104 } from "../../../../../cards/src/cards/OP10/characters/104-caribou.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-104 Caribou", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10Caribou104);
  });
});
