import { describe, test } from "vite-plus/test";
import { op08IDNeverShootYou017 } from "../../../../../cards/src/cards/events/op08-017-i-d-never-shoot-you.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-017 I'd Never Shoot You!!!!", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08IDNeverShootYou017);
  });
});
