import { describe, test } from "vite-plus/test";
import { op02ImpelDown092 } from "../../../../../cards/src/cards/stages/op02-092-impel-down.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-092 Impel Down", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02ImpelDown092);
  });
});
