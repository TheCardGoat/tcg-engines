import { describe, test } from "vite-plus/test";
import { op03GalleyLaCompany075 } from "../../../../../cards/src/cards/OP03/stages/075-galley-la-company.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-075 Galley-La Company", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03GalleyLaCompany075);
  });
});
