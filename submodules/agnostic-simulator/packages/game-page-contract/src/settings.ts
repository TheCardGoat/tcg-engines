import { z } from "zod";

export const SettingsGameSlugSchema = z.enum([
  "lorcana",
  "cyberpunk",
  "gundam",
  "one-piece",
  "riftbound",
  "naruto",
  "flesh-and-blood",
  "grand-archive",
]);

export type SettingsGameSlug = z.infer<typeof SettingsGameSlugSchema>;

export const AnimationSpeedSchema = z.enum(["off", "fast", "normal", "slow"]);
export const HotkeyModeSchema = z.enum(["off", "confirm-only", "on"]);
export const CardPreviewModeSchema = z.enum(["disabled", "immediate", "delayed"]);
export const CardInteractionModeSchema = z.enum(["detailed", "quick"]);

export const PlayerSettingsSchema = z
  .object({
    selectedLocale: z.string().optional(),
    theme: z.enum(["light", "dark"]).optional(),
    animationSpeed: AnimationSpeedSchema.optional(),
    hotkeyMode: HotkeyModeSchema.optional(),
    cardPreviewMode: CardPreviewModeSchema.optional(),
    cardInteractionMode: CardInteractionModeSchema.optional(),
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
        dicierStyle: z
          .enum([
            "Round-Heavy",
            "Round-Light",
            "Round-Dark",
            "Flat-Heavy",
            "Flat-Light",
            "Flat-Dark",
            "Block-Heavy",
            "Block-Light",
            "Block-Dark",
            "Pixel",
          ])
          .optional(),
        fieldCardSize: z.enum(["compact", "standard", "large"]).optional(),
        // Legacy persisted preference. The simulator no longer reads or writes
        // it, but accepting the field keeps older settings records readable.
        animationPacing: z.enum(["fast", "standard", "cinematic"]).optional(),
      })
      .strict()
      .optional(),
  })
  .strict();

export const GundamGameSettingsSchema = z
  .object({
    visual: GameVisualSettingsSchema.optional(),
    simulator: z
      .object({
        autoPassWhenNoValidAction: z.boolean().optional(),
      })
      .strict()
      .optional(),
  })
  .strict();

export const FabPriorityModeSchema = z.enum(["auto-pass", "always-hold", "play-and-skip"]);

export type FabPriorityMode = z.infer<typeof FabPriorityModeSchema>;

/** Countdown speed for held pass-only windows; `normal` is the product default. */
export const FabCountdownSpeedSchema = z.enum(["fast", "normal", "slow"]);

export type FabCountdownSpeed = z.infer<typeof FabCountdownSpeedSchema>;

/** One countdown duration per speed, in milliseconds. Single source of truth. */
export const FAB_COUNTDOWN_SPEED_MS: Record<FabCountdownSpeed, number> = {
  fast: 3000,
  normal: 7000,
  slow: 12000,
};

export const DEFAULT_FAB_COUNTDOWN_SPEED: FabCountdownSpeed = "normal";

/**
 * Product-wide default for the Flesh and Blood simulator priority mode.
 * Single source of truth: the platform DB default, the simulator's declared
 * default, and the web matchmaking fallback all consume this constant so the
 * default can only change by editing this one line.
 */
export const DEFAULT_FAB_PRIORITY_MODE: FabPriorityMode = "auto-pass";

/**
 * Canonical browser-storage key for the FaB priority-mode local fallback.
 * Both the web matchmaking control and the simulator's settings provider
 * read and write this key (the simulator additionally migrates the legacy
 * `matchmaking.flesh-and-blood.priorityAutomation` key on read).
 */
export const FAB_PRIORITY_MODE_STORAGE_KEY = "matchmaking.flesh-and-blood.priorityMode";

/**
 * Canonical browser-storage key for the FaB countdown-speed local fallback.
 * Sits beside the priority-mode key and follows the same hydration order
 * (account column first, then storage, then the declared default).
 */
export const FAB_COUNTDOWN_SPEED_STORAGE_KEY = "matchmaking.flesh-and-blood.countdownSpeed";

/**
 * Product-wide default for auto-selecting a mathematically unique target
 * (typically the only legal object). The engine fails unseeded seats closed
 * to ask; new matches seed this constant so the default is on.
 */
export const DEFAULT_FAB_AUTO_SELECT_SINGLETON_TARGETS = true;

/** Canonical browser-storage key for the FaB singleton-target auto-select fallback. */
export const FAB_AUTO_SELECT_SINGLETON_TARGETS_STORAGE_KEY =
  "matchmaking.flesh-and-blood.autoSelectSingletonTargets";

export const FleshAndBloodGameSettingsSchema = z
  .object({
    visual: GameVisualSettingsSchema.optional(),
    simulator: z
      .object({
        /**
         * Engine-owned priority mode seeded into new matches: `auto-pass`
         * drains the seat's pass-only windows, `always-hold` leaves every
         * window in human hands, and `play-and-skip` additionally skips the
         * seat's own follow-up window after its own play, activation, or
         * attack declaration. The product default is `auto-pass`; the
         * engine fails missing seats closed to `always-hold`.
         */
        priorityMode: FabPriorityModeSchema.optional(),
        /** Countdown duration for held pass-only windows. Absent ⇒ `normal`. */
        countdownSpeed: FabCountdownSpeedSchema.optional(),
        /**
         * Auto-answer both simultaneous-trigger ordering decisions with the
         * pending-entry default order. Orthogonal to the priority mode: on in
         * any mode. Absent ⇒ ask.
         */
        autoOrderTriggers: z.boolean().optional(),
        /**
         * Auto-answer entity-target decisions whose selected set is unique
         * (min = max = candidate count). Orthogonal to the priority mode.
         * Absent ⇒ on (the product default).
         */
        autoSelectSingletonTargets: z.boolean().optional(),
        /**
         * Canonical card ids whose own-action follow-up windows are never
         * skipped by `play-and-skip`. Absent ⇒ skip every own window.
         */
        playAndSkipHoldCardIds: z.array(z.string()).max(256).optional(),
        /**
         * Canonical card ids whose opposing triggered layers the seat passes
         * unconditionally while top (mirrors the owner-side trigger
         * automation). Absent ⇒ hold every opposing-trigger window.
         */
        opponentTriggerYieldCardIds: z.array(z.string()).max(256).optional(),
        /**
         * Canonical card ids whose optional triggers the player saved for
         * auto-decline. Stored as a capped array; the adapter seed carries the
         * same ids and the engine maps them onto instances the seat owns at
         * creation (unknown or non-owned ids are dropped). Absent ⇒ ask.
         */
        optionalTriggerDeclines: z.array(z.string()).max(256).optional(),
        /** Canonical card ids whose optional effects are always used. */
        optionalTriggerAccepts: z.array(z.string()).max(256).optional(),
      })
      .strict()
      .optional(),
  })
  .strict();

export const GameSettingsMapSchema = z
  .object({
    lorcana: LorcanaGameSettingsSchema.optional(),
    cyberpunk: CyberpunkGameSettingsSchema.optional(),
    gundam: GundamGameSettingsSchema.optional(),
    "one-piece": VisualOnlyGameSettingsSchema.optional(),
    riftbound: VisualOnlyGameSettingsSchema.optional(),
    naruto: VisualOnlyGameSettingsSchema.optional(),
    "flesh-and-blood": FleshAndBloodGameSettingsSchema.optional(),
    "grand-archive": VisualOnlyGameSettingsSchema.optional(),
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
