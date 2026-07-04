import { describe, test } from "vite-plus/test";
import { op07Gismonda084 } from "../../../../../cards/src/cards/OP07/characters/084-gismonda.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-084 Gismonda", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07Gismonda084);
  });
});
