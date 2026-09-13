import { describe, expect, it } from "vite-plus/test";

import { GameSettingsMapSchema, SettingsGameSlugSchema, UserSettingsSchema } from "./settings.ts";

describe("Gundam canonical simulator settings", () => {
  it("accepts the no-valid-action auto-pass preference", () => {
    expect(
      UserSettingsSchema.parse({
        playerSettings: {},
        gameSettings: {
          gundam: {
            visual: { playmatId: "space-colony" },
            simulator: { autoPassWhenNoValidAction: false },
          },
        },
      }),
    ).toMatchObject({
      gameSettings: {
        gundam: {
          visual: { playmatId: "space-colony" },
          simulator: { autoPassWhenNoValidAction: false },
        },
      },
    });
  });

  it("rejects unknown Gundam simulator settings", () => {
    expect(() =>
      GameSettingsMapSchema.parse({
        gundam: {
          simulator: { passTurnAutomatically: true },
        },
      }),
    ).toThrow();
  });
});

it("accepts GA as a preferred game and preserves its visual settings", () => {
  expect(SettingsGameSlugSchema.parse("grand-archive")).toBe("grand-archive");
  expect(
    GameSettingsMapSchema.parse({
      "grand-archive": { visual: { playmatId: "space-colony" } },
    }),
  ).toEqual({ "grand-archive": { visual: { playmatId: "space-colony" } } });
});
