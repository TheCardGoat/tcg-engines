import { describe, test } from "vite-plus/test";
import { op13TheEmptyThrone099 } from "../../../../../cards/src/cards/stages/op13-099-the-empty-throne.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP13-099 The Empty Throne", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13TheEmptyThrone099);
  });
});
