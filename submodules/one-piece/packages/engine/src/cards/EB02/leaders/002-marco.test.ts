import { describe, test } from "vite-plus/test";
import { eb02Marco002 } from "../../../../../cards/src/cards/EB02/leaders/002-marco.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-002 Marco", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb02Marco002);
  });
});
