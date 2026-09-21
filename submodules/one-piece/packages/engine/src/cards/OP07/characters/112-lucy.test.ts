import { describe, test } from "vite-plus/test";
import { op07Lucy112 } from "../../../../../cards/src/cards/characters/op07-112-lucy.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-112 Lucy", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07Lucy112);
  });
});
