import { describe, test } from "vite-plus/test";
import { op08Garchu037 } from "../../../../../cards/src/cards/OP08/events/037-garchu.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-037 Garchu", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08Garchu037);
  });
});
