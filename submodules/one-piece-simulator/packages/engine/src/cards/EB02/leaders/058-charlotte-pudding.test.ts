import { describe, test } from "vite-plus/test";
import { eb02CharlottePudding058 } from "../../../../../cards/src/cards/EB02/leaders/058-charlotte-pudding.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-058 Charlotte Pudding", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb02CharlottePudding058);
  });
});
