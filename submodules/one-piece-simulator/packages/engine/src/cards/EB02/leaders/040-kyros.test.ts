import { describe, test } from "vite-plus/test";
import { eb02Kyros040 } from "../../../../../cards/src/cards/EB02/leaders/040-kyros.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB01-040 Kyros", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb02Kyros040);
  });
});
