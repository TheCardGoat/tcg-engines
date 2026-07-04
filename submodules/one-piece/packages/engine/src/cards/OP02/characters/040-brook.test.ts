import { describe, test } from "vite-plus/test";
import { op02Brook040 } from "../../../../../cards/src/cards/OP02/characters/040-brook.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-040 Brook", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02Brook040);
  });
});
