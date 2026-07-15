import { describe, test } from "vite-plus/test";
import { op02Mohji060 } from "../../../../../cards/src/cards/OP02/characters/060-mohji.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-060 Mohji", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02Mohji060);
  });
});
