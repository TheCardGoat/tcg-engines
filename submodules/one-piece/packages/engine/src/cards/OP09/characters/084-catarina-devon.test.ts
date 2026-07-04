import { describe, test } from "vite-plus/test";
import { op09CatarinaDevon084 } from "../../../../../cards/src/cards/OP09/characters/084-catarina-devon.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-084 Catarina Devon", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09CatarinaDevon084);
  });
});
