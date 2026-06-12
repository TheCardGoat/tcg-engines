<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { Button } from "$lib/design-system/primitives/button";
  import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "$lib/design-system/primitives/card";
  import { LorcanaTabletopSimulator } from "$lib";
  import {
    loadReplayBlobForPlayback,
  } from "@/features/replay/index.js";
  import {
    buildForkedReplayPlayerMetadataMap,
    decompressReplayBlob,
  } from "@/features/replay/fetch-replay.js";
  import { ReplayOrchestrator } from "@/features/replay/replay-orchestrator.svelte.js";
  import { forkReplayToLocalGame, type ForkReplayResult } from "@/features/replay/replay-fork.js";
  import type { PlayerMatchMetadata } from "@/features/simulator/model/player-match-metadata.js";
  import { createHumanVsAiContext } from "@/features/simulator-devtools/vs-ai/context.js";
  import { trackEvent } from "$lib/analytics/analytics.js";
  import { logError } from "$lib/telemetry/logs.js";
  import { GitFork } from "@lucide/svelte";

  let { data } = $props();

  let forkResult = $state<ForkReplayResult | null>(null);
  let loading = $state(true);
  let loadError = $state<string | null>(null);
  let playerMetadataMap = $state<Record<string, PlayerMatchMetadata>>({});

  // Initialize AI context at component init (required by Svelte setContext timing).
  const aiContextStore = createHumanVsAiContext(null);

  // Scoped read model for the forked game (same pattern as HumanVsAiMatchPage).
  const forkedReadModel = $derived.by(() => {
    if (!forkResult) return undefined;
    const orch = forkResult.orchestrator;
    return {
      getMoveLog: (limit?: number) =>
        orch.readModel.getMoveLog(limit, orch.state.currentPerspective),
      subscribeStateUpdates:
        "subscribeStateUpdates" in orch.readModel
          ? orch.readModel.subscribeStateUpdates?.bind(orch.readModel)
          : undefined,
    };
  });

  onMount(async () => {
    try {
      const { blob } = await loadReplayBlobForPlayback(data.gameId);
      const replayData = await decompressReplayBlob(blob);
      const replayOrchestrator = new ReplayOrchestrator(replayData);

      const step = Math.min(data.forkStep, replayOrchestrator.totalSteps - 1);
      const state = replayOrchestrator.getStateAtStep(step);
      if (!state) {
        loadError = `Could not reconstruct game state at step ${step}.`;
        loading = false;
        replayOrchestrator.dispose();
        return;
      }

      trackEvent("replay_fork", { step, humanSide: data.humanSide });

      const result = forkReplayToLocalGame({
        state,
        cardsMaps: replayOrchestrator.cardsMaps,
        replayPlayerIds: replayOrchestrator.playerIds,
        humanSide: data.humanSide,
      });

      forkResult = result;
      playerMetadataMap = buildForkedReplayPlayerMetadataMap(
        replayOrchestrator.metadata,
        data.humanSide,
      );
      aiContextStore.set(result.orchestrator);

      // The replay orchestrator is no longer needed — the fork owns the game now.
      replayOrchestrator.dispose();
    } catch (error) {
      loadError = error instanceof Error ? error.message : "Failed to fork replay.";
      console.error("[ReplayFork] Failed:", error);
      logError(
        "replay_fork_failed",
        { step: data.forkStep },
        error instanceof Error ? error : undefined,
      );
    } finally {
      loading = false;
    }
  });

  onDestroy(() => {
    forkResult?.dispose();
  });

  function handleBackToReplay(): void {
    if (window.opener) {
      window.close();
    } else {
      window.location.href = `/replay/${data.gameId}`;
    }
  }
</script>

<main class="relative min-h-screen text-slate-100">
  {#if loading}
    <div class="grid min-h-screen place-items-center px-4 text-slate-400">
      <div class="flex flex-col items-center gap-3">
        <GitFork class="size-6 animate-pulse text-amber-400" />
        <span>Forking replay at step {data.forkStep}...</span>
      </div>
    </div>
  {:else if loadError}
    <div class="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-4 py-8">
      <Card class="w-full border-rose-400/20 bg-slate-950/88 text-slate-100">
        <CardHeader>
          <CardTitle>Fork unavailable</CardTitle>
          <CardDescription class="text-rose-200">{loadError}</CardDescription>
        </CardHeader>
        <CardContent class="flex gap-2">
          <Button onclick={handleBackToReplay}>Close</Button>
          <Button variant="outline" onclick={() => window.location.href = `/replay/${data.gameId}`}>
            Open Replay
          </Button>
        </CardContent>
      </Card>
    </div>
  {:else if forkResult}
    {@const fork = forkResult}

    {#snippet forkControls()}
      <div class="flex items-center justify-center gap-2">
        <div class="rounded-full border border-amber-400/20 bg-slate-950/80 px-3 py-1.5 backdrop-blur-md">
          <span class="text-xs text-amber-400/80">
            <GitFork class="mb-0.5 inline size-3" />
            Forked at step {data.forkStep}
          </span>
        </div>
      </div>
    {/snippet}

    {#key fork.orchestrator.sessionRevision}
      <LorcanaTabletopSimulator
        engine={fork.orchestrator.currentEngine}
        readModel={forkedReadModel}
        {playerMetadataMap}
        boardOverlay={forkControls}
      />
    {/key}
  {/if}
</main>
