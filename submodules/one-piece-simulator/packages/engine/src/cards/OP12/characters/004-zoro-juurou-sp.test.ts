import { describe, test } from "vite-plus/test";
import { op12ZoroJuurouSp004 } from "../../../../../cards/src/cards/OP12/characters/004-zoro-juurou-sp.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("ST18-004 Zoro-Juurou (SP)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op12ZoroJuurouSp004);
  });
});
