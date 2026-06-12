import { describe, test } from "vite-plus/test";
import { op06Aisa099 } from "../../../../../cards/src/cards/OP06/characters/099-aisa.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-099 Aisa", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06Aisa099);
  });
});
