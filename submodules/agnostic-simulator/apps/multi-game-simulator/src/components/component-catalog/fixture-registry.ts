export const nativeFixtureComponents: Readonly<Record<string, readonly string[]>> = {
  cyberpunk: [
    "Card",
    "CardImage",
    "DieDisplay",
    "SeatStatus",
    "CardHit",
    "PlayerNameplate",
    "DeckZone",
    "TrashZone",
    "ClockDisplay",
    "CenterRow",
    "PassTurnControl",
    "EddiesZone",
  ],
  "one-piece": ["PlayerMat"],
  gundam: ["CardFace", "DeckStack", "ShieldPips"],
  "flesh-and-blood": ["FabBoardCardFace", "FabMatchClock"],
  "grand-archive": ["GrandArchiveRoleCard"],
  naruto: [
    "CharacterCard",
    "LeaderZone",
    "SupportSlot",
    "ChakraPips",
    "SummonSlot",
    "SeamPrompt",
    "NarutoCardImage",
  ],
  "alpha-clash": ["AlphaClashArena3D"],
};
export function registeredFamily(game: string, name: string): string | undefined {
  // Shared primitives are not treated as game previews without production composition evidence.
  return nativeFixtureComponents[game]?.includes(name) ? "All components" : undefined;
}
