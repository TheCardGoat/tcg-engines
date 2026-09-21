import { describe, test } from "vite-plus/test";
import { op02Seaquake021 } from "../../../../../cards/src/cards/events/op02-021-seaquake.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-021 Seaquake", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02Seaquake021);
  });
});
