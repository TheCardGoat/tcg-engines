import { describe, test } from "vite-plus/test";
import { op09Fullalead099 } from "../../../../../cards/src/cards/stages/op09-099-fullalead.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-099 Fullalead", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09Fullalead099);
  });
});
