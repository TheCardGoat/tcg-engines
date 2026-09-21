import { describe, test } from "vite-plus/test";
import { op08Zou039 } from "../../../../../cards/src/cards/stages/op08-039-zou.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-039 Zou", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08Zou039);
  });
});
