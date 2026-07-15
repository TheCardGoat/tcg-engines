import { describe, test } from "vite-plus/test";
import { eb03KoalaOp05006006 } from "../../../../../cards/src/cards/EB03/characters/006-koala-op05-006.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-006 Koala - OP05-006", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb03KoalaOp05006006);
  });
});
