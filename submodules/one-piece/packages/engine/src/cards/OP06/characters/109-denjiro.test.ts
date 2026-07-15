import { describe, test } from "vite-plus/test";
import { op06Denjiro109 } from "../../../../../cards/src/cards/OP06/characters/109-denjiro.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-109 Denjiro", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06Denjiro109);
  });
});
