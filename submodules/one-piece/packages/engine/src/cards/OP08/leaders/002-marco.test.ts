import { describe, test } from "vite-plus/test";
import { op08Marco002 } from "../../../../../cards/src/cards/OP08/leaders/002-marco.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-002 Marco", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08Marco002);
  });
});
