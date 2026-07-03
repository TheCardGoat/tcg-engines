import { describe, test } from "vite-plus/test";
import { op09ZoroJuurouSp067 } from "../../../../../cards/src/cards/OP09/characters/067-zoro-juurou-sp.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-067 Zoro-Juurou (SP)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09ZoroJuurouSp067);
  });
});
