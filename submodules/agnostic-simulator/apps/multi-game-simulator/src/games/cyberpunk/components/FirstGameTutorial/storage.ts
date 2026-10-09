export const FIRST_GAME_TUTORIAL_STORAGE_KEY = "tcg:cyberpunk:first-game-tutorial:v1";
export const FIRST_GAME_TUTORIAL_STORAGE_V2_KEY = "tcg:cyberpunk:first-game-tutorial:board-v2";
const PLAYER_LOCALE_STORAGE_KEY = "matchmaking.player.locale";

/** The guided game differs per board version, so each version arms its own invitation. */
export type TutorialBoardVersion = "v1" | "v2";

function storageKeyFor(boardVersion: TutorialBoardVersion): string {
  return boardVersion === "v2"
    ? FIRST_GAME_TUTORIAL_STORAGE_V2_KEY
    : FIRST_GAME_TUTORIAL_STORAGE_KEY;
}

export function readTutorialLocalePreference(): string | null {
  try {
    return window.localStorage.getItem(PLAYER_LOCALE_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function firstGameTutorialSeen(boardVersion: TutorialBoardVersion): boolean {
  try {
    return window.localStorage.getItem(storageKeyFor(boardVersion)) !== null;
  } catch {
    return false;
  }
}

export function saveFirstGameTutorialResult(
  result: "dismissed" | "completed",
  boardVersion: TutorialBoardVersion,
): void {
  try {
    window.localStorage.setItem(storageKeyFor(boardVersion), result);
  } catch {
    // Private browsing can disable storage. The guide still works this visit.
  }
}
