<script lang="ts">
  import { m } from "$lib/i18n/messages.js";
  import Star from "@lucide/svelte/icons/star";
  import Gem from "@lucide/svelte/icons/gem";
  import Sparkles from "@lucide/svelte/icons/sparkles";
  import ShieldCheck from "@lucide/svelte/icons/shield-check";
  import * as Dialog from "$lib/design-system/primitives/dialog";
  import { authSession } from "$lib/auth/session.svelte.js";
  import { fetchUserSettings, updateUserSettings } from "@/features/settings/user-settings-api.js";
  import {
    fetchAccountProfile,
    syncLegacyAccount,
    updateAccountProfile,
    updateProfileDisplayName,
    type AccountProfile,
  } from "../api/account-settings-api.js";
  import { resolvePatronTierConfig } from "@/features/simulator/model/player-tier.js";

  type AccountTab = "profile" | "account";

  const REGIONS = [
    "North America",
    "South America",
    "Europe",
    "Asia",
    "Africa",
    "Oceania",
    "Middle East",
  ] as const;

  const COUNTRIES = [
    "Argentina",
    "Australia",
    "Austria",
    "Belgium",
    "Brazil",
    "Canada",
    "Chile",
    "China",
    "Colombia",
    "Czech Republic",
    "Denmark",
    "Finland",
    "France",
    "Germany",
    "Greece",
    "Hungary",
    "India",
    "Indonesia",
    "Ireland",
    "Israel",
    "Italy",
    "Japan",
    "Malaysia",
    "Mexico",
    "Netherlands",
    "New Zealand",
    "Norway",
    "Peru",
    "Philippines",
    "Poland",
    "Portugal",
    "Romania",
    "Singapore",
    "South Africa",
    "South Korea",
    "Spain",
    "Sweden",
    "Switzerland",
    "Taiwan",
    "Thailand",
    "Turkey",
    "Ukraine",
    "United Arab Emirates",
    "United Kingdom",
    "United States",
    "Vietnam",
  ] as const;

  let {
    open = $bindable(false),
    activeGameProfileId = null,
  }: {
    open?: boolean;
    activeGameProfileId?: string | null;
  } = $props();

  const KOFI_CANCEL_ARTICLE_URL =
    "https://help.ko-fi.com/hc/en-us/articles/360007556993-How-to-help-a-supporter-cancel-their-membership#h_01HF9S5084YEY17PETS0VGC3SF";

  let activeTab = $state<AccountTab>("profile");
  let cancelHelpOpen = $state(false);
  let loading = $state(false);
  let saving = $state(false);
  let saveStatus = $state<"idle" | "saved" | "error">("idle");
  let errorMessage = $state("");
  let syncing = $state(false);
  let syncStatus = $state<"idle" | "synced" | "error">("idle");
  let syncErrorMessage = $state("");

  // Editable profile fields
  let displayName = $state("");
  let region = $state("");
  let country = $state("");
  let discordPresenceEnabled = $state(true);
  let savedDiscordPresenceEnabled = $state(true);

  // Read-only profile data
  let profile = $state<AccountProfile | null>(null);

  $effect(() => {
    if (open) {
      loadProfile();
    } else {
      saveStatus = "idle";
      errorMessage = "";
      syncStatus = "idle";
      syncErrorMessage = "";
      activeTab = "profile";
    }
  });

  // Sync on ready: fetch the full user record from GET /v1/users/me (our DB, includes
  // displayUsername). This is the authoritative source for the form — Better Auth's
  // session does not include custom fields. See session.svelte.ts for the two-source
  // sync strategy.
  async function loadProfile() {
    loading = true;
    try {
      const [profileResult, settingsResult] = await Promise.allSettled([
        fetchAccountProfile(),
        fetchUserSettings(),
      ]);
      if (profileResult.status !== "fulfilled") {
        profile = null;
        return;
      }
      const data = profileResult.value;
      profile = data;
      displayName = data.displayUsername ?? data.name ?? "";
      region = data.region ?? "";
      country = data.country ?? "";
      const settings =
        settingsResult.status === "fulfilled" ? settingsResult.value.gameplaySettings : undefined;
      discordPresenceEnabled = settings?.discordPresenceEnabled ?? true;
      savedDiscordPresenceEnabled = discordPresenceEnabled;
    } catch {
      profile = null;
    } finally {
      loading = false;
    }
  }

  async function handleSave() {
    saving = true;
    saveStatus = "idle";
    errorMessage = "";

    try {
      // Update display name via game profile route (also syncs user.displayUsername)
      const currentDisplayName = profile?.displayUsername ?? profile?.name ?? "";
      if (displayName !== currentDisplayName && activeGameProfileId && displayName.trim()) {
        const nameResult = await updateProfileDisplayName(activeGameProfileId, displayName.trim());
        if (!nameResult.success) {
          saveStatus = "error";
          errorMessage = nameResult.message;
          saving = false;
          return;
        }
        // Sync on save: patch authSession.user immediately so the nav bar (which reads
        // from authSession.user.displayUsername) reflects the new name without waiting
        // for the next fetchSession() round-trip. See session.svelte.ts sync strategy.
        authSession.patchUser({ displayUsername: displayName.trim() });
      }

      // Update region/country via account profile route
      const accountUpdates: Record<string, string> = {};
      if (region !== (profile?.region ?? "")) accountUpdates.region = region;
      if (country !== (profile?.country ?? "")) accountUpdates.country = country;

      if (Object.keys(accountUpdates).length > 0) {
        const result = await updateAccountProfile(accountUpdates);
        if (!result.success) {
          saveStatus = "error";
          errorMessage = m["sim.accountSettings.error.saveFailed"]({});
          saving = false;
          return;
        }
      }

      if (discordPresenceEnabled !== savedDiscordPresenceEnabled) {
        await updateUserSettings({
          gameplaySettings: { discordPresenceEnabled },
        });
        savedDiscordPresenceEnabled = discordPresenceEnabled;
      }

      saveStatus = "saved";
      await authSession.fetchSession();
      await loadProfile();
      setTimeout(() => { if (saveStatus === "saved") saveStatus = "idle"; }, 2000);
    } catch {
      saveStatus = "error";
      errorMessage = m["sim.accountSettings.error.saveFailed"]({});
    }

    saving = false;
  }

  async function handleSyncLegacy() {
    syncing = true;
    syncStatus = "idle";
    syncErrorMessage = "";

    try {
      const result = await syncLegacyAccount("lorcana");
      if (!result.success) {
        syncStatus = "error";
        syncErrorMessage = result.message;
      } else {
        syncStatus = "synced";
        await loadProfile();
        setTimeout(() => { if (syncStatus === "synced") syncStatus = "idle"; }, 2000);
      }
    } catch {
      syncStatus = "error";
      syncErrorMessage = m["sim.accountSettings.error.syncFailed"]({});
    }

    syncing = false;
  }

  function formatDate(isoDate: string): string {
    return new Date(isoDate).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  function getRoleLabel(role: string): string {
    switch (role) {
      case "admin":
        return "Administrator";
      case "moderator":
        return "Moderator";
      case "donor":
        return "Supporter";
      default:
        return "Player";
    }
  }

  function getProviderLabel(providerId: string): string {
    switch (providerId) {
      case "discord":
        return "Discord";
      case "google":
        return "Google";
      default:
        return providerId;
    }
  }
</script>

<Dialog.Root bind:open>
  <Dialog.Portal>
    <Dialog.Overlay class="player-settings-overlay" />
    <Dialog.Content class="player-settings-dialog" showCloseButton={false}>
      <Dialog.Header class="shrink-0 gap-1">
        <Dialog.Title class="text-base font-semibold tracking-tight text-slate-100">
          {m["sim.accountSettings.title"]({})}
        </Dialog.Title>
        <Dialog.Description class="text-sm text-slate-400">
          {m["sim.accountSettings.description"]({})}
        </Dialog.Description>
      </Dialog.Header>

      <div class="player-settings-tabs" role="tablist">
        <button
          type="button"
          role="tab"
          class="player-settings-tab"
          aria-selected={activeTab === "profile"}
          onclick={() => (activeTab = "profile")}
        >
          {m["sim.accountSettings.tab.profile"]({})}
        </button>
        <button
          type="button"
          role="tab"
          class="player-settings-tab"
          aria-selected={activeTab === "account"}
          onclick={() => (activeTab = "account")}
        >
          {m["sim.accountSettings.tab.account"]({})}
        </button>
      </div>

      <div class="player-settings-scroll">
        {#if loading}
          <div class="account-loading">
            <p class="text-sm text-slate-400">Loading...</p>
          </div>
        {:else if !profile}
          <div class="account-loading">
            <p class="text-sm text-slate-400">Failed to load profile.</p>
          </div>
        {:else if activeTab === "profile"}
          <div class="grid gap-4">
            <div class="grid gap-1.5">
              <label
                class="text-xs font-medium uppercase tracking-widest text-slate-400"
                for="account-display-name"
              >
                {m["sim.accountSettings.displayName"]({})}
              </label>
              <input
                id="account-display-name"
                type="text"
                class="account-settings-input"
                bind:value={displayName}
                minlength={1}
                maxlength={50}
              />
            </div>

            <div class="grid gap-1.5">
              <label
                class="text-xs font-medium uppercase tracking-widest text-slate-400"
                for="account-region"
              >
                {m["sim.accountSettings.region"]({})}
              </label>
              <select
                id="account-region"
                class="player-settings-select"
                bind:value={region}
              >
                <option value="">—</option>
                {#each REGIONS as r}
                  <option value={r}>{r}</option>
                {/each}
              </select>
            </div>

            <div class="grid gap-1.5">
              <label
                class="text-xs font-medium uppercase tracking-widest text-slate-400"
                for="account-country"
              >
                {m["sim.accountSettings.country"]({})}
              </label>
              <select
                id="account-country"
                class="player-settings-select"
                bind:value={country}
              >
                <option value="">—</option>
                {#each COUNTRIES as c}
                  <option value={c}>{c}</option>
                {/each}
              </select>
            </div>

            <div class="grid gap-1.5">
              <label class="account-settings-checkbox-row" for="account-discord-presence-toggle">
                <input
                  id="account-discord-presence-toggle"
                  type="checkbox"
                  bind:checked={discordPresenceEnabled}
                />
                <span>{m["sim.accountSettings.discordPresence.label"]({})}</span>
              </label>
              <p class="account-settings-help">
                {m["sim.accountSettings.discordPresence.description"]({})}
              </p>
            </div>

            {#if saveStatus === "error" && errorMessage}
              <p class="text-xs text-red-400">{errorMessage}</p>
            {/if}

            <button
              type="button"
              class="account-save-button"
              onclick={handleSave}
              disabled={saving}
            >
              {#if saving}
                {m["sim.accountSettings.saving"]({})}
              {:else if saveStatus === "saved"}
                {m["sim.accountSettings.saved"]({})}
              {:else}
                {m["sim.accountSettings.save"]({})}
              {/if}
            </button>

            <div class="account-sync-section">
              <p class="account-sync-description">
                {m["sim.accountSettings.syncLegacy.description"]({})}
              </p>
              {#if syncStatus === "error" && syncErrorMessage}
                <p class="text-xs text-red-400">{syncErrorMessage}</p>
              {/if}
              <button
                type="button"
                class="account-sync-button"
                onclick={handleSyncLegacy}
                disabled={syncing}
              >
                {#if syncing}
                  {m["sim.accountSettings.syncLegacy.syncing"]({})}
                {:else if syncStatus === "synced"}
                  {m["sim.accountSettings.syncLegacy.synced"]({})}
                {:else}
                  {m["sim.accountSettings.syncLegacy"]({})}
                {/if}
              </button>
            </div>
          </div>
        {:else if activeTab === "account"}
          <div class="grid gap-4">
            <div class="grid gap-1.5">
              <span class="account-label">{m["sim.accountSettings.displayName"]({})}</span>
              <span class="account-value">{profile.name}</span>
            </div>

            <div class="grid gap-1.5">
              <span class="account-label">{m["sim.accountSettings.username"]({})}</span>
              <span class="account-value">{profile.username ?? "—"}</span>
            </div>

            <div class="grid gap-1.5">
              <span class="account-label">{m["sim.accountSettings.email"]({})}</span>
              <span class="account-value">{profile.email}</span>
            </div>

            <div class="grid gap-1.5">
              <span class="account-label">{m["sim.accountSettings.role"]({})}</span>
              <span class="account-value">
                <span class="account-badge">{getRoleLabel(profile.role)}</span>
              </span>
            </div>

            <div class="grid gap-1.5">
              <span class="account-label">{m["sim.accountSettings.subscriptionTier"]({})}</span>
              <span class="account-value">
                {#if resolvePatronTierConfig(profile.subscriptionTier)}
                  {@const cfg = resolvePatronTierConfig(profile.subscriptionTier)!}
                  <span
                    class="account-patron-badge"
                    style:--patron-color={cfg.color}
                    style:--patron-glow={cfg.glow}
                    style:--patron-border={cfg.borderColor}
                  >
                    <span class="account-patron-icon">
                      {#if cfg.icon === "sparkles"}
                        <Sparkles class="size-3" />
                      {:else if cfg.icon === "gem"}
                        <Gem class="size-3" />
                      {:else if cfg.icon === "shield"}
                        <ShieldCheck class="size-3" />
                      {:else}
                        <Star class="size-3" />
                      {/if}
                    </span>
                    {cfg.name()}
                  </span>
                {:else}
                  <span class="account-badge">{profile.subscriptionTier}</span>
                {/if}
              </span>
            </div>

            <div class="grid gap-1.5">
              <span class="account-label">{m["sim.accountSettings.memberSince"]({})}</span>
              <span class="account-value">{formatDate(profile.createdAt)}</span>
            </div>

            <div class="grid gap-1.5">
              <span class="account-label">{m["sim.accountSettings.linkedAccounts"]({})}</span>
              {#if profile.linkedAccounts.length > 0}
                <div class="account-linked-list">
                  {#each profile.linkedAccounts as account}
                    <span class="account-badge">{getProviderLabel(account.providerId)}</span>
                  {/each}
                </div>
              {:else}
                <span class="account-value text-slate-500">None</span>
              {/if}
            </div>
          </div>
        {/if}

        {#if !loading && profile}
          <div class="cancel-subscription-row">
            <button
              type="button"
              class="cancel-subscription-link"
              onclick={() => (cancelHelpOpen = true)}
            >
              {m["sim.accountSettings.cancelSubscription.link"]({})}
            </button>
          </div>
        {/if}
      </div>

      <Dialog.Footer class="shrink-0">
        <Dialog.Close
          class="player-settings-close"
          aria-label={m["sim.accountSettings.closeAria"]({})}
        >
          {m["sim.settings.close"]({})}
        </Dialog.Close>
      </Dialog.Footer>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>

<Dialog.Root bind:open={cancelHelpOpen}>
  <Dialog.Portal>
    <Dialog.Overlay class="player-settings-overlay" />
    <Dialog.Content class="player-settings-dialog">
      <Dialog.Header class="shrink-0 gap-1">
        <Dialog.Title class="text-base font-semibold tracking-tight text-slate-100">
          {m["sim.accountSettings.cancelSubscription.title"]({})}
        </Dialog.Title>
        <Dialog.Description class="text-sm text-slate-400">
          {m["sim.accountSettings.cancelSubscription.intro"]({})}
        </Dialog.Description>
      </Dialog.Header>

      <div class="player-settings-scroll">
        <div class="grid gap-3">
          <p class="cancel-help-section-title">
            {m["sim.accountSettings.cancelSubscription.stepsTitle"]({})}
          </p>
          <ol class="cancel-help-steps">
            <li>{m["sim.accountSettings.cancelSubscription.step1"]({})}</li>
            <li>{m["sim.accountSettings.cancelSubscription.step2"]({})}</li>
            <li>{m["sim.accountSettings.cancelSubscription.step3"]({})}</li>
            <li>{m["sim.accountSettings.cancelSubscription.step4"]({})}</li>
          </ol>
          <p class="cancel-help-outro">
            {m["sim.accountSettings.cancelSubscription.outro"]({})}
          </p>
          <a
            class="cancel-help-article-link"
            href={KOFI_CANCEL_ARTICLE_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            {m["sim.accountSettings.cancelSubscription.articleLink"]({})}
          </a>
        </div>
      </div>

      <Dialog.Footer class="shrink-0">
        <Dialog.Close
          class="player-settings-close"
          aria-label={m["sim.accountSettings.cancelSubscription.closeAria"]({})}
        >
          {m["sim.settings.close"]({})}
        </Dialog.Close>
      </Dialog.Footer>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>

<style>
  .account-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 120px;
  }

  .account-settings-input {
    width: 100%;
    border-radius: 0.55rem;
    border: 1px solid rgba(108, 145, 192, 0.42);
    background: rgba(14, 25, 40, 0.92);
    color: #e5edf7;
    padding: 0.5rem 0.6rem;
    font-size: 0.92rem;
  }

  .account-settings-input:focus-visible {
    outline: 2px solid rgba(147, 197, 253, 0.5);
    outline-offset: 1px;
    border-color: rgba(147, 197, 253, 0.75);
  }

  .account-save-button {
    border-radius: 0.5rem;
    border: 1px solid rgba(125, 211, 252, 0.5);
    background: rgba(21, 48, 77, 0.8);
    color: #dbeafe;
    padding: 0.5rem 1rem;
    font-size: 0.85rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    cursor: pointer;
    transition: background 0.15s ease, border-color 0.15s ease;
  }

  .account-save-button:hover:not(:disabled),
  .account-save-button:focus-visible:not(:disabled) {
    background: rgba(34, 74, 117, 0.95);
    border-color: rgba(191, 219, 254, 0.82);
    outline: none;
  }

  .account-save-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .account-label {
    font-size: 0.75rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #94a3b8;
  }

  .account-settings-checkbox-row {
    display: flex;
    align-items: center;
    gap: 0.55rem;
    font-size: 0.9rem;
    font-weight: 600;
    color: #e5edf7;
    cursor: pointer;
  }

  .account-settings-checkbox-row input {
    width: 1rem;
    height: 1rem;
    accent-color: #38bdf8;
    flex-shrink: 0;
  }

  .account-settings-help {
    font-size: 0.78rem;
    color: #94a3b8;
  }

  .account-value {
    font-size: 0.92rem;
    color: #e5edf7;
  }

  .account-badge {
    display: inline-block;
    padding: 0.15rem 0.55rem;
    border-radius: 0.35rem;
    background: rgba(21, 48, 77, 0.6);
    border: 1px solid rgba(108, 145, 192, 0.3);
    font-size: 0.78rem;
    font-weight: 600;
    color: #bfdbfe;
    text-transform: capitalize;
  }

  .account-patron-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.2rem 0.6rem 0.2rem 0.45rem;
    border-radius: 0.45rem;
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid var(--patron-border);
    font-size: 0.82rem;
    font-weight: 700;
    color: var(--patron-color);
    box-shadow:
      0 0 6px var(--patron-glow),
      0 0 14px var(--patron-glow),
      inset 0 0 6px rgba(255, 255, 255, 0.04);
    letter-spacing: 0.02em;
  }

  .account-patron-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.1rem;
    height: 1.1rem;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.25);
    border: 1px solid var(--patron-border);
    color: var(--patron-color);
    box-shadow: 0 0 4px var(--patron-glow);
    flex-shrink: 0;
  }

  .account-linked-list {
    display: flex;
    gap: 0.4rem;
    flex-wrap: wrap;
  }

  .account-sync-section {
    display: grid;
    gap: 0.5rem;
    padding-top: 0.75rem;
    border-top: 1px solid rgba(108, 145, 192, 0.2);
  }

  .account-sync-description {
    font-size: 0.78rem;
    color: #94a3b8;
  }

  .account-sync-button {
    border-radius: 0.5rem;
    border: 1px solid rgba(108, 145, 192, 0.35);
    background: rgba(14, 25, 40, 0.6);
    color: #94a3b8;
    padding: 0.45rem 1rem;
    font-size: 0.82rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    cursor: pointer;
    transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease;
  }

  .account-sync-button:hover:not(:disabled),
  .account-sync-button:focus-visible:not(:disabled) {
    background: rgba(21, 48, 77, 0.7);
    border-color: rgba(147, 197, 253, 0.5);
    color: #bfdbfe;
    outline: none;
  }

  .account-sync-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .cancel-subscription-row {
    margin-top: 1rem;
    padding-top: 0.75rem;
    border-top: 1px solid rgba(108, 145, 192, 0.2);
    display: flex;
    justify-content: center;
  }

  .cancel-subscription-link {
    align-self: start;
    margin-top: 0.15rem;
    background: none;
    border: none;
    padding: 0;
    font-size: 0.78rem;
    color: #93c5fd;
    text-decoration: underline;
    text-underline-offset: 2px;
    cursor: pointer;
  }

  .cancel-subscription-link:hover,
  .cancel-subscription-link:focus-visible {
    color: #bfdbfe;
    outline: none;
  }

  .cancel-help-section-title {
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #94a3b8;
  }

  .cancel-help-steps {
    list-style: decimal;
    padding-left: 1.2rem;
    display: grid;
    gap: 0.4rem;
    font-size: 0.9rem;
    color: #e5edf7;
    line-height: 1.45;
  }

  .cancel-help-outro {
    font-size: 0.85rem;
    color: #cbd5f5;
    line-height: 1.5;
  }

  .cancel-help-article-link {
    align-self: start;
    border-radius: 0.5rem;
    border: 1px solid rgba(125, 211, 252, 0.5);
    background: rgba(21, 48, 77, 0.8);
    color: #dbeafe;
    padding: 0.45rem 0.9rem;
    font-size: 0.82rem;
    font-weight: 600;
    text-decoration: none;
    transition: background 0.15s ease, border-color 0.15s ease;
  }

  .cancel-help-article-link:hover,
  .cancel-help-article-link:focus-visible {
    background: rgba(34, 74, 117, 0.95);
    border-color: rgba(191, 219, 254, 0.82);
    outline: none;
  }
</style>
