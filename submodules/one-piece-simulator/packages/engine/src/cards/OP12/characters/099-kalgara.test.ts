import { describe, test } from "vite-plus/test";
import { op12Kalgara099 } from "../../../../../cards/src/cards/OP12/characters/099-kalgara.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP12-099 Kalgara", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op12Kalgara099);
  });
});
