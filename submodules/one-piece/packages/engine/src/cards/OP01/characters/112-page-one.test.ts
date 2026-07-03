import { describe, test } from "vite-plus/test";
import { op01PageOne112 } from "../../../../../cards/src/cards/OP01/characters/112-page-one.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-112 Page One", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01PageOne112);
  });
});
