import { describe, test } from "vite-plus/test";
import { op11CognacMamaMash081 } from "../../../../../cards/src/cards/OP11/events/081-cognac-mama-mash.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP11-081 Cognac Mama-Mash", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11CognacMamaMash081);
  });
});
