import { describe, test } from "vite-plus/test";
import { op06Yamato022 } from "../../../../../cards/src/cards/leaders/op06-022-yamato.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-022 Yamato", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06Yamato022);
  });
});
