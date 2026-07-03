import { describe, test } from "vite-plus/test";
import { op08MonkeyDLuffySp109 } from "../../../../../cards/src/cards/OP08/characters/109-monkey-d-luffy-sp.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-109 Monkey.D.Luffy (SP)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08MonkeyDLuffySp109);
  });
});
