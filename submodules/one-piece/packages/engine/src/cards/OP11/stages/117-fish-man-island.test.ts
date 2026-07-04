import { describe, test } from "vite-plus/test";
import { op11FishManIsland117 } from "../../../../../cards/src/cards/OP11/stages/117-fish-man-island.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP11-117 Fish-Man Island", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11FishManIsland117);
  });
});
