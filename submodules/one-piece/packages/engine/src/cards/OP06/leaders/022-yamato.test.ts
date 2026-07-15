import { describe, test } from "vite-plus/test";
import { op06Yamato022 } from "../../../../../cards/src/cards/OP06/leaders/022-yamato.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-022 Yamato", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06Yamato022);
  });
});
