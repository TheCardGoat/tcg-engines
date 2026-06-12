<script lang="ts">
  import { goto } from "$app/navigation";
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
    buildReplayPlayerMetadataMap,
    decompressReplayBlob,
    getReplayPlayerLabel,
  } from "@/features/replay/fetch-replay.js";
  import { ReplayOrchestrator } from "@/features/replay/replay-orchestrator.svelte.js";
  import ReplayForkPlayerPicker from "@/features/replay/ReplayForkPlayerPicker.svelte";
  import { trackEvent } from "$lib/analytics/analytics.js";
  import { logError } from "$lib/telemetry/logs.js";
  import {
    ArrowLeft,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    GitFork,
    NotebookPen,
    SkipBack,
    SkipForward,
    Play,
    Pause,
  } from "@lucide/svelte";
  import { authSession } from "$lib/auth/session.svelte.js";
  import ReplayNotesPanel from "@/features/replay/ReplayNotesPanel.svelte";

  let { data } = $props();

  let orchestrator = $state<ReplayOrchestrator | null>(null);
  let loading = $state(true);
  let loadError = $state<string | null>(null);
  let showPlayerPicker = $state(false);
  let notesOpen = $state(false);

  const isAuthenticated = $derived(authSession.isAuthenticated);
  const playerMetadataMap = $derived.by(() =>
    orchestrator
      ? buildReplayPlayerMetadataMap(orchestrator.playerIds, orchestrator.metadata)
      : {},
  );

  const replayOwnerSide = $derived.by((): "playerOne" | "playerTwo" | null => {
    if (!orchestrator) return null;
    const userId = authSession.user?.id;
    if (!userId) return null;
    const [p1Id, p2Id] = orchestrator.playerIds;
    if (userId === p1Id) return "playerOne";
    if (userId === p2Id) return "playerTwo";
    return null;
  });

  const SPEEDS = [
    { label: "0.5×", ms: 1600 },
    { label: "1×", ms: 800 },
    { label: "2×", ms: 400 },
    { label: "4×", ms: 150 },
  ] as const;

  let speedIndex = $state(1); // default 1× (800ms)

  function cycleSpeed(): void {
    speedIndex = (speedIndex + 1) % SPEEDS.length;
    orchestrator?.setSpeed(SPEEDS[speedIndex]?.ms ?? 800);
  }

  // --- Fork helpers ---

  function getPlayerLabel(side: "playerOne" | "playerTwo"): string {
    return getReplayPlayerLabel(
      orchestrator?.metadata,
      side,
      side === "playerOne" ? "Player 1" : "Player 2",
    );
  }

  function getActivePlayerSide(): "playerOne" | "playerTwo" | undefined {
    if (!orchestrator) return undefined;
    const state = orchestrator.getStateAtStep(orchestrator.currentStep);
    if (!state) return undefined;
    const currentPlayer = (state.ctx as Record<string, unknown>).currentPlayer as string | undefined;
    if (!currentPlayer) return undefined;
    const [p1, p2] = orchestrator.playerIds;
    if (currentPlayer === p1) return "playerOne";
    if (currentPlayer === p2) return "playerTwo";
    return undefined;
  }

  function handleForkRequest(): void {
    if (!orchestrator) return;
    orchestrator.pause();
    showPlayerPicker = true;
  }

  function handleFork(humanSide: "playerOne" | "playerTwo"): void {
    if (!orchestrator) return;
    showPlayerPicker = false;

    const step = orchestrator.currentStep;
    const url = `/replay/${encodeURIComponent(data.gameId)}/fork?step=${step}&side=${humanSide}`;
    window.open(url, "_blank");
  }

  onMount(async () => {
    trackEvent("replay_view");

    try {
      console.log("[ReplayPage] loading gameId:", data.gameId);

      const { blob, source } = await loadReplayBlobForPlayback(data.gameId);
      console.log("[ReplayPage] replay blob loaded", {
        source,
        bytes: blob.byteLength,
      });

      const replayData = await decompressReplayBlob(blob);
      console.log("[ReplayPage] decompressed replay", {
        gameId: replayData.gameId,
        playerIds: replayData.playerIds,
        stepsCount: replayData.steps.length,
        hasInitialState: !!replayData.initialState,
        initialStateSnippet: replayData.initialState?.slice(0, 80),
      });

      orchestrator = new ReplayOrchestrator(replayData);
      console.log("[ReplayPage] orchestrator ready", {
        hasPatchData: orchestrator.hasPatchData,
        totalSteps: orchestrator.totalSteps,
      });

      if (data.initialStep != null && orchestrator.hasPatchData) {
        orchestrator.goToStep(data.initialStep);
      }
    } catch (error) {
      loadError = error instanceof Error ? error.message : "Failed to load replay.";
      console.error("[ReplayPage] Failed to load replay:", error);
      logError("replay_load_failed", {}, error instanceof Error ? error : undefined);
    } finally {
      loading = false;
    }
  });

  onDestroy(() => {
    orchestrator?.dispose();
  });

  $effect(() => {
    if (!orchestrator || !orchestrator.hasPatchData) return;
    const step = orchestrator.currentStep;
    const url = new URL(window.location.href);
    if (step === 0) {
      url.searchParams.delete("step");
    } else {
      url.searchParams.set("step", String(step));
    }
    const newUrl = step === 0 ? url.pathname : `${url.pathname}?step=${step}`;
    window.history.replaceState({}, "", newUrl);
  });
