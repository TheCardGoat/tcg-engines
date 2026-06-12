import { describe, test } from "vite-plus/test";
import { op06AmaNoMurakumoSword056 } from "../../../../../cards/src/cards/OP06/events/056-ama-no-murakumo-sword.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-056 Ama no Murakumo Sword", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06AmaNoMurakumoSword056);
  });
});
