import { describe, test } from "vite-plus/test";
import { op02Sakazuki099 } from "../../../../../cards/src/cards/OP02/characters/099-sakazuki.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-099 Sakazuki", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02Sakazuki099);
  });
});
