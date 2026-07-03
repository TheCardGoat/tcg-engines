import { describe, test } from "vite-plus/test";
import { op12Nekomamushi032 } from "../../../../../cards/src/cards/OP12/characters/032-nekomamushi.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP12-032 Nekomamushi", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op12Nekomamushi032);
  });
});
