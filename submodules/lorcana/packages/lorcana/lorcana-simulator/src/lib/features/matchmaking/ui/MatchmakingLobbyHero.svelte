<script lang="ts">
  import type { AuthUser } from '@tcg/shared/auth';

  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { Button } from '$lib/design-system/primitives/button';
  import * as Tooltip from '$lib/design-system/primitives/tooltip/index.js';
  import { m } from '$lib/i18n/messages.js';
  import { cn } from '$lib/utils.js';
  import ConnectionStatus from '@/features/gateway/ui/ConnectionStatus.svelte';
  import UserProfileMenu from './UserProfileMenu.svelte';
  import type { GatewayClientStore } from '@/features/gateway/gateway-client.svelte.js';
  import type { LobbyLane } from './matchmaking-lobby.constants.js';
  import {
    COMMUNITY_DISCORD_URL,
    ENGINE_REPO_URL,
    HERO_NAV_CAPSULE_CLASS,
    HERO_NAV_DIVIDER_CLASS,
    HERO_NAV_MOBILE_TAB_BTN,
    HERO_NAV_MOBILE_TAB_BTN_ACTIVE,
    HERO_NAV_SEGMENT_BTN,
    EYEBROW_CLASS,
    LORCANA_ENGINE_DISCLAIMER_URL,
  } from './matchmaking-lobby.constants.js';
  import CircleHelp from '@lucide/svelte/icons/circle-help';

  import LogIn from '@lucide/svelte/icons/log-in';
  import Swords from '@lucide/svelte/icons/swords';
  import Activity from '@lucide/svelte/icons/activity';
  import Trophy from '@lucide/svelte/icons/trophy';

  interface Props {
    gateway: GatewayClientStore;
    activeLane: LobbyLane;
    mobileTabsEnabled: boolean;
    hasActiveMatch: boolean;
    selectionDisabled: boolean;
    isAuthenticated: boolean;
    isAuthLoading: boolean;
    user: AuthUser | null;
    onSelectLane: (lane: LobbyLane) => void;
    onResumeMatch: () => void | Promise<void>;
    onOpenSignIn: () => void;
    onSignedOut: () => void;
    onOpenSettings: () => void;
    onOpenAccountSettings: () => void;
  }

  let {
    gateway,
    activeLane,
    mobileTabsEnabled,
    hasActiveMatch,
    selectionDisabled,
    isAuthenticated,
    isAuthLoading,
    user,
    onSelectLane,
    onResumeMatch,
    onOpenSignIn,
    onSignedOut,
    onOpenSettings,
    onOpenAccountSettings,
  }: Props = $props();

  const isDeckVault = $derived(page.url.pathname.includes('/deck-vault'));
  const isMatchHistoryPage = $derived(page.url.pathname.includes('/match-history'));
  const isReplaysPage = $derived(page.url.pathname.includes('/replays'));
  const isSeasonPage = $derived(page.url.pathname.includes('/season'));
  const isMetaPage = $derived(page.url.pathname.includes('/meta-insights'));
  const isLeaderboardPage = $derived(page.url.pathname.includes('/leaderboard'));
  const isLobbyPage = $derived(
    (page.url.pathname === '/matchmaking' ||
      page.url.pathname === '/matchmaking/') &&
      !isMetaPage,
  );

  function handleDeckVaultClick(): void {
    if (isDeckVault) {
      void goto('/matchmaking');
    } else {
      void goto('/matchmaking/deck-vault');
    }
  }
</script>

<section
  class="relative shrink-0 overflow-hidden border-y border-white/10 bg-slate-950 shadow-[0_40px_120px_-60px_rgba(2,6,23,1)] xl:h-[16svh] xl:max-h-[160px] xl:min-h-[120px]"
