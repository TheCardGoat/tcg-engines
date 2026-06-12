import { describe, test } from "vite-plus/test";
import { op06TheArkMaxim117 } from "../../../../../cards/src/cards/OP06/stages/117-the-ark-maxim.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-117 The Ark Maxim", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06TheArkMaxim117);
  });
});
