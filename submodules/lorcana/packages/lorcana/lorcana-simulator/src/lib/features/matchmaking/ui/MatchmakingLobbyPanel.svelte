<script lang="ts">
  import { Button } from '$lib/design-system/primitives/button';
  import { Input } from '$lib/design-system/primitives/input';
  import { Select } from '$lib/design-system/primitives/select';
  import { m } from '$lib/i18n/messages.js';
  import type {
    LobbyRoomStatus,
    LobbyMode,
  } from '@/features/matchmaking/state/lobby-room.svelte.js';
  import Copy from '@lucide/svelte/icons/copy';
  import Loader from '@lucide/svelte/icons/loader-circle';
  import Swords from '@lucide/svelte/icons/swords';
  import X from '@lucide/svelte/icons/x';

  interface Props {
    isAuthenticated: boolean;
    hasSelectedDeck: boolean;
    lobbyStatus: LobbyRoomStatus;
    lobbyRoomCode: string | null;
    lobbyError: string | null;
    lobbyExistingRoomCode: string | null;
    lobbySelectedMode: LobbyMode;
    lobbyActiveMatchId: string | null;
    forfeiting: boolean;
    onCreateRoom: () => void | Promise<void>;
    onJoinRoom: (roomCode: string) => void | Promise<void>;
    onCancelRoom: () => void | Promise<void>;
    onRejoinExistingRoom: () => void | Promise<void>;
    onCancelExistingRoom: () => void | Promise<void>;
    onLobbyModeChange: (mode: LobbyMode) => void;
    onRejoinMatch: () => void | Promise<void>;
    onForfeitMatch: () => void | Promise<void>;
  }

  let {
    isAuthenticated,
    hasSelectedDeck,
    lobbyStatus,
    lobbyRoomCode,
    lobbyError,
    lobbyExistingRoomCode,
    lobbySelectedMode,
    lobbyActiveMatchId,
    forfeiting,
    onCreateRoom,
    onJoinRoom,
    onCancelRoom,
    onRejoinExistingRoom,
    onCancelExistingRoom,
    onLobbyModeChange,
    onRejoinMatch,
    onForfeitMatch,
  }: Props = $props();

  let joinRoomCode = $state('');
  let codeCopied = $state(false);
  let confirmingLobbyForfeit = $state(false);

  const lobbyBusy = $derived(
    lobbyStatus === 'creating' ||
      lobbyStatus === 'waiting' ||
      lobbyStatus === 'joining',
  );
  const lobbyActionDisabled = $derived(
    !isAuthenticated || !hasSelectedDeck || lobbyBusy,
  );

  async function copyRoomCode() {
    if (!lobbyRoomCode) return;
    try {
      await navigator.clipboard.writeText(lobbyRoomCode);
      codeCopied = true;
      setTimeout(() => (codeCopied = false), 2000);
    } catch (error) {
      console.error(error);
    }
  }
</script>

