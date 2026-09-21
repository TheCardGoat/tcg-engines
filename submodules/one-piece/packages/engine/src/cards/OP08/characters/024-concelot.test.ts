import { describe, test } from "vite-plus/test";
import { op08Concelot024 } from "../../../../../cards/src/cards/characters/op08-024-concelot.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-024 Concelot", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08Concelot024);
  });
});
