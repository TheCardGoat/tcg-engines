<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { Badge } from "$lib/design-system/primitives/badge";
  import { Button } from "$lib/design-system/primitives/button";
  import {
    Download,
    Trash2,
    Film,
    Upload,
    ArrowLeft,
    Clock,
    MessageSquare,
    Play,
    Swords,
    Trophy,
    Gamepad2,
  } from "@lucide/svelte";
  import {
    listSavedReplays,
    deleteReplay,
    loadReplayData,
    isReplayStoreAvailable,
    importReplayFromFile,
    migrateReplayMetadata,
    ReplayImportError,
    type SavedReplayMeta,
  } from "@/features/replay/index.js";
  import { downloadReplayZipFromBlob } from "@/features/replay/download-replay.js";
  import { decompressReplayBlob } from "@/features/replay/fetch-replay.js";
  import { getInkSymbolUrl } from "@/features/simulator/model/asset-urls.js";
  import { getMatchmakingLobbyContext } from "$lib/features/matchmaking/ui/useMatchmakingLobbyController.svelte.js";
  import { fetchPostGameRecord } from "$lib/features/simulator/post-game/notes-api.js";
  import { logError } from "$lib/telemetry/logs.js";

  const PAGE_TITLE = "Replays - Lorcana Simulator";

  const controller = getMatchmakingLobbyContext();

  let replays = $state<SavedReplayMeta[]>([]);
  let loading = $state(true);
  let storeAvailable = $state(false);
  let importing = $state(false);
  let importError = $state<string | null>(null);
  let isDragOver = $state(false);
  let fileInputEl = $state<HTMLInputElement | null>(null);
  let notes = $state<Map<string, string>>(new Map());

  const totalSizeBytes = $derived(
    replays.reduce((sum, r) => sum + (r.sizeBytes ?? 0), 0),
  );

  const viewerIds = $derived.by(() => {
    const ids = new Set<string>();
    const user = controller.auth.user;
    if (user) ids.add(user.id);
    for (const profile of controller.playerContext.profiles) {
      ids.add(profile.gameProfileId);
    }
    return ids;
  });

  onMount(async () => {
    storeAvailable = isReplayStoreAvailable();
    if (!storeAvailable) {
      loading = false;
      return;
    }

    try {
      replays = await listSavedReplays();
    } catch (error) {
      console.error("[SavedReplays] Failed to load:", error);
      logError("replay_list_load_failed", {}, error instanceof Error ? error : undefined);
    } finally {
      loading = false;
    }

    // Backfill player names / deck colors for old IndexedDB entries (lazy migration)
    const needsMigration = replays.filter((r) => r.players === undefined);
    if (needsMigration.length > 0) {
      for (const replay of needsMigration) {
        migrateReplayMetadata(replay, decompressReplayBlob)
          .then((enriched) => {
            replays = replays.map((r) => (r.gameId === enriched.gameId ? enriched : r));
          })
          .catch(() => {});
      }
    }

    // Fetch notes in parallel for authenticated users
    if (controller.auth.isAuthenticated && replays.length > 0) {
      for (const replay of replays) {
        fetchPostGameRecord(replay.gameId)
          .then((record) => {
            if (record.note) {
              notes = new Map(notes).set(replay.gameId, record.note);
            }
          })
          .catch(() => {});
      }
    }
  });

  // ---------------------------------------------------------------------------
  // Viewer perspective
  // ---------------------------------------------------------------------------

  interface ViewerPerspective {
    viewerIndex: 0 | 1 | null;
    result: "win" | "loss" | "draw" | "unknown";
    viewerName: string;
    opponentName: string;
    viewerColors: string[];
    opponentColors: string[];
  }

  function getViewerPerspective(replay: SavedReplayMeta): ViewerPerspective {
    const p1Name = replay.players?.[0]?.displayName ?? replay.players?.[0]?.username ?? replay.playerIds[0];
    const p2Name = replay.players?.[1]?.displayName ?? replay.players?.[1]?.username ?? replay.playerIds[1];
    const p1Colors = replay.deckColors?.player1 ?? [];
    const p2Colors = replay.deckColors?.player2 ?? [];

    // Try to identify viewer by matching against known user/profile IDs
    let viewerIndex: 0 | 1 | null = null;
    if (viewerIds.size > 0) {
      if (viewerIds.has(replay.playerIds[0])) viewerIndex = 0;
      else if (viewerIds.has(replay.playerIds[1])) viewerIndex = 1;
    }

    let result: "win" | "loss" | "draw" | "unknown" = "unknown";
    if (viewerIndex !== null && replay.winnerId) {
      const viewerPlayerId = replay.playerIds[viewerIndex];
      result = replay.winnerId === viewerPlayerId ? "win" : "loss";
    } else if (replay.endReason === "draw") {
      result = "draw";
    }

    if (viewerIndex === 0 || viewerIndex === null) {
      return {
        viewerIndex,
        result,
        viewerName: p1Name,
        opponentName: p2Name,
        viewerColors: p1Colors,
        opponentColors: p2Colors,
      };
    }

    return {
      viewerIndex,
      result,
      viewerName: p2Name,
      opponentName: p1Name,
      viewerColors: p2Colors,
      opponentColors: p1Colors,
    };
  }

  // ---------------------------------------------------------------------------
  // Formatting
  // ---------------------------------------------------------------------------

  function formatDuration(ms: number): string {
    const totalSec = Math.floor(ms / 1000);
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  }

  function formatTimeAgo(iso: string): string {
    const diff = Date.now() - new Date(iso).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return "just now";
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" });
  }

  function formatBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  function formatMatchType(type?: string): string | null {
    switch (type) {
      case "ranked": return "Ranked";
      case "casual": return "Casual";
      case "practice_vs_bot": return "Practice";
      case "private": return "Private";
      default: return null;
    }
  }

  function daysUntilExpiry(expiresAt: number): number {
    return Math.max(0, Math.ceil((expiresAt - Date.now()) / (24 * 60 * 60 * 1000)));
  }

  function getResultConfig(result: "win" | "loss" | "draw" | "unknown") {
    switch (result) {
      case "win":
        return { label: "W", class: "bg-emerald-500/20 border-emerald-500/40 text-emerald-300" };
      case "loss":
        return { label: "L", class: "bg-red-500/20 border-red-500/40 text-red-300" };
      case "draw":
        return { label: "D", class: "bg-slate-500/20 border-slate-500/40 text-slate-300" };
      default:
        return { label: "?", class: "bg-slate-500/20 border-slate-500/40 text-slate-300" };
    }
  }

  function getPlayDrawLabel(replay: SavedReplayMeta, viewerIndex: 0 | 1 | null): string | null {
    if (!replay.firstPlayerId || viewerIndex === null) return null;
    const viewerPlayerId = replay.playerIds[viewerIndex];
    return replay.firstPlayerId === viewerPlayerId ? "On the Play" : "On the Draw";
  }

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------

  async function handleDelete(gameId: string): Promise<void> {
    try {
      await deleteReplay(gameId);
      replays = replays.filter((r) => r.gameId !== gameId);
    } catch (error) {
      console.error("[SavedReplays] Failed to delete:", error);
    }
  }

  async function handleDownload(gameId: string): Promise<void> {
    try {
      const blob = await loadReplayData(gameId);
      if (!blob) {
        console.error("[SavedReplays] Replay data not found in IndexedDB");
        return;
      }
      await downloadReplayZipFromBlob(gameId, blob);
    } catch (error) {
      console.error("[SavedReplays] Failed to download:", error);
    }
  }

  async function handleImportFile(file: File): Promise<void> {
    if (importing) return;
    importError = null;
    importing = true;
    try {
      const gameId = await importReplayFromFile(file);
      window.open(`/replay/${gameId}`, "_blank");
    } catch (err) {
      if (err instanceof ReplayImportError) {
        importError = err.message;
        logError("replay_import_failed", { reason: "invalid_replay" }, err);
      } else {
        console.error("[ReplayImport] unexpected error:", err);
        logError("replay_import_failed", { reason: "unexpected_error" }, err instanceof Error ? err : undefined);
        importError = "Failed to import replay.";
      }
    } finally {
      importing = false;
    }
  }

  function onFileInputChange(event: Event): void {
    const input = event.currentTarget as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      void handleImportFile(file);
      input.value = "";
    }
  }

  function onDragEnter(event: DragEvent): void {
    event.preventDefault();
    isDragOver = true;
  }

  function onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  function onDragLeave(event: DragEvent): void {
    const zone = event.currentTarget as HTMLElement;
    if (!zone.contains(event.relatedTarget as Node | null)) {
      isDragOver = false;
    }
  }

  function onDrop(event: DragEvent): void {
    event.preventDefault();
    isDragOver = false;
    const file = event.dataTransfer?.files[0];
    if (file) void handleImportFile(file);
  }
