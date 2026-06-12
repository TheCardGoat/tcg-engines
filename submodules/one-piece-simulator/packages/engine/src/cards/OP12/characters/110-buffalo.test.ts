import { describe, test } from "vite-plus/test";
import { op12Buffalo110 } from "../../../../../cards/src/cards/OP12/characters/110-buffalo.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP12-110 Buffalo", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op12Buffalo110);
  });
});
