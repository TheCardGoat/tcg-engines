import { describe, test } from "vite-plus/test";
import { op12Inuarashi022 } from "../../../../../cards/src/cards/OP12/characters/022-inuarashi.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP12-022 Inuarashi", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op12Inuarashi022);
  });
});
