import { describe, test } from "vite-plus/test";
import { op13GumGumGatlingGun021 } from "../../../../../cards/src/cards/OP13/events/021-gum-gum-gatling-gun.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP13-021 Gum-Gum Gatling Gun", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13GumGumGatlingGun021);
  });
});
