import { authSession } from "$lib/auth/session.svelte.js";
import {
  createDeckForProfile,
  deleteDeckForProfile,
  fetchMatchmakingContext,
  fetchProfileDeckSummaries,
  fetchSelectedProfileDeckSummary,
  onboardPlayer,
  updateActiveMatchmakingProfile,
  updateProfileSelectedDeck,
  type MatchmakingContext,
  type ProfileDeckSummary,
  type ProfileMatchmakingContext,
} from "../api/player-context-api.js";
import { trackEvent, setUserProperties } from "$lib/analytics/analytics.js";

function updateProfileSelection(
  profiles: ProfileMatchmakingContext[],
  gameProfileId: string,
  selectedDeckId: string,
  selectedDeckSummary: ProfileDeckSummary | null,
): ProfileMatchmakingContext[] {
  return profiles.map((profile) =>
    profile.gameProfileId === gameProfileId
      ? { ...profile, selectedDeckId, selectedDeckSummary }
      : profile,
  );
}

function updateProfileDecks(
  profiles: ProfileMatchmakingContext[],
  gameProfileId: string,
  decks: ProfileDeckSummary[],
): ProfileMatchmakingContext[] {
  return profiles.map((profile) => {
    if (profile.gameProfileId !== gameProfileId) {
      return profile;
    }

    return {
      ...profile,
      decks,
      selectedDeckSummary: profile.selectedDeckId
        ? (decks.find((deck) => deck.deckId === profile.selectedDeckId) ?? null)
        : null,
    };
  });
}

function resolveSelectedDeck(profile: ProfileMatchmakingContext | null): ProfileDeckSummary | null {
  if (!profile?.selectedDeckId) {
    return null;
  }

  if (profile.decks) {
    return profile.decks.find((deck) => deck.deckId === profile.selectedDeckId) ?? null;
  }

  return profile.selectedDeckSummary?.deckId === profile.selectedDeckId
    ? profile.selectedDeckSummary
    : null;
}

function withProfileValue<T>(
  record: Record<string, T>,
  gameProfileId: string,
  value: T,
): Record<string, T> {
  return {
    ...record,
    [gameProfileId]: value,
  };
}

function updateProfileSelectedDeckSummary(
  profiles: ProfileMatchmakingContext[],
  gameProfileId: string,
  selectedDeckId: string | null,
  selectedDeckSummary: ProfileDeckSummary | null,
): ProfileMatchmakingContext[] {
  return profiles.map((profile) =>
    profile.gameProfileId === gameProfileId
      ? { ...profile, selectedDeckId, selectedDeckSummary }
      : profile,
  );
}

export class MatchmakingPlayerContextState {
  loading = $state(false);
  savingProfile = $state(false);
  savingDeck = $state(false);
  loadingDecksByProfileId = $state<Record<string, boolean>>({});
  deckLoadErrorsByProfileId = $state<Record<string, string | null>>({});
  onboarding = $state(false);
  error = $state<string | null>(null);
  onboardingError = $state<string | null>(null);
  context = $state<MatchmakingContext | null>(null);

  constructor(initialContext: MatchmakingContext | null = null) {
    if (initialContext) {
      this.context = initialContext;
    }
  }

  get isAuthenticated(): boolean {
    return authSession.isAuthenticated;
  }

  /** True when the user is authenticated and loaded but has no game profiles yet. */
  get needsOnboarding(): boolean {
    return (
      !this.loading &&
      authSession.isAuthenticated &&
      this.context !== null &&
      this.profiles.length === 0
    );
  }

  get activeGameProfileId(): string | null {
    return this.context?.activeGameProfileId ?? null;
  }

  get profiles(): ProfileMatchmakingContext[] {
    return this.context?.profiles ?? [];
  }

  get activeProfile(): ProfileMatchmakingContext | null {
    const activeGameProfileId = this.activeGameProfileId;
    if (!activeGameProfileId) {
      return null;
    }

    return this.profiles.find((profile) => profile.gameProfileId === activeGameProfileId) ?? null;
  }