</script>

<main class="relative min-h-screen text-slate-100">
  {#if loading}
    <div class="grid min-h-screen place-items-center px-4 text-slate-400">
      Loading replay...
    </div>
  {:else if loadError}
    <div class="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-4 py-8">
      <Card class="w-full border-rose-400/20 bg-slate-950/88 text-slate-100">
        <CardHeader>
          <CardTitle>Replay unavailable</CardTitle>
          <CardDescription class="text-rose-200">{loadError}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onclick={() => goto("/matchmaking/replays")}>Back to replays</Button>
        </CardContent>
      </Card>
    </div>
  {:else if orchestrator}
    {@const orch = orchestrator}
    {#snippet replayControls()}
      <div class="flex items-center justify-center gap-2">
        <!-- Back -->
        <Button
          variant="ghost"
          size="sm"
          class="size-8 shrink-0 rounded-full border border-white/10 bg-slate-950/80 p-0 text-slate-300 backdrop-blur-md hover:text-slate-100"
          onclick={() => goto("/matchmaking/replays")}
          title="Back to replays"
        >
          <ArrowLeft class="size-4" />
        </Button>

        <!-- Main controls pill — always visible, disabled when no patch data -->
        <div class="flex items-center gap-0.5 rounded-full border border-white/10 bg-slate-950/85 px-1.5 py-1 backdrop-blur-md">
          <!-- Go to start -->
          <Button
            variant="ghost"
            size="sm"
            class="size-7 rounded-full p-0 text-slate-400 hover:text-slate-100 disabled:opacity-25"
            disabled={!orch.hasPatchData || orch.currentStep === 0}
            onclick={() => orch.goToStep(0)}
            title="Go to start"
          >
            <SkipBack class="size-3.5" />
          </Button>

          <!-- Prev turn -->
          <Button
            variant="ghost"
            size="sm"
            class="size-7 rounded-full p-0 text-slate-400 hover:text-slate-100 disabled:opacity-25"
            disabled={!orch.hasPatchData || orch.currentStep === 0}
            onclick={() => orch.prevTurn()}
            title="Previous turn"
          >
            <ChevronsLeft class="size-3.5" />
          </Button>

          <!-- Prev move -->
          <Button
            variant="ghost"
            size="sm"
            class="size-7 rounded-full p-0 text-slate-400 hover:text-slate-100 disabled:opacity-25"
            disabled={!orch.hasPatchData || orch.currentStep === 0}
            onclick={() => orch.prevStep()}
            title="Previous move"
          >
            <ChevronLeft class="size-3.5" />
          </Button>

          <!-- Play / Pause -->
          <Button
            variant="ghost"
            size="sm"
            class="size-8 rounded-full p-0 text-slate-100 hover:text-white disabled:opacity-25"
            disabled={!orch.hasPatchData}
            onclick={() => orch.togglePlay()}
            title={orch.isPlaying ? "Pause" : "Play"}
          >
            {#if orch.isPlaying}
              <Pause class="size-4" />
            {:else}
              <Play class="size-4" />
            {/if}
          </Button>

          <!-- Next move -->
          <Button
            variant="ghost"
            size="sm"
            class="size-7 rounded-full p-0 text-slate-400 hover:text-slate-100 disabled:opacity-25"
            disabled={!orch.hasPatchData || orch.currentStep === orch.totalSteps - 1}
            onclick={() => orch.nextStep()}
            title="Next move"
          >
            <ChevronRight class="size-3.5" />
          </Button>

          <!-- Next turn -->
          <Button
            variant="ghost"
            size="sm"
            class="size-7 rounded-full p-0 text-slate-400 hover:text-slate-100 disabled:opacity-25"
            disabled={!orch.hasPatchData || orch.currentStep === orch.totalSteps - 1}
            onclick={() => orch.nextTurn()}
            title="Next turn"
          >
            <ChevronsRight class="size-3.5" />
          </Button>

          <!-- Go to end -->
          <Button
            variant="ghost"
            size="sm"
            class="size-7 rounded-full p-0 text-slate-400 hover:text-slate-100 disabled:opacity-25"
            disabled={!orch.hasPatchData || orch.currentStep === orch.totalSteps - 1}
            onclick={() => orch.goToStep(orch.totalSteps - 1)}
            title="Go to end"
          >
            <SkipForward class="size-3.5" />
          </Button>
        </div>

        <!-- Position indicator / no-patch notice -->
        <div class="rounded-full border border-white/10 bg-slate-950/80 px-3 py-1.5 backdrop-blur-md">
          {#if orch.hasPatchData}
            <span class="text-xs tabular-nums text-slate-300">
              {#if orch.currentTurn > 0}
                T{orch.currentTurn}<span class="mx-1 text-slate-600">·</span>
              {/if}
              <span class="text-slate-400">{orch.currentStep}</span><span class="text-slate-600">/</span><span class="text-slate-500">{orch.totalSteps - 1}</span>
            </span>
          {:else}
            <span class="text-xs text-slate-500">Step-through not available for practice replays</span>
          {/if}
        </div>

        <!-- Speed control (only useful when patch data exists) -->
        {#if orch.hasPatchData}
          <Button
            variant="ghost"
            size="sm"
            class="rounded-full border border-white/10 bg-slate-950/80 px-3 py-1.5 text-xs font-medium tabular-nums text-slate-300 backdrop-blur-md hover:text-slate-100"
            onclick={cycleSpeed}
            title="Change playback speed"
          >
            {SPEEDS[speedIndex]?.label ?? "1×"}
          </Button>
        {/if}

        <!-- Play from Here (fork) button -->
        {#if orch.hasPatchData}
          <Button
            variant="ghost"
            size="sm"
            class="flex items-center gap-1.5 rounded-full border border-amber-400/20 bg-slate-950/80 px-3 py-1.5 text-xs font-medium text-amber-400/90 backdrop-blur-md hover:border-amber-400/40 hover:text-amber-300"
            disabled={orch.isAtEnd}
            onclick={handleForkRequest}
            title="Play from this position against the AI (opens new tab)"
          >
            <GitFork class="size-3.5" />
            Play from Here
          </Button>
        {/if}

        <!-- Notes button -->
        <Button
          variant="ghost"
          size="sm"
          class="flex items-center gap-1.5 rounded-full border border-white/10 bg-slate-950/80 px-3 py-1.5 text-xs font-medium text-slate-300 backdrop-blur-md hover:text-slate-100"
          onclick={() => { notesOpen = true; }}
          title="Open match notes"
        >
          <NotebookPen class="size-3.5" />
          Notes
        </Button>
      </div>
    {/snippet}

    <LorcanaTabletopSimulator
      engine={orch.currentEngine}
      readModel={orch.readModel}
      {playerMetadataMap}
      viewerMode="spectator"
      ownerSide={replayOwnerSide}
      boardOverlay={replayControls}
    />

    <!-- Player picker dialog -->
    <ReplayForkPlayerPicker
      bind:open={showPlayerPicker}
      player1Label={getPlayerLabel("playerOne")}
      player2Label={getPlayerLabel("playerTwo")}
      activePlayerSide={getActivePlayerSide()}
      onfork={handleFork}
      oncancel={() => { showPlayerPicker = false; }}
    />

    <!-- Notes panel -->
    <ReplayNotesPanel
      gameId={data.gameId}
      {isAuthenticated}
      bind:open={notesOpen}
    />
  {/if}
</main>
