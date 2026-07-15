import { describe, test } from "vite-plus/test";
import { op07Foxy059 } from "../../../../../cards/src/cards/OP07/leaders/059-foxy.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-059 Foxy", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07Foxy059);
  });
});