  get selectedDeck(): ProfileDeckSummary | null {
    return resolveSelectedDeck(this.activeProfile);
  }

  isLoadingDecks(gameProfileId: string): boolean {
    return this.loadingDecksByProfileId[gameProfileId] ?? false;
  }

  deckLoadError(gameProfileId: string): string | null {
    return this.deckLoadErrorsByProfileId[gameProfileId] ?? null;
  }

  areDecksLoaded(gameProfileId: string): boolean {
    return this.profiles.find((profile) => profile.gameProfileId === gameProfileId)?.decks !== null;
  }

  async initialize(): Promise<void> {
    if (!authSession.isAuthenticated) {
      this.reset();
      return;
    }

    // Skip fetch if already hydrated from SSR
    if (this.context) return;

    await this.refresh();
  }

  /** Accept terms, trigger legacy migration, and create game profile. */
  async onboard(): Promise<boolean> {
    this.onboarding = true;
    this.onboardingError = null;
    trackEvent("onboard_start");

    try {
      this.context = await onboardPlayer();
      trackEvent("onboard_complete");
      setUserProperties({ has_profile: "true" });
      return true;
    } catch (error) {
      this.onboardingError =
        error instanceof Error ? error.message : "Failed to create your profile";
      trackEvent("onboard_error", { error: "onboarding_failed" });
      return false;
    } finally {
      this.onboarding = false;
    }
  }

  async refresh(): Promise<void> {
    if (!authSession.isAuthenticated) {
      this.reset();
      return;
    }

    this.loading = true;
    this.error = null;

    try {
      this.context = await fetchMatchmakingContext();
    } catch (error) {
      this.error = error instanceof Error ? error.message : "Failed to load player context";
      this.context = null;
    } finally {
      this.loading = false;
    }
  }

  async setActiveProfile(gameProfileId: string): Promise<void> {
    if (!this.context || this.context.activeGameProfileId === gameProfileId) {
      return;
    }

    const previousContext = this.context;
    this.context = {
      ...this.context,
      activeGameProfileId: gameProfileId,
    };
    this.savingProfile = true;
    this.error = null;

    try {
      await updateActiveMatchmakingProfile(gameProfileId);
      await this.loadSelectedDeckSummary(gameProfileId);
      trackEvent("profile_switch");
    } catch (error) {
      this.context = previousContext;
      this.error = error instanceof Error ? error.message : "Failed to save active profile";
    } finally {
      this.savingProfile = false;
    }
  }

  async setSelectedDeck(selectedDeckId: string): Promise<void> {
    const activeProfile = this.activeProfile;
    if (!this.context || !activeProfile || activeProfile.selectedDeckId === selectedDeckId) {
      return;
    }

    const selectedDeckSummary =
      activeProfile.decks?.find((deck) => deck.deckId === selectedDeckId) ?? null;

    const previousContext = this.context;
    this.context = {
      ...this.context,
      profiles: updateProfileSelection(
        this.context.profiles,
        activeProfile.gameProfileId,
        selectedDeckId,
        selectedDeckSummary,
      ),
    };
    this.savingDeck = true;
    this.error = null;

    try {
      await updateProfileSelectedDeck(activeProfile.gameProfileId, selectedDeckId);
      trackEvent("deck_select");
    } catch (error) {
      this.context = previousContext;
      this.error = error instanceof Error ? error.message : "Failed to save selected deck";
    } finally {
      this.savingDeck = false;
    }
  }

  async createDeck(deckName: string): Promise<string | null> {
    const activeProfile = this.activeProfile;
    if (!this.context || !activeProfile) {
      return null;
    }

    try {
      const created = await createDeckForProfile(activeProfile.gameProfileId, { deckName });
      await this.loadProfileDecks(activeProfile.gameProfileId, { force: true });
      trackEvent("deck_create");
      return created.deckId;
    } catch (error) {
      this.error = error instanceof Error ? error.message : "Failed to create deck";
      return null;
    }
  }

