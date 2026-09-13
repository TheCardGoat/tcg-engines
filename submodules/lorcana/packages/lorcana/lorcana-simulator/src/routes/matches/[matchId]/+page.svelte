<script lang="ts">
  import { env } from "$env/dynamic/public";
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "$lib/design-system/primitives/card";
  import { Button } from "$lib/design-system/primitives/button";
  import AntiRamp from "@tcg/shared/ads/AntiRamp";
  import { resolvePlatformMatchmakingReturnUrl } from "$lib/navigation/platform-matchmaking-url.js";

  let { data } = $props();
</script>

<svelte:head>
  <title>Match | Lorcanito</title>
</svelte:head>

<AntiRamp />
<main class="immersive-app-shell grid h-screen place-items-center px-4 text-slate-100">
  <Card class="w-full max-w-md border-rose-400/20 bg-slate-950/88 text-slate-100">
    <CardHeader>
      <CardTitle>Match unavailable</CardTitle>
      <CardDescription class="text-rose-200">{data.error ?? "Match not found."}</CardDescription>
    </CardHeader>
    <CardContent>
      <Button
        onclick={() =>
          window.location.assign(
            resolvePlatformMatchmakingReturnUrl(
              new URL(window.location.href),
              env.PUBLIC_PLATFORM_MATCHMAKING_URL,
            ),
          )}
        >
          Back to matchmaking
        </Button>
    </CardContent>
  </Card>
</main>
