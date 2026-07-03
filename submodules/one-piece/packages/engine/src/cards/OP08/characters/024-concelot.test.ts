import { describe, test } from "vite-plus/test";
import { op08Concelot024 } from "../../../../../cards/src/cards/OP08/characters/024-concelot.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-024 Concelot", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08Concelot024);
  });
});
