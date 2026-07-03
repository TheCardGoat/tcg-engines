import { describe, test } from "vite-plus/test";
import { op12ShimotsukiKouzaburou029 } from "../../../../../cards/src/cards/OP12/characters/029-shimotsuki-kouzaburou.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP12-029 Shimotsuki Kouzaburou", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op12ShimotsukiKouzaburou029);
  });
});
