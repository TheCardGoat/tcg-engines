<script lang="ts">
  import { goto } from '$app/navigation';
  import { env } from '$env/dynamic/public';
  import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from '$lib/design-system/primitives/card';
  import { Button } from '$lib/design-system/primitives/button';
  import { onMount, onDestroy } from 'svelte';
  import { immersiveExperience } from '$lib/features/immersive/immersive-state.svelte.js';
  import LocalMatchMode from './modes/LocalMatchMode.svelte';
  import SpectatorMatchMode from './modes/SpectatorMatchMode.svelte';
  import BotMatchMode from './modes/BotMatchMode.svelte';
  import HumanVsHumanMode from './modes/HumanVsHumanMode.svelte';
  import type { GamePageData } from './+page.server.js';
  import AntiRamp from "@tcg/shared/ads/AntiRamp";
  import {
    buildDiscordRichPresenceMatchUrl,
    clearDiscordPlayingGamePresence,
    type DiscordAuthorizationCodeExchange,
    updateDiscordPlayingGamePresence,
  } from "@tcg/shared/discord-rich-presence";
  import { getApiUrl } from "$lib/config/api";

  let { data }: { data: GamePageData } = $props();
  let activePresenceKey: string | null = null;
  let startedAtMs = Date.now();

  function shouldLogSsrPayload(): boolean {
    if (import.meta.env.DEV) return true;

    const publicEnvironment = env.PUBLIC_OTEL_DEPLOYMENT_ENVIRONMENT?.toLowerCase();
    const publicApiUrl = env.PUBLIC_API_URL?.toLowerCase();
    const hostname = window.location.hostname.toLowerCase();
    return (
      publicEnvironment === 'staging' ||
      hostname.includes('staging') ||
      publicApiUrl?.includes('staging') === true
    );
  }

  function logSsrPayloadForDebugging(): void {
    if (!shouldLogSsrPayload()) return;

    const participantVisualSettings =
      data.mode === 'server'
        ? Object.fromEntries(
            data.match.participants.map((participant) => [
              participant.id,
              {
                displayName: participant.displayName,
                userId: participant.userId,
                visualSettings: participant.visualSettings ?? null,
              },
            ]),
          )
        : null;

    console.info('[lorcana-match] SSR payload', {
      mode: data.mode,
      matchId: data.mode === 'server' || data.mode === 'error' ? data.matchId : null,
      gameId: data.mode === 'server' || data.mode === 'error' ? data.gameId : null,
      participantVisualSettings,
      data,
    });
  }

  const exchangeDiscordActivityCode: DiscordAuthorizationCodeExchange = async ({
    clientId,
    code,
  }) => {
    const response = await fetch(getApiUrl("/discord/activity-token"), {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ clientId, code }),
    });
    if (!response.ok) return null;
    const body = (await response.json()) as { accessToken?: string };
    return body.accessToken ?? null;
  };

  $effect(() => {
    if (data.mode !== 'server') {
      return;
    }
    const clientId = env.PUBLIC_DISCORD_ACTIVITY_CLIENT_ID ?? env.PUBLIC_DISCORD_CLIENT_ID;
    if (data.userSettings?.gameplaySettings?.discordPresenceEnabled === false) {
      activePresenceKey = null;
      void clearDiscordPlayingGamePresence({ clientId });
      return;
    }
    const nextPresenceKey = `${data.matchId}:${data.gameId}`;
    if (activePresenceKey !== nextPresenceKey) {
      activePresenceKey = nextPresenceKey;
      startedAtMs = Date.now();
    }
    const matchUrl = buildDiscordRichPresenceMatchUrl(window.location.href);
    void updateDiscordPlayingGamePresence({
      clientId,
      exchangeAuthorizationCode: exchangeDiscordActivityCode,
      gameName: 'Disney Lorcana',
      matchUrl,
      startedAtMs,
    }).then((result) => {
      if (!result.ok && !result.skipped) {
        console.warn(
          '[discord-rich-presence] failed to update Lorcana match presence',
          result.error,
        );
      }
    });
    return () => {
      void clearDiscordPlayingGamePresence({
        clientId,
        exchangeAuthorizationCode: exchangeDiscordActivityCode,
      });
    };
  });

  onMount(() => {
    logSsrPayloadForDebugging();
    const detachImmersive = immersiveExperience.attach();
    immersiveExperience.activateRouteChrome();
    return () => {
      detachImmersive();
      immersiveExperience.deactivateRouteChrome();
    };
  });

  onDestroy(() => {
    immersiveExperience.deactivateRouteChrome();
  });
</script>

<AntiRamp />
<main class="immersive-app-shell relative h-screen min-h-0 text-slate-100">
  {#if data.mode === 'error'}
    <div class="mx-auto flex h-full max-w-3xl items-center justify-center px-4 py-8">
      <Card class="w-full border-rose-400/20 bg-slate-950/88 text-slate-100">
        <CardHeader>
          <CardTitle>Match failed to load</CardTitle>
          <CardDescription class="text-rose-200">{data.message}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onclick={() => goto('/matchmaking')}>Back to matchmaking</Button>
        </CardContent>
      </Card>
    </div>
  {:else if data.mode === 'local'}
    <LocalMatchMode />
  {:else}
    {#key data.gameId}
      {#if data.spectate}
        <SpectatorMatchMode {data} />
      {:else if data.gameSubMode === 'bot'}
        <BotMatchMode {data} />
      {:else}
        <HumanVsHumanMode {data} />
      {/if}
    {/key}
  {/if}
</main>