<div class="flex flex-col gap-3">
  <p
    class="overflow-hidden text-xs leading-5 text-slate-300 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]"
  >
    {m['sim.matchmaking.lobby.description']({})}
  </p>

  {#if lobbyStatus === 'waiting' && lobbyRoomCode}
    <div
      class="flex flex-col items-center gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-4"
    >
      <div class="flex items-center gap-2">
        <Loader class="size-4 animate-spin text-amber-400" />
        <p class="text-sm font-medium text-amber-200">
          {m['sim.matchmaking.lobby.waitingTitle']({})}
        </p>
      </div>
      <button
        type="button"
        onclick={copyRoomCode}
        class="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 font-mono text-2xl font-bold tracking-[0.3em] text-white transition-colors hover:bg-white/15"
      >
        {lobbyRoomCode}
        <Copy class="size-4 text-slate-400" />
      </button>
      <p class="text-xs text-slate-400">
        {codeCopied
          ? 'Copied!'
          : m['sim.matchmaking.lobby.shareCode']({})}
      </p>
      <Button
        variant="outline"
        class="h-9 border-white/10 bg-transparent text-slate-300 hover:bg-white/5 hover:text-white"
        onclick={onCancelRoom}
      >
        <X class="mr-1.5 size-4" />
        {m['sim.matchmaking.lobby.cancelRoom']({})}
      </Button>
    </div>
  {:else}
    <div class="grid gap-2">
      <div class="space-y-2">
        <label
          class="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400"
          for="lobby-mode-select"
        >
          {m['sim.matchmaking.lobby.modeLabel']({})}
        </label>
        <Select
          id="lobby-mode-select"
          aria-label={m['sim.matchmaking.lobby.modeLabel']({})}
          value={lobbySelectedMode}
          disabled={lobbyBusy}
          onchange={(event) =>
            onLobbyModeChange(
              (event.currentTarget as HTMLSelectElement)
                .value as LobbyMode,
            )}
        >
          <option value="1"
            >{m['sim.matchmaking.lobby.modeBo1']({})}</option
          >
          <option value="3"
            >{m['sim.matchmaking.lobby.modeBo3']({})}</option
          >
        </Select>
      </div>

      <Button
        class="h-10"
        disabled={lobbyActionDisabled || lobbyStatus === 'creating'}
        onclick={onCreateRoom}
      >
        {#if lobbyStatus === 'creating'}
          <Loader class="mr-2 size-5 animate-spin" />
          {m['sim.matchmaking.lobby.creatingRoom']({})}
        {:else}
          {m['sim.matchmaking.lobby.createRoom']({})}
        {/if}
      </Button>

      <Input
        bind:value={joinRoomCode}
        placeholder={m['sim.matchmaking.lobby.roomCodePlaceholder']({})}
        disabled={lobbyBusy}
        maxlength={6}
        class="border-white/10 bg-white/[0.04] uppercase tracking-[0.24em] text-slate-100 placeholder:text-slate-500"
      />
      <Button
        variant="outline"
        class="h-10 border-white/10 bg-transparent text-slate-200 hover:bg-white/5 hover:text-white"
        disabled={lobbyActionDisabled ||
          !joinRoomCode.trim() ||
          lobbyStatus === 'joining'}
        onclick={() => onJoinRoom(joinRoomCode.trim())}
      >
        {#if lobbyStatus === 'joining'}
          <Loader class="mr-2 size-4 animate-spin" />
          {m['sim.matchmaking.lobby.joiningRoom']({})}
        {:else}
          {m['sim.matchmaking.lobby.joinWithCode']({})}
        {/if}
      </Button>
    </div>

    {#if lobbyError && lobbyActiveMatchId}
      <div
        class="flex flex-col gap-3 rounded-lg border border-amber-500/20 bg-amber-500/5 px-4 py-3"
        role="alert"
      >
        <p class="text-sm leading-6 text-amber-200">
          You have an active match. Finish or quit it before creating a room.
        </p>
        {#if forfeiting}
          <div class="inline-flex items-center gap-1.5 text-sm font-medium text-amber-200/80">
            <Loader class="size-4 animate-spin" aria-hidden="true" />
            Forfeiting match…
          </div>
        {:else}
          <div class="flex flex-wrap gap-2">
            <Button
              variant="outline"
              class="h-8 border-amber-500/30 bg-amber-500/10 text-sm text-amber-200 hover:bg-amber-500/20 hover:text-amber-100"
              onclick={onRejoinMatch}
            >
              <Swords class="mr-1.5 size-3.5" />
              Return to Match
            </Button>
            {#if confirmingLobbyForfeit}
              <span class="inline-flex flex-wrap items-center gap-1.5 text-sm text-rose-200">
                Are you sure?
                <button
                  type="button"
                  onclick={() => {
                    confirmingLobbyForfeit = false;
                    onForfeitMatch();
                  }}
                  class="rounded-lg bg-rose-500/25 px-2.5 py-1 text-sm font-medium text-rose-100 transition-colors hover:bg-rose-500/40"
                >
                  Yes, forfeit
                </button>
                <button
                  type="button"
                  onclick={() => { confirmingLobbyForfeit = false; }}
                  class="rounded-lg bg-white/10 px-2.5 py-1 text-sm font-medium text-slate-300 transition-colors hover:bg-white/15"
                >
                  Cancel
                </button>
              </span>
            {:else}
              <Button
                variant="outline"
                class="h-8 border-white/10 bg-transparent text-sm text-slate-300 hover:bg-white/5 hover:text-white"
                onclick={() => { confirmingLobbyForfeit = true; }}
              >
                <X class="mr-1 size-3.5" />
                Quit Match
              </Button>
            {/if}
          </div>
        {/if}
      </div>
    {:else if lobbyError && lobbyExistingRoomCode}
      <div
        class="flex flex-col gap-3 rounded-lg border border-amber-500/20 bg-amber-500/5 px-4 py-3"
        role="alert"
      >
        <p class="text-sm leading-6 text-amber-200">
          You already have an active room ({lobbyExistingRoomCode}).
        </p>
        <div class="flex gap-2">
          <Button
            variant="outline"
            class="h-8 flex-1 border-amber-500/30 bg-amber-500/10 text-sm text-amber-200 hover:bg-amber-500/20 hover:text-amber-100"
            onclick={onRejoinExistingRoom}
          >
            Rejoin Room
          </Button>
          <Button
            variant="outline"
            class="h-8 flex-1 border-white/10 bg-transparent text-sm text-slate-300 hover:bg-white/5 hover:text-white"
            onclick={onCancelExistingRoom}
          >
            <X class="mr-1 size-3.5" />
            Cancel Room
          </Button>
        </div>
      </div>
    {:else if lobbyError}
      <div
        class="rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm leading-6 text-rose-200"
        role="alert"
      >
        {lobbyError}
      </div>
    {/if}
  {/if}
</div>
