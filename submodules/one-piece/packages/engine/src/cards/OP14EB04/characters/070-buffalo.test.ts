import { describe, test } from "vite-plus/test";
import { op14eb04Buffalo070 } from "../../../../../cards/src/cards/OP14EB04/characters/070-buffalo.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP14-070 Buffalo", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04Buffalo070);
  });
});
