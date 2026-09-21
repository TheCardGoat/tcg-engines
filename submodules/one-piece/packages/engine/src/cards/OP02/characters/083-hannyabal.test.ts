import { describe, test } from "vite-plus/test";
import { op02Hannyabal083 } from "../../../../../cards/src/cards/characters/op02-083-hannyabal.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-083 Hannyabal", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02Hannyabal083);
  });
});
