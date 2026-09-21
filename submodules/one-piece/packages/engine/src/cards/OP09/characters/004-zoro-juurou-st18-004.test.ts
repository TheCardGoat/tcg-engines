import { describe, test } from "vite-plus/test";
import { op09ZoroJuurouSt18004004 } from "../../../../../cards/src/cards/characters/st18-004-zoro-juurou-st18-004.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("ST18-004 Zoro-Juurou (ST18-004)", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09ZoroJuurouSt18004004);
  });
});
