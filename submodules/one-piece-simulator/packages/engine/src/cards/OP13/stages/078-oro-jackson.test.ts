import { describe, test } from "vite-plus/test";
import { op13OroJackson078 } from "../../../../../cards/src/cards/OP13/stages/078-oro-jackson.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP13-078 Oro Jackson", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13OroJackson078);
  });
});