</script>

<svelte:head>
  <title>{PAGE_TITLE}</title>
</svelte:head>

<div class="px-4 sm:px-6 lg:px-8 min-h-0 flex-1 overflow-y-auto">
  <div class="mx-auto max-w-4xl pb-8 pt-2">
    <!-- Header -->
    <div class="mb-4 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          class="text-slate-400 hover:text-slate-200"
          onclick={() => goto("/matchmaking")}
        >
          <ArrowLeft class="size-4" />
        </Button>
        <div>
          <h1 class="text-lg font-semibold tracking-tight text-slate-100">Saved Replays</h1>
          {#if replays.length > 0}
            <p class="text-xs text-slate-400">
              {replays.length} replay{replays.length !== 1 ? "s" : ""} &middot; {formatBytes(totalSizeBytes)} stored
            </p>
          {/if}
        </div>
      </div>

      {#if storeAvailable}
        <div>
          <input
            bind:this={fileInputEl}
            type="file"
            accept=".zip"
            class="hidden"
            onchange={onFileInputChange}
          />
          <Button
            variant="outline"
            size="sm"
            onclick={() => fileInputEl?.click()}
            disabled={importing}
          >
            <Upload class="mr-1.5 size-3.5" />
            {importing ? "Importing..." : "Import replay"}
          </Button>
        </div>
      {/if}
    </div>

    <!-- Import error -->
    {#if importError}
      <div class="mb-4 rounded-md border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-300">
        {importError}
      </div>
    {/if}

    {#if loading}
      <div class="grid place-items-center py-24 text-slate-400">Loading saved replays...</div>
    {:else if !storeAvailable}
      <div class="rounded-xl border border-amber-400/20 bg-slate-950/80 p-6 text-center">
        <h2 class="text-base font-semibold text-slate-100">Storage unavailable</h2>
        <p class="mt-1 text-sm text-slate-300">
          Your browser does not support IndexedDB. Saved replays require IndexedDB to work.
        </p>
      </div>
    {:else}
      <!-- Drag & drop zone -->
      <div
        role="region"
        aria-label="Drop replay file here"
        class="mb-6 rounded-xl border-2 border-dashed px-6 py-8 text-center transition-colors {isDragOver
          ? 'border-indigo-400/70 bg-indigo-400/10'
          : 'border-slate-700/50 bg-slate-950/40 hover:border-slate-600/60'}"
        ondragenter={onDragEnter}
        ondragover={onDragOver}
        ondragleave={onDragLeave}
        ondrop={onDrop}
      >
        <Upload class="mx-auto mb-3 size-8 text-slate-500" />
        <p class="text-sm font-medium text-slate-300">
          Drop a replay <span class="font-mono text-xs text-slate-400">.zip</span> file here
        </p>
        <p class="mt-1 text-xs text-slate-500">
          or use the <button
            class="underline underline-offset-2 hover:text-slate-300"
            onclick={() => fileInputEl?.click()}
          >Import replay</button> button above
        </p>
      </div>

      {#if replays.length === 0}
        <div class="rounded-xl border border-slate-700/50 bg-slate-950/80 p-8 text-center">
          <Film class="mx-auto mb-3 size-10 text-slate-500" />
          <h2 class="text-base font-semibold text-slate-100">No saved replays</h2>
          <p class="mt-1 text-sm text-slate-400">
            Replays can be saved from the post-game summary after completing a match, or imported from a downloaded .zip file.
          </p>
        </div>
      {:else}
        <div class="flex flex-col gap-2">
          {#each replays as replay (replay.gameId)}
            {@const perspective = getViewerPerspective(replay)}
            {@const resultConfig = getResultConfig(perspective.result)}
            {@const matchType = formatMatchType(replay.matchType)}
            {@const playDraw = getPlayDrawLabel(replay, perspective.viewerIndex)}
            {@const note = notes.get(replay.gameId)}
            {@const daysLeft = daysUntilExpiry(replay.expiresAt)}

            <div class="group rounded-xl border border-white/[0.06] bg-white/[0.02] transition-colors hover:bg-white/[0.04]">
              <div class="flex items-start gap-3 px-3 py-3 sm:items-center">
                <!-- Result badge -->
                <div
                  class="flex size-9 shrink-0 items-center justify-center rounded-lg border text-sm font-bold {resultConfig.class}"
                >
                  {resultConfig.label}
                </div>

                <!-- Main content -->
                <div class="min-w-0 flex-1">
                  <!-- Player matchup row -->
                  <div class="flex items-center gap-1.5">
                    {#each perspective.viewerColors as ink}
                      <img src={getInkSymbolUrl(ink)} alt={ink} class="size-4 shrink-0" />
                    {/each}
                    <span class="truncate text-sm font-medium text-slate-200">
                      {perspective.viewerName}
                    </span>
                    <span class="text-xs text-slate-500">vs</span>
                    {#each perspective.opponentColors as ink}
                      <img src={getInkSymbolUrl(ink)} alt={ink} class="size-4 shrink-0" />
                    {/each}
                    <span class="truncate text-sm font-medium text-slate-200">
                      {perspective.opponentName}
                    </span>
                  </div>

                  <!-- Metadata row -->
                  <div class="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-slate-500">
                    {#if matchType}
                      <span class="inline-flex items-center gap-1">
                        {#if replay.matchType === "ranked"}
                          <Trophy class="size-3" />
                        {:else if replay.matchType === "practice_vs_bot"}
                          <Gamepad2 class="size-3" />
                        {:else}
                          <Swords class="size-3" />
                        {/if}
                        {matchType}
                      </span>
                    {/if}
                    {#if replay.durationMs}
                      <span class="inline-flex items-center gap-0.5">
                        <Clock class="size-3" />
                        {formatDuration(replay.durationMs)}
                      </span>
                    {/if}
                    {#if playDraw}
                      <span>{playDraw}</span>
                    {/if}
                    <span>{replay.totalTurns} turns</span>
                    <span>{replay.totalMoves} moves</span>
                  </div>

                  <!-- Note preview -->
                  {#if note}
                    <div class="mt-1.5 flex items-start gap-1.5">
                      <MessageSquare class="mt-0.5 size-3 shrink-0 text-slate-500" />
                      <p class="line-clamp-1 text-xs leading-relaxed text-slate-400">{note}</p>
                    </div>
                  {/if}
                </div>

                <!-- Right side: time + actions -->
                <div class="flex shrink-0 flex-col items-end gap-2">
                  <span class="text-xs text-slate-500">{formatTimeAgo(replay.completedAt)}</span>
                  <div class="flex items-center gap-1.5">
                    <Button
                      variant="outline"
                      size="sm"
                      href={`/replay/${replay.gameId}`}
                      target="_blank"
                      class="h-7 gap-1 px-2 text-xs"
                    >
                      <Play class="size-3" />
                      Watch
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      class="size-7 p-0 text-slate-400 hover:text-slate-200"
                      onclick={() => handleDownload(replay.gameId)}
                    >
                      <Download class="size-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      class="size-7 p-0 text-slate-400 hover:text-rose-300"
                      onclick={() => handleDelete(replay.gameId)}
                    >
                      <Trash2 class="size-3.5" />
                    </Button>
                  </div>
                </div>
              </div>

              <!-- Expiry warning -->
              {#if daysLeft <= 3}
                <div class="border-t border-white/[0.04] px-3 py-1.5 text-[11px] text-amber-400/70">
                  Expires in {daysLeft}d &middot; {formatBytes(replay.sizeBytes)}
                </div>
              {/if}
            </div>
          {/each}
        </div>
      {/if}
    {/if}
  </div>
</div>
