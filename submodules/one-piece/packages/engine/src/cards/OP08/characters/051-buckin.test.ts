import { describe, test } from "vite-plus/test";
import { op08Buckin051 } from "../../../../../cards/src/cards/OP08/characters/051-buckin.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-051 Buckin", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08Buckin051);
  });
});
