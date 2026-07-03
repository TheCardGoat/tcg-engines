import { describe, test } from "vite-plus/test";
import { op08Zou039 } from "../../../../../cards/src/cards/OP08/stages/039-zou.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-039 Zou", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08Zou039);
  });
});
