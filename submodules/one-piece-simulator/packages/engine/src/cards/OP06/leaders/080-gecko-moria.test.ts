import { describe, test } from "vite-plus/test";
import { op06GeckoMoria080 } from "../../../../../cards/src/cards/OP06/leaders/080-gecko-moria.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-080 Gecko Moria", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06GeckoMoria080);
  });
});
