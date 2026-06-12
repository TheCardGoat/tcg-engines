<script lang="ts">
  import { Button } from "$lib/design-system/primitives/button";
  import { Card, CardContent } from "$lib/design-system/primitives/card";
  import { cn } from "$lib/utils.js";
  import { SURFACE_CARD_CLASS } from "./matchmaking-lobby.constants.js";
  import type { LobbyRoomStatus, LobbyMode } from "@/features/matchmaking/state/lobby-room.svelte.js";
  import Copy from "@lucide/svelte/icons/copy";
  import Check from "@lucide/svelte/icons/check";
  import Loader from "@lucide/svelte/icons/loader-circle";
  import Users from "@lucide/svelte/icons/users";
  import Play from "@lucide/svelte/icons/play";
  import X from "@lucide/svelte/icons/x";
  import LogOut from "@lucide/svelte/icons/log-out";
  import ArrowLeft from "@lucide/svelte/icons/arrow-left";

  interface Props {
    status: LobbyRoomStatus;
    roomCode: string | null;
    creatorName: string | null;
    creatorDeckName: string | null;
    opponentName: string | null;
    opponentDeckName: string | null;
    isCreator: boolean;
    selectedMode: LobbyMode;
    error: string | null;
    onCancel: () => void;
    onStart: () => void;
    onLeave: () => void;
    onBack: () => void;
  }

  let {
    status,
    roomCode,
    creatorName,
    creatorDeckName,
    opponentName,
    opponentDeckName,
    isCreator,
    selectedMode,
    error,
    onCancel,
    onStart,
    onLeave,
    onBack,
  }: Props = $props();

  let codeCopied = $state(false);

  const opponentJoined = $derived(
    status === "opponent_joined" || status === "starting",
  );

  const bestOfLabel = $derived(
    selectedMode === "1" ? "Best of 1" : "Best of 3",
  );

  async function copyRoomCode() {
    if (!roomCode) return;
    try {
      await navigator.clipboard.writeText(roomCode);
      codeCopied = true;
      setTimeout(() => (codeCopied = false), 2000);
    } catch {
      // clipboard not available
    }
  }
</script>

<div class="flex min-h-0 flex-1 items-start justify-center px-4 py-8 sm:px-6 lg:px-8">
  <Card class={cn(SURFACE_CARD_CLASS, "w-full max-w-lg")}>
    <CardContent class="space-y-6 pt-6">
      <!-- Header -->
      <div class="flex items-center gap-3">
        <button
          type="button"
          onclick={onBack}
          class="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
          aria-label="Back to lobby"
        >
          <ArrowLeft class="size-5" />
        </button>
        <div class="flex items-center gap-2">
          <Users class="size-5 text-slate-200" aria-hidden="true" />
          <h2 class="text-lg font-semibold tracking-tight text-white">
            Game Setup
          </h2>
        </div>
        <span class="rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-medium text-slate-300">
          {bestOfLabel}
        </span>
      </div>

      <!-- Room Code -->
      {#if roomCode}
        <div class="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
          <p class="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-500">
            Room Code
          </p>
          <div class="flex items-center justify-between">
            <span class="font-mono text-xl font-bold tracking-[0.3em] text-white">
              {roomCode}
            </span>
            <button
              type="button"
              onclick={copyRoomCode}
              class="rounded-lg p-2 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Copy room code"
            >
              {#if codeCopied}
                <Check class="size-4 text-emerald-400" />
              {:else}
                <Copy class="size-4" />
              {/if}
            </button>
          </div>
        </div>
      {/if}

      <!-- Player Seats -->
      <div class="grid grid-cols-2 gap-3">
        <!-- Seat 1: Creator -->
        <div class="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-4">
          <p class="mb-2 text-center text-sm font-semibold text-emerald-400">
            {creatorName ?? "Host"}{isCreator ? " (You)" : ""}
          </p>
          {#if creatorDeckName}
            <p class="text-center text-xs text-slate-400">
              Deck
            </p>
            <p class="mt-0.5 text-center text-xs font-medium text-slate-200">
              {creatorDeckName}
            </p>
          {/if}
        </div>

        <!-- Seat 2: Opponent -->
        <div class={cn(
          "rounded-xl border px-4 py-4",
          opponentJoined
            ? "border-white/10 bg-white/[0.03]"
            : "border-dashed border-white/10 bg-white/[0.02]"
        )}>
          {#if opponentJoined}
            <p class="mb-2 text-center text-sm font-semibold text-sky-400">
              {opponentName ?? "Opponent"}{!isCreator ? " (You)" : ""}
            </p>
            {#if opponentDeckName}
              <p class="text-center text-xs text-slate-400">
                Deck
              </p>
              <p class="mt-0.5 text-center text-xs font-medium text-slate-200">
                {opponentDeckName}
              </p>
            {/if}
            {#if !opponentDeckName}
              <p class="text-center text-xs text-slate-400">
                Ready
              </p>
            {/if}
          {:else if status === "joined_waiting"}
            <p class="mb-2 text-center text-sm font-semibold text-sky-400">
              {opponentName ?? "You"}{!isCreator ? " (You)" : ""}
            </p>
            {#if opponentDeckName}
              <p class="text-center text-xs text-slate-400">
                Deck
              </p>
              <p class="mt-0.5 text-center text-xs font-medium text-slate-200">
                {opponentDeckName}
              </p>
            {/if}
            {#if !opponentDeckName}
              <p class="flex items-center justify-center gap-1.5 text-xs text-slate-400">
                <Loader class="size-3 animate-spin" />
                Waiting for host...
              </p>
            {/if}
          {:else}
            <p class="mb-2 text-center text-sm font-medium text-slate-500">
              Waiting for opponent...
            </p>
            <div class="flex justify-center">
              <Loader class="size-4 animate-spin text-slate-500" />
            </div>
          {/if}
        </div>
      </div>

      <!-- Share prompt -->
      {#if isCreator && !opponentJoined}
        <p class="text-center text-xs text-slate-500">
          Share the room code to invite an opponent
        </p>
      {/if}

      <!-- Error -->
      {#if error}
        <div
          class="rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm leading-6 text-rose-200"
          role="alert"
        >
          {error}
        </div>
      {/if}

      <!-- Actions -->
      <div class="flex gap-3">
        {#if isCreator}
          <Button
            variant="outline"
            class="h-10 flex-1 border-white/10 bg-transparent text-slate-300 hover:bg-white/5 hover:text-white"
            onclick={onCancel}
          >
            <X class="mr-1.5 size-4" />
            Cancel Game
          </Button>

          {#if opponentJoined}
            <Button
              class="h-10 flex-1"
              disabled={status === "starting"}
              onclick={onStart}
            >
              {#if status === "starting"}
                <Loader class="mr-2 size-4 animate-spin" />
                Starting...
              {:else}
                <Play class="mr-1.5 size-4" />
                Start Game
              {/if}
            </Button>
          {/if}
        {:else}
          <Button
            variant="outline"
            class="h-10 flex-1 border-white/10 bg-transparent text-slate-300 hover:bg-white/5 hover:text-white"
            onclick={onLeave}
          >
            <LogOut class="mr-1.5 size-4" />
            Leave Room
          </Button>
        {/if}
      </div>
    </CardContent>
  </Card>
</div>
