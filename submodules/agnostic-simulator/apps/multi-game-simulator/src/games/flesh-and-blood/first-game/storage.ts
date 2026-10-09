export const FAB_FIRST_GAME_TUTORIAL_STORAGE_KEY = "tcg:flesh-and-blood:first-game-tutorial:v1";

/**
 * Off until the guided-game copy matches the live rules. It currently misleads players.
 * Twin switch: `fabTutorialEnabled` in the platform web app's game matchmaking page.
 * Turn both on together. Matchmaking-only offers the guide and then redirects here.
 */
export const FAB_FIRST_GAME_TUTORIAL_ENABLED = false;
const PLAYER_LOCALE_STORAGE_KEY = "matchmaking.player.locale";

export function readTutorialLocalePreference(): string | null {
  try {
    return window.localStorage.getItem(PLAYER_LOCALE_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function firstGameTutorialSeen(): boolean {
  try {
    return window.localStorage.getItem(FAB_FIRST_GAME_TUTORIAL_STORAGE_KEY) !== null;
  } catch {
    return false;
  }
}

export function saveFirstGameTutorialResult(result: "dismissed" | "completed"): void {
  try {
    window.localStorage.setItem(FAB_FIRST_GAME_TUTORIAL_STORAGE_KEY, result);
  } catch {
    // Private browsing can disable storage. The guide still works this visit.
  }
}
