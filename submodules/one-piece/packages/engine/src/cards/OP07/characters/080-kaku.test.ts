import { describe, test } from "vite-plus/test";
import { op07Kaku080 } from "../../../../../cards/src/cards/OP07/characters/080-kaku.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-080 Kaku", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07Kaku080);
  });
});
