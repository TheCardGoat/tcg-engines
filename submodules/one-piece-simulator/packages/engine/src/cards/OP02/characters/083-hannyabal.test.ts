import { describe, test } from "vite-plus/test";
import { op02Hannyabal083 } from "../../../../../cards/src/cards/OP02/characters/083-hannyabal.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-083 Hannyabal", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02Hannyabal083);
  });
});
