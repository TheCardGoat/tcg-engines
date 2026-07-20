import { describe, expect, test } from "vite-plus/test";
import { buildCardEffects } from "../../src/effect-parser/index.ts";

describe("OP13-025 Koby", () => {
  test("keeps the FILM-trait or Strike-attribute Leader gate on its On Play action", () => {
    expect(
      buildCardEffects(
        '[Blocker]\n[On Play] If your Leader has the "FILM" type or the "Strike" attribute, set up to 1 of your DON!! cards as active.',
      ),
    ).toMatchObject({
      keywords: ["blocker"],
      effects: [
        {
          trigger: "onPlay",
          conditions: [
            {
              condition: "compound",
              operator: "or",
              conditions: [
                { condition: "leaderTrait", trait: "FILM", match: "includes" },
                { condition: "leaderAttribute", attribute: "strike" },
              ],
            },
          ],
          actions: [{ action: "setActive" }],
        },
      ],
    });
  });
});
