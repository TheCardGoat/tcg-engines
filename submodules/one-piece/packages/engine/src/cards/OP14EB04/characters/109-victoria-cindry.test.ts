import { describe, test } from "vite-plus/test";
import { op14eb04VictoriaCindry109 } from "../../../../../cards/src/cards/OP14EB04/characters/109-victoria-cindry.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP14-109 Victoria Cindry", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04VictoriaCindry109);
  });
});
