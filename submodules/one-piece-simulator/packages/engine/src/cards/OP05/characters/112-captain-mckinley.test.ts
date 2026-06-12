import { describe, test } from "vite-plus/test";
import { op05CaptainMckinley112 } from "../../../../../cards/src/cards/OP05/characters/112-captain-mckinley.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-112 Captain McKinley", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05CaptainMckinley112);
  });
});
