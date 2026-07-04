import { describe, test } from "vite-plus/test";
import { eb02Yamato022 } from "../../../../../cards/src/cards/EB02/leaders/022-yamato.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-022 Yamato", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb02Yamato022);
  });
});
