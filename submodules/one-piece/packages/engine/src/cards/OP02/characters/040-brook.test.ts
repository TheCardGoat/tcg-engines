import { describe, test } from "vite-plus/test";
import { op02Brook040 } from "../../../../../cards/src/cards/characters/op02-040-brook.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-040 Brook", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02Brook040);
  });
});