  async deleteDeck(deckId: string): Promise<boolean> {
    const activeProfile = this.activeProfile;
    if (!this.context || !activeProfile) {
      return false;
    }

    const previousContext = this.context;

    // Optimistically remove deck from local state
    const updatedDecks = (activeProfile.decks ?? []).filter((deck) => deck.deckId !== deckId);
    const wasSelected = activeProfile.selectedDeckId === deckId;
    this.context = {
      ...this.context,
      profiles: this.context.profiles.map((profile) =>
        profile.gameProfileId === activeProfile.gameProfileId
          ? {
              ...profile,
              decks: updatedDecks,
              selectedDeckId: wasSelected ? null : profile.selectedDeckId,
              selectedDeckSummary: wasSelected ? null : profile.selectedDeckSummary,
            }
          : profile,
      ),
    };

    try {
      await deleteDeckForProfile(activeProfile.gameProfileId, deckId);
      trackEvent("deck_delete");
      return true;
    } catch (error) {
      this.context = previousContext;
      this.error = error instanceof Error ? error.message : "Failed to delete deck";
      return false;
    }
  }

  async loadProfileDecks(
    gameProfileId: string,
    options: { force?: boolean } = {},
  ): Promise<ProfileDeckSummary[]> {
    const profile = this.profiles.find((entry) => entry.gameProfileId === gameProfileId);
    if (!profile) {
      return [];
    }

    if (!options.force && profile.decks !== null) {
      return profile.decks;
    }

    if (this.isLoadingDecks(gameProfileId)) {
      return profile.decks ?? [];
    }

    this.loadingDecksByProfileId = withProfileValue(
      this.loadingDecksByProfileId,
      gameProfileId,
      true,
    );
    this.deckLoadErrorsByProfileId = withProfileValue(
      this.deckLoadErrorsByProfileId,
      gameProfileId,
      null,
    );

    try {
      const decks = await fetchProfileDeckSummaries(gameProfileId);
      if (this.context) {
        this.context = {
          ...this.context,
          profiles: updateProfileDecks(this.context.profiles, gameProfileId, decks),
        };
      }
      return decks;
    } catch (error) {
      this.deckLoadErrorsByProfileId = withProfileValue(
        this.deckLoadErrorsByProfileId,
        gameProfileId,
        error instanceof Error ? error.message : "Failed to load decks",
      );
      return profile.decks ?? [];
    } finally {
      this.loadingDecksByProfileId = withProfileValue(
        this.loadingDecksByProfileId,
        gameProfileId,
        false,
      );
    }
  }

  async loadSelectedDeckSummary(gameProfileId: string): Promise<ProfileDeckSummary | null> {
    const profile = this.profiles.find((entry) => entry.gameProfileId === gameProfileId);
    if (!profile) {
      return null;
    }

    if (profile.selectedDeckSummary || profile.selectedDeckId === null) {
      return profile.selectedDeckSummary;
    }

    try {
      const selectedDeck = await fetchSelectedProfileDeckSummary(gameProfileId);
      if (this.context) {
        this.context = {
          ...this.context,
          profiles: updateProfileSelectedDeckSummary(
            this.context.profiles,
            gameProfileId,
            selectedDeck.selectedDeckId,
            selectedDeck.selectedDeckSummary,
          ),
        };
      }
      return selectedDeck.selectedDeckSummary;
    } catch (error) {
      this.error = error instanceof Error ? error.message : "Failed to load selected deck";
      return null;
    }
  }

  reset(): void {
    this.loading = false;
    this.savingProfile = false;
    this.savingDeck = false;
    this.loadingDecksByProfileId = {};
    this.deckLoadErrorsByProfileId = {};
    this.error = null;
    this.context = null;
  }
}
