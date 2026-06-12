import { describe, test } from "vite-plus/test";
import { op14eb04MsWednesday083 } from "../../../../../cards/src/cards/OP14EB04/characters/083-ms-wednesday.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP14-083 Ms. Wednesday", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04MsWednesday083);
  });
});
