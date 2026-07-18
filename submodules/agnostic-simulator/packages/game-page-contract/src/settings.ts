import { z } from "zod";

export const SettingsGameSlugSchema = z.enum([
  "lorcana",
  "cyberpunk",
  "gundam",
  "one-piece",
  "riftbound",
]);

export type SettingsGameSlug = z.infer<typeof SettingsGameSlugSchema>;

export const AnimationSpeedSchema = z.enum(["off", "fast", "normal", "slow"]);
export const HotkeyModeSchema = z.enum(["off", "confirm-only", "on"]);
export const CardPreviewModeSchema = z.enum(["disabled", "immediate", "delayed"]);

export const PlayerSettingsSchema = z
  .object({
    selectedLocale: z.string().optional(),
    theme: z.enum(["light", "dark"]).optional(),
    animationSpeed: AnimationSpeedSchema.optional(),
    hotkeyMode: HotkeyModeSchema.optional(),
    cardPreviewMode: CardPreviewModeSchema.optional(),
    soundVolume: z.number().finite().min(0).max(100).optional(),
    accessibleMobileControls: z.boolean().optional(),
    showZoneCounters: z.boolean().optional(),
    discordPresenceEnabled: z.boolean().optional(),
    contentWidgetDisabledGames: z.array(z.string()).optional(),
    /** IANA timezone used for player-local engagement day boundaries. */
    timeZone: z.string().optional(),
  })
  .strict();

export type PlayerSettings = z.infer<typeof PlayerSettingsSchema>;

export const GameVisualSettingsSchema = z
  .object({
    cardBackId: z.string().optional(),
    playmatId: z.string().optional(),
  })
  .strict();

export type GameVisualSettings = z.infer<typeof GameVisualSettingsSchema>;

const VisualOnlyGameSettingsSchema = z
  .object({
    visual: GameVisualSettingsSchema.optional(),
    simulator: z.record(z.string(), z.unknown()).optional(),
  })
  .strict();

export const LorcanaGameSettingsSchema = z
  .object({
    visual: GameVisualSettingsSchema.optional(),
    simulator: z
      .object({
        primaryClickAction: z.enum(["challenge", "quest", "none"]).optional(),
        cardInfoMode: z.enum(["detailed", "quick"]).optional(),
        priorityNudgeEnabled: z.boolean().optional(),
      })
      .strict()
      .optional(),
  })
  .strict();

export const CyberpunkGameSettingsSchema = z
  .object({
    visual: GameVisualSettingsSchema.optional(),
    simulator: z
      .object({
        diceDisplayMode: z.enum(["shape", "image", "font"]).optional(),
        diceImageColor: z
          .enum(["yellow", "blue", "red", "white", "purple", "green", "black"])
          .optional(),
        dicierStyle: z.string().optional(),
      })
      .strict()
      .optional(),
  })
  .strict();

export const GameSettingsMapSchema = z
  .object({
    lorcana: LorcanaGameSettingsSchema.optional(),
    cyberpunk: CyberpunkGameSettingsSchema.optional(),
    gundam: VisualOnlyGameSettingsSchema.optional(),
    "one-piece": VisualOnlyGameSettingsSchema.optional(),
    riftbound: VisualOnlyGameSettingsSchema.optional(),
  })
  .strict();

export type GameSettingsMap = z.infer<typeof GameSettingsMapSchema>;
export type GameSettings = NonNullable<GameSettingsMap[SettingsGameSlug]>;

export const UserSettingsSchema = z
  .object({
    playerSettings: PlayerSettingsSchema,
    gameSettings: GameSettingsMapSchema,
  })
  .strict();

export type UserSettings = z.infer<typeof UserSettingsSchema>;

export function settingsForGame(
  settings: UserSettings | undefined,
  gameSlug: SettingsGameSlug,
): { playerSettings: PlayerSettings; gameSettings: GameSettings | undefined } {
  return {
    playerSettings: settings?.playerSettings ?? {},
    gameSettings: settings?.gameSettings[gameSlug],
  };
}
