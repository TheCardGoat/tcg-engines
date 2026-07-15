import { describe, test } from "vite-plus/test";
import { op05Borsalino051 } from "../../../../../cards/src/cards/OP05/characters/051-borsalino.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-051 Borsalino", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05Borsalino051);
  });
});
