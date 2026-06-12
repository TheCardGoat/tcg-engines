import { describe, expect, it } from "bun:test";
import { createDefaultAutomatedMatchConfig } from "./config.js";
import { validateAutomatedMatchConfig } from "./fixture.js";

describe("automated match validation", () => {
  it("accepts valid fixture decklists", async () => {
    const errors = await validateAutomatedMatchConfig(createDefaultAutomatedMatchConfig());

    expect(errors).toEqual({});
  });

  it("reports malformed decklist lines", async () => {
    const config = createDefaultAutomatedMatchConfig();
    config.playerOneDeckText = "1 Sail The Azurite Sea\nthis line is malformed";

    const errors = await validateAutomatedMatchConfig(config);

    expect(errors.playerOneDeckText).toMatch(/malformed/i);
  });

  it("reports unresolved card names", async () => {
    const config = createDefaultAutomatedMatchConfig();
    config.playerTwoDeckText = "1 Definitely Not A Real Lorcana Card";

    const errors = await validateAutomatedMatchConfig(config);

    expect(errors.playerTwoDeckText).toMatch(/unknown card name/i);
  });
});
