import { describe, test } from "vite-plus/test";
import { op03CharlotteKatakuri099 } from "../../../../../cards/src/cards/OP03/leaders/099-charlotte-katakuri.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-099 Charlotte Katakuri", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03CharlotteKatakuri099);
  });
});
