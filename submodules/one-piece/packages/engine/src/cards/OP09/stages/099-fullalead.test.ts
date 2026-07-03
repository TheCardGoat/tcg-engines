import { describe, test } from "vite-plus/test";
import { op09Fullalead099 } from "../../../../../cards/src/cards/OP09/stages/099-fullalead.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-099 Fullalead", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09Fullalead099);
  });
});
