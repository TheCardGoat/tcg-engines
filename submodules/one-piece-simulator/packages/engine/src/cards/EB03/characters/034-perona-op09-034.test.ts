import { describe, test } from "vite-plus/test";
import { eb03PeronaOp09034034 } from "../../../../../cards/src/cards/EB03/characters/034-perona-op09-034.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-034 Perona - OP09-034", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb03PeronaOp09034034);
  });
});
