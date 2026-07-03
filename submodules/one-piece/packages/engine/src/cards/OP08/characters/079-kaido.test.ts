import { describe, test } from "vite-plus/test";
import { op08Kaido079 } from "../../../../../cards/src/cards/OP08/characters/079-kaido.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-079 Kaido", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08Kaido079);
  });
});
