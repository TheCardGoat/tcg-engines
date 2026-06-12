import { describe, test } from "vite-plus/test";
import { op12Koushirou027 } from "../../../../../cards/src/cards/OP12/characters/027-koushirou.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP12-027 Koushirou", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op12Koushirou027);
  });
});
