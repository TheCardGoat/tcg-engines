import { describe, test } from "vite-plus/test";
import { op07Lucy112 } from "../../../../../cards/src/cards/OP07/characters/112-lucy.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-112 Lucy", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07Lucy112);
  });
});
