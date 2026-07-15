import { describe, test } from "vite-plus/test";
import { op04CharlotteAmande105 } from "../../../../../cards/src/cards/OP04/characters/105-charlotte-amande.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-105 Charlotte Amande", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04CharlotteAmande105);
  });
});
