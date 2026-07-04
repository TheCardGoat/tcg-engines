import { describe, test } from "vite-plus/test";
import { op06Zeo028 } from "../../../../../cards/src/cards/OP06/characters/028-zeo.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-028 Zeo", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06Zeo028);
  });
});
