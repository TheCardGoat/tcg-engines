import { describe, test } from "vite-plus/test";
import { op06Kikunojo104 } from "../../../../../cards/src/cards/OP06/characters/104-kikunojo.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-104 Kikunojo", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06Kikunojo104);
  });
});
