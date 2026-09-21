import { describe, test } from "vite-plus/test";
import { op07Caribou023 } from "../../../../../cards/src/cards/characters/op07-023-caribou.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-023 Caribou", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07Caribou023);
  });
});
