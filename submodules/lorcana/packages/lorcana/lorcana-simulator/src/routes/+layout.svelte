<script lang="ts">
  import '../lib/app.css';
  import { afterNavigate, goto } from '$app/navigation';
  import { page } from '$app/state';
  import { onMount } from 'svelte';
  import { authSession } from '$lib/auth/session.svelte.js';
  import { configureCoreSimulatorLogging } from '$lib/logtape/logger';
  import { HttpRequestError } from '$lib/data/transport/http-client.js';
  import { joinDiscordGuild } from '$lib/features/auth/discord-api.js';
  import {
    deLocalizeUrl,
    locales,
    localizeHref,
  } from '$lib/paraglide/runtime.js';
  import * as Tooltip from '$lib/design-system/primitives/tooltip/index.js';
  import { initAnalytics, trackEvent, trackPageView } from '$lib/analytics/analytics.js';
  import { startVitalsReporting } from '$lib/analytics/vitals.js';
  import { logError, logOperationalEvent } from '$lib/telemetry/logs.js';
  import EuConsentBanner from '$lib/analytics/EuConsentBanner.svelte';
  import {
    QueryClientProvider,
    type QueryClient,
  } from '@tanstack/svelte-query';
  import { createSimulatorQueryClient } from '$lib/data/query-client.js';
  configureCoreSimulatorLogging();

  const DISCORD_JOIN_GUILD_NONCE_KEY = 'discord-join-guild-nonce';

  let { children, data } = $props();
  const queryClient: QueryClient = createSimulatorQueryClient();

  // Hydrate auth session eagerly so SSR renders the authenticated state (not a loading spinner).
  // The $effect.pre re-runs on client-side navigations when layout data changes.
  // svelte-ignore state_referenced_locally
  authSession.hydrateFromServer(data.user ?? null, data.session ?? null);
  // $effect.pre(() => {
  // 	authSession.hydrateFromServer(data.user ?? null, data.session ?? null);
  // });

  onMount(() => {
    initAnalytics({ gdprStrict: data.gdprStrict ?? true });
    startVitalsReporting();

    // Session lifecycle: each session_start is matched with a session_end so
    // counts and durations stay consistent. bfcache transitions are treated
    // as session boundaries — pagehide(persisted) closes the active session
    // and pageshow(persisted) opens a fresh one — so a back/forward
    // navigation produces balanced start/end pairs with accurate per-window
    // duration_seconds (active window only, not wall-clock-since-load).
    let sessionStartedAt = Date.now();
    trackEvent('session_start');
    const emitSessionEnd = () => {
      trackEvent('session_end', {
        duration_seconds: Math.round((Date.now() - sessionStartedAt) / 1000),
      });
    };
    const handlePageHide = (_event: PageTransitionEvent) => {
      // Always close the current session — terminal unload AND bfcache freeze
      // both mean the user has stopped engaging with this view.
      emitSessionEnd();
    };
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        // Restored from bfcache — open a new session window.
        sessionStartedAt = Date.now();
        trackEvent('session_start');
      }
    };
    window.addEventListener('pagehide', handlePageHide);
    window.addEventListener('pageshow', handlePageShow);
    return () => {
      window.removeEventListener('pagehide', handlePageHide);
      window.removeEventListener('pageshow', handlePageShow);
    };
  });

  afterNavigate(({ to }) => {
    if (to?.url) {
      trackPageView(to.url.pathname, deLocalizeUrl);
    }
  });

  onMount(() => {
    const joinGuild = page.url.searchParams.get('join_guild');
    const joinGuildNonce = page.url.searchParams.get('join_guild_nonce');
    if (joinGuild !== 'true') {
      return;
    }

    const cleanUrl = new URL(page.url);
    cleanUrl.searchParams.delete('join_guild');
    cleanUrl.searchParams.delete('join_guild_nonce');
    void goto(cleanUrl.pathname + cleanUrl.search, { replaceState: true });

    const storedJoinGuildNonce = window.sessionStorage.getItem(
      DISCORD_JOIN_GUILD_NONCE_KEY,
    );
    window.sessionStorage.removeItem(DISCORD_JOIN_GUILD_NONCE_KEY);

    if (
      !joinGuildNonce ||
      !storedJoinGuildNonce ||
      joinGuildNonce !== storedJoinGuildNonce
    ) {
      console.warn('Ignoring Discord guild join callback with invalid nonce');
      return;
    }

    void (async () => {
      try {
        await authSession.fetchSession();
        if (!authSession.isAuthenticated) {
          return;
        }

        try {
          await joinDiscordGuild();
        } catch (error) {
          if (error instanceof HttpRequestError) {
            console.error('Failed to join Discord guild:', error.status);
            logOperationalEvent(
              'discord_guild_join_failed',
              { status: error.status },
              'warn',
            );
            return;
          }
          throw error;
        }
      } catch (error) {
        console.error('Error joining Discord guild:', error);
        logError(
          'discord_guild_join_error',
          {},
          error instanceof Error ? error : undefined,
        );
      }
    })();
  });
</script>

<Tooltip.Provider>
  <QueryClientProvider client={queryClient}>
    <div style="display:none">
      {#each locales as locale (locale)}
        <a
          href={localizeHref(page.url.pathname, { locale })}
          data-sveltekit-reload
        >
          {locale}
        </a>
      {/each}
    </div>

    {@render children?.()}
    <EuConsentBanner />
  </QueryClientProvider>
</Tooltip.Provider>
