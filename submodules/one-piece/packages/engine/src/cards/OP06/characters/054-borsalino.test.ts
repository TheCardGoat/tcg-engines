import { describe, test } from "vite-plus/test";
import { op06Borsalino054 } from "../../../../../cards/src/cards/OP06/characters/054-borsalino.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-054 Borsalino", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06Borsalino054);
  });
});
