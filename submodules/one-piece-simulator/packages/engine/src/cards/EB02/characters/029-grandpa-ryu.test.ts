import { describe, test } from "vite-plus/test";
import { eb02GrandpaRyu029 } from "../../../../../cards/src/cards/EB02/characters/029-grandpa-ryu.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB02-029 Grandpa Ryu", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb02GrandpaRyu029);
  });
});
