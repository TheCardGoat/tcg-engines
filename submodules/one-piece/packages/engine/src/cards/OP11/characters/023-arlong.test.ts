import { describe, test } from "vite-plus/test";
import { op11Arlong023 } from "../../../../../cards/src/cards/OP11/characters/023-arlong.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP11-023 Arlong", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11Arlong023);
  });
});
