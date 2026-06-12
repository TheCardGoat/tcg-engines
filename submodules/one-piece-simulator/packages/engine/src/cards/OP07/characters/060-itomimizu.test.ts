import { describe, test } from "vite-plus/test";
import { op07Itomimizu060 } from "../../../../../cards/src/cards/OP07/characters/060-itomimizu.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-060 Itomimizu", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07Itomimizu060);
  });
});
