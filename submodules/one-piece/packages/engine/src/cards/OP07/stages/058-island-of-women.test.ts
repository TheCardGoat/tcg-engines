import { describe, test } from "vite-plus/test";
import { op07IslandOfWomen058 } from "../../../../../cards/src/cards/OP07/stages/058-island-of-women.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-058 Island of Women", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07IslandOfWomen058);
  });
});
