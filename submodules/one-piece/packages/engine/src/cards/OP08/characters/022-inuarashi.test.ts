import { describe, test } from "vite-plus/test";
import { op08Inuarashi022 } from "../../../../../cards/src/cards/OP08/characters/022-inuarashi.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-022 Inuarashi", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08Inuarashi022);
  });
});
