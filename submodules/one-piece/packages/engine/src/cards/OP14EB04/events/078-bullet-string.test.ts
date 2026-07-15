import { describe, test } from "vite-plus/test";
import { op14eb04BulletString078 } from "../../../../../cards/src/cards/OP14EB04/events/078-bullet-string.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP14-078 Bullet String", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04BulletString078);
  });
});