>
  <div
    class="absolute inset-0 bg-cover bg-center opacity-100"
    style={"background-image: url('/bg/mm-top-backgroud.png')"}
    aria-hidden="true"
  ></div>
  <div
    class="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,6,23,0.92)_0%,rgba(2,6,23,0.74)_42%,rgba(2,6,23,0.82)_100%)]"
    aria-hidden="true"
  ></div>
  <div
    class="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.12),transparent_20%),repeating-linear-gradient(90deg,rgba(255,255,255,0.02)_0,rgba(255,255,255,0.02)_1px,transparent_1px,transparent_17.5%)]"
    aria-hidden="true"
  ></div>

  <div
    class="absolute right-4 top-4 z-10 flex max-w-[calc(100%-2rem)] flex-wrap items-center justify-end gap-3 sm:right-6 sm:max-w-[calc(100%-3rem)] lg:right-8 lg:max-w-[calc(100%-4rem)]"
  >
    <nav
      class="flex min-w-0 flex-row flex-wrap items-center justify-end gap-3"
      aria-label={m['sim.matchmaking.header.mainNavAria']({})}
    >
      <div class={HERO_NAV_CAPSULE_CLASS}>
        <ConnectionStatus embedded {gateway} />
        {#if hasActiveMatch}
          <span class={HERO_NAV_DIVIDER_CLASS} aria-hidden="true"></span>
          <Button
                  variant="ghost"
                  size="sm"
                  class={cn(
              HERO_NAV_SEGMENT_BTN,
              'bg-emerald-500/18 text-emerald-50 hover:bg-emerald-500/28 hover:text-white',
            )}
                  onclick={onResumeMatch}
          >
            <Swords class="mr-2 size-4 shrink-0" aria-hidden="true" />
            {m['sim.matchmaking.activeMatch.nav']({})}
          </Button>
        {/if}
        {#if isAuthenticated}
          <span class={HERO_NAV_DIVIDER_CLASS} aria-hidden="true"></span>
          <Button
            variant="ghost"
            size="sm"
            disabled={selectionDisabled && !isDeckVault}
            class={cn(HERO_NAV_SEGMENT_BTN, isDeckVault && 'bg-white/10')}
            aria-pressed={isDeckVault}
            onclick={handleDeckVaultClick}
          >
            {m['sim.matchmaking.header.utilityDecks']({})}
          </Button>
        {/if}
        <span
          class={cn(HERO_NAV_DIVIDER_CLASS, 'hidden xl:block')}
          aria-hidden="true"
        ></span>
        <Button
          variant="ghost"
          size="sm"
          class={cn(
            HERO_NAV_SEGMENT_BTN,
            'hidden xl:inline-flex',
            isLobbyPage &&
              mobileTabsEnabled &&
              activeLane === 'queue' &&
              'bg-white/10 text-white',
          )}
          aria-pressed={false}
          onclick={() => {
            onSelectLane('queue');
            if (!isLobbyPage) void goto('/matchmaking');
          }}
        >
          {m['sim.matchmaking.header.utilityQueues']({})}
        </Button>
        <span class={HERO_NAV_DIVIDER_CLASS} aria-hidden="true"></span>
        <Button
          variant="ghost"
          size="sm"
          class={cn(
            HERO_NAV_SEGMENT_BTN,
            isLeaderboardPage && 'bg-white/10 text-white',
          )}
          aria-pressed={isLeaderboardPage}
          aria-label={m['sim.matchmaking.header.utilityLeaderboard']({})}
          onclick={() => void goto('/matchmaking/leaderboard')}
        >
          <Trophy class="size-4 shrink-0 opacity-90 sm:mr-2" />
          <span class="hidden sm:inline">
            {m['sim.matchmaking.header.utilityLeaderboard']({})}
          </span>
        </Button>
        <span class={HERO_NAV_DIVIDER_CLASS} aria-hidden="true"></span>
        <Button
          variant="ghost"
          size="sm"
          class={cn(
            HERO_NAV_SEGMENT_BTN,
            isMetaPage && 'bg-white/10 text-white',
          )}
          aria-pressed={isMetaPage}
          onclick={() => void goto('/matchmaking/meta-insights')}
        >
          <Activity class="mr-2 size-4 shrink-0 opacity-90" />
          Meta
        </Button>
        <span class={HERO_NAV_DIVIDER_CLASS} aria-hidden="true"></span>
        <Button
          variant="ghost"
          size="sm"
          class={cn(
            HERO_NAV_SEGMENT_BTN,
            isSeasonPage && 'bg-white/10 text-white',
          )}
          aria-pressed={isSeasonPage}
          onclick={() => void goto('/matchmaking/season/wilds-unknown')}
        >
          Season
        </Button>
        {#if isAuthenticated}
          <span
            class={cn(HERO_NAV_DIVIDER_CLASS)}
            aria-hidden="true"
          ></span>
          <Button
            variant="ghost"
            size="sm"
            class={cn(
              HERO_NAV_SEGMENT_BTN,
              isMatchHistoryPage && 'bg-white/10 text-white',
            )}
            aria-pressed={isMatchHistoryPage}
            onclick={() => void goto('/matchmaking/match-history')}
          >
            {m['sim.matchmaking.header.utilityNotes']({})}
          </Button>
          <span class={HERO_NAV_DIVIDER_CLASS} aria-hidden="true"></span>
          <Button
            variant="ghost"
            size="sm"
            class={cn(
              HERO_NAV_SEGMENT_BTN,
              isReplaysPage && 'bg-white/10 text-white',
            )}
            aria-pressed={isReplaysPage}
            onclick={() => void goto('/matchmaking/replays')}
          >
            {m['sim.matchmaking.header.utilityReplays']({})}
          </Button>
        {/if}

        {#if isAuthenticated && user}
          <span class={HERO_NAV_DIVIDER_CLASS} aria-hidden="true"></span>
          <UserProfileMenu
            {user}
            {onSignedOut}
            {onOpenSettings}
            {onOpenAccountSettings}
            settingsInMenu={true}
          />
        {:else if isAuthLoading}
          <span class={HERO_NAV_DIVIDER_CLASS} aria-hidden="true"></span>
          <span class="flex h-11 items-center px-2">
            <span
              class="size-4 animate-spin rounded-full border-2 border-slate-500 border-t-slate-200"
            ></span>
          </span>
        {:else}
          <span class={HERO_NAV_DIVIDER_CLASS} aria-hidden="true"></span>
          <Button
            variant="ghost"
            size="sm"
            class={HERO_NAV_SEGMENT_BTN}
            onclick={onOpenSignIn}
          >
            <LogIn class="mr-2 size-4 shrink-0 opacity-90" />
            {m['sim.auth.signIn.headerButton']({})}
          </Button>
        {/if}
      </div>

      <div
        class="inline-flex h-11 shrink-0 items-center gap-0.5 rounded-full border border-white/10 bg-black/50 px-1.5 shadow-none backdrop-blur-md"
        aria-label={m['sim.matchmaking.header.socialNavAria']({})}
      >
        <a
          href={COMMUNITY_DISCORD_URL}
          target="_blank"
          rel="noopener noreferrer"
          class="flex size-10 shrink-0 items-center justify-center rounded-full text-slate-100 transition-colors hover:bg-white/10 hover:text-white"
          aria-label={m['sim.matchmaking.header.linkDiscordAria']({})}
        >
          <svg
            class="size-5"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.007-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.074.074 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"
            />
          </svg>
        </a>
        <a
          href={ENGINE_REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
          class="flex size-10 shrink-0 items-center justify-center rounded-full text-slate-100 transition-colors hover:bg-white/10 hover:text-white"
          aria-label={m['sim.matchmaking.header.linkGithubAria']({})}
        >
          <svg
            class="size-5"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
            />
          </svg>
        </a>
      </div>
    </nav>
  </div>

  <div
    class="relative grid items-start justify-items-start gap-3 p-4 lg:grid-cols-[minmax(0,1fr)_20rem] xl:h-full xl:min-h-[14rem] xl:gap-5 xl:px-8 xl:pt-4 xl:pb-6 xl:grid-cols-[minmax(0,1fr)_22rem]"
  >
    <div
      class="flex w-full max-w-3xl flex-col items-start justify-start gap-4 text-center sm:gap-5 lg:flex-row lg:items-center lg:justify-center lg:gap-6"
    >
      <button
        type="button"
        onclick={() => goto('/matchmaking')}
        class="size-12 shrink-0 rounded-2xl shadow-[0_12px_40px_-20px_rgba(0,0,0,0.75)] transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 xl:size-24"
        aria-label="Return to matchmaking"
      >
        <img
          src="/brand/lorcanito-icon.svg"
          width="96"
          height="96"
          alt=""
          class="size-12 rounded-2xl xl:size-24"
          aria-hidden="true"
        />
      </button>
      <div class="flex min-w-0 w-full max-w-2xl flex-col items-start text-left">
        <h1
          class="scroll-m-20 w-full text-2xl font-extrabold tracking-tight text-balance text-white xl:text-5xl"
        >
          {m['sim.matchmaking.header.title']({})}
        </h1>
        <p
          class="w-full text-pretty text-sm leading-6 text-slate-200/88 sm:text-base"
        >
          {m['sim.matchmaking.header.tagline']({})}
          <span class="ms-1.5 inline-block align-middle sm:ms-2">
            <Tooltip.Root delayDuration={200}>
              <Tooltip.Trigger>
                {#snippet child({ props })}
                  <button
                    type="button"
                    class="-my-0.5 inline-flex text-slate-300 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                    aria-label={m['sim.matchmaking.header.disclaimerHintAria'](
                      {},
                    )}
                    {...props}
                  >
                    <CircleHelp
                      class="size-4 shrink-0 opacity-90 sm:size-[1rem]"
                      aria-hidden="true"
                    />
                  </button>
                {/snippet}
              </Tooltip.Trigger>
              <Tooltip.Content
                side="bottom"
                align="center"
                sideOffset={8}
                class="max-w-[min(22rem,calc(100vw-2rem))] border border-white/15 bg-slate-950/98 px-3 py-2.5 text-left text-xs leading-relaxed text-slate-100 shadow-xl data-[side=bottom]:slide-in-from-top-2"
              >
                <p class="text-pretty text-slate-200">
                  {m['sim.matchmaking.header.disclaimerTooltipBody']({})}
                </p>
                <a
                  href={LORCANA_ENGINE_DISCLAIMER_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="mt-2 inline-flex max-w-full break-all text-sm font-medium text-sky-300 underline underline-offset-2 hover:text-sky-200"
                >
                  {m['sim.matchmaking.header.disclaimerTooltipLinkLabel']({})}
                </a>
              </Tooltip.Content>
            </Tooltip.Root>
          </span>
        </p>
      </div>
    </div>
  </div>

  {#if isLobbyPage}
    <div class="relative flex justify-center px-4 pb-4 xl:hidden">
      <div
        class="inline-flex items-center gap-1 rounded-full border border-white/10 bg-black/40 p-1 shadow-none backdrop-blur-md"
        role="tablist"
        aria-label={m['sim.matchmaking.header.mainNavAria']({})}
      >
        <button
          type="button"
          role="tab"
          class={cn(
            HERO_NAV_MOBILE_TAB_BTN,
            activeLane === 'live' && HERO_NAV_MOBILE_TAB_BTN_ACTIVE,
          )}
          aria-selected={activeLane === 'live'}
          onclick={() => onSelectLane('live')}
        >
          {m['sim.matchmaking.liveGames.title']({})}
        </button>
        <button
          type="button"
          role="tab"
          class={cn(
            HERO_NAV_MOBILE_TAB_BTN,
            activeLane === 'queue' && HERO_NAV_MOBILE_TAB_BTN_ACTIVE,
          )}
          aria-selected={activeLane === 'queue'}
          onclick={() => onSelectLane('queue')}
        >
          {m['sim.matchmaking.header.utilityQueues']({})}
        </button>
        <button
          type="button"
          role="tab"
          class={cn(
            HERO_NAV_MOBILE_TAB_BTN,
            activeLane === 'sidebar' && HERO_NAV_MOBILE_TAB_BTN_ACTIVE,
          )}
          aria-selected={activeLane === 'sidebar'}
          onclick={() => onSelectLane('sidebar')}
        >
          {m['sim.matchmaking.right.bulletin.eyebrow']({})}
        </button>
      </div>
    </div>
  {/if}
</section>
