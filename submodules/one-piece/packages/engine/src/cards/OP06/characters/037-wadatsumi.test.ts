import { describe, test } from "vite-plus/test";
import { op06Wadatsumi037 } from "../../../../../cards/src/cards/OP06/characters/037-wadatsumi.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-037 Wadatsumi", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06Wadatsumi037);
  });
});
