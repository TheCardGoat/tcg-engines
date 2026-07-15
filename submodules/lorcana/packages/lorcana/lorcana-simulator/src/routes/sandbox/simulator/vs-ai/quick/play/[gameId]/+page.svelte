<script lang="ts">
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import { toast } from "svelte-sonner";
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "$lib/design-system/primitives/card";
  import { Button } from "$lib/design-system/primitives/button";
  import { savePracticeSession } from "@/features/practice-match/practice-match-storage.js";
  import type { QuickMatchPlayByIdData } from "./+page.server.js";

  let { data }: { data: QuickMatchPlayByIdData } = $props();

  onMount(() => {
    if (data.status !== "ok") return;

    if (data.unknownCards.length > 0) {
      toast.warning("Some cards were not recognized and were skipped", {
        description: data.unknownCards.join(", "),
        duration: 8000,
      });
    }

    // Save session to localStorage so /match/[gameId] can pick it up
    savePracticeSession(data.session);

    // Navigate to the server-synced match page (gateway + spectator support)
    void goto(`/match/${data.session.gameId}`, { replaceState: true });
  });
</script>

{#if data.status === "error"}
  <div class="grid h-full place-items-center p-8">
    <Card class="w-full max-w-md border-rose-400/20 bg-slate-950/88 text-slate-100">
      <CardHeader>
        <CardTitle>Match unavailable</CardTitle>
        <CardDescription class="text-rose-200">{data.message}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button onclick={() => goto("/sandbox/simulator/vs-ai")}>Back to setup</Button>
      </CardContent>
    </Card>
  </div>
{:else}
  <div class="grid h-full place-items-center p-8">
    <Card class="w-full max-w-sm border-slate-700/50 bg-slate-950/88 text-slate-100">
      <CardContent class="flex flex-col items-center gap-3 py-8">
        <div class="h-6 w-6 animate-spin rounded-full border-2 border-slate-500 border-t-amber-400"></div>
        <p class="text-sm text-slate-400">Connecting to match...</p>
      </CardContent>
    </Card>
  </div>
{/if}
