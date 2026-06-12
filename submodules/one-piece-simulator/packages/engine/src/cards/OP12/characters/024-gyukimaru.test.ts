import { describe, test } from "vite-plus/test";
import { op12Gyukimaru024 } from "../../../../../cards/src/cards/OP12/characters/024-gyukimaru.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP12-024 Gyukimaru", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op12Gyukimaru024);
  });
});
