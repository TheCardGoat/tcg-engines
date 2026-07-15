import { describe, test } from "vite-plus/test";
import { op10Buffalo073 } from "../../../../../cards/src/cards/OP10/characters/073-buffalo.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-073 Buffalo", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10Buffalo073);
  });
});
