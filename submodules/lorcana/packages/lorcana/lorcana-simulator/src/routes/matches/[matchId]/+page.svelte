<script lang="ts">
  import { goto } from "$app/navigation";
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "$lib/design-system/primitives/card";
  import { Button } from "$lib/design-system/primitives/button";
  import AntiRamp from "@tcg/shared/ads/AntiRamp";

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
      <Button onclick={() => goto("/matchmaking")}>Back to matchmaking</Button>
    </CardContent>
  </Card>
</main>
