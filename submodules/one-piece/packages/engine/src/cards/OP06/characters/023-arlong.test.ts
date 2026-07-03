import { describe, test } from "vite-plus/test";
import { op06Arlong023 } from "../../../../../cards/src/cards/OP06/characters/023-arlong.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-023 Arlong", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06Arlong023);
  });
});
