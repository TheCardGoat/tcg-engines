import { describe, test } from "vite-plus/test";
import { eb02Foxy059 } from "../../../../../cards/src/cards/EB02/leaders/059-foxy.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-059 Foxy", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb02Foxy059);
  });
});
