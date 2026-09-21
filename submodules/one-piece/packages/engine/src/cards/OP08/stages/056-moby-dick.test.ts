import { describe, test } from "vite-plus/test";
import { op08MobyDick056 } from "../../../../../cards/src/cards/stages/op08-056-moby-dick.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-056 Moby Dick", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08MobyDick056);
  });
});
