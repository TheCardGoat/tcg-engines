<script lang="ts">
  import { onDestroy } from "svelte";
  import { LorcanaMultiplayerTestEngine, PLAYER_ONE, PLAYER_TWO } from "@tcg/lorcana-engine/testing";
  import { fruFruVipGuest, shereKhanOpportunisticTycoon } from "@tcg/lorcana-cards/cards/014";
  import type { CardInstanceId, CommandResult } from "@tcg/lorcana-engine";
  import { assertLorcanaSimulatorMoveId } from "@/features/simulator/model/contracts";
  import { composeMoveLogForViewer, formatEventLogBody } from "@/features/simulator/model/event-log-formatting";

  const players = [PLAYER_ONE, PLAYER_TWO, "player_three"];
  const names: Record<string, string> = { [PLAYER_ONE]: "Player One", [PLAYER_TWO]: "Player Two", player_three: "Player Three" };
  let viewer = $state<string>(PLAYER_ONE);
  let revision = $state(0);
  let status = $state("Ready");
  let scenario = $state("two-hands");
  function createGame(emptyFirst = false) {
    return LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [shereKhanOpportunisticTycoon, fruFruVipGuest], inkwell: 4, deck: 6 },
      { hand: emptyFirst ? [] : [fruFruVipGuest], deck: 6 },
      { additionalPlayers: { player_three: { hand: [fruFruVipGuest, fruFruVipGuest], deck: 6 } } },
    );
  }
  let game = $state.raw(createGame());
  const client = $derived(game.asLorcanaPlayer(viewer));
  const board = $derived.by(() => { revision; return client.getBoard(); });
  const readyInk = $derived.by(() => { revision; return Object.fromEntries(players.map((player) => [player, client.getAvailableInk(player)])); });
  const pending = $derived(board.pendingEffects.find((effect) => effect.selectionContext?.chooserId === viewer));
  const selection = $derived(pending?.selectionContext);
  const candidateIds = $derived(selection && "cardCandidateIds" in selection ? selection.cardCandidateIds : []);
  function cardLabel(id: string): string {
    const card = board.cards[id];
    if (!card || card.hidden) return "Hidden card";
    const definition = client.getCardDefinitionByInstanceId(id as CardInstanceId);
    return definition.version ? `${definition.name} — ${definition.version}` : definition.name;
  }
  function execute(action: () => CommandResult) {
    const result = action();
    status = result.success ? "Action completed" : result.error ?? "Action rejected";
    revision++;
  }
  function reset(emptyFirst: boolean) {
    void game.dispose();
    game = createGame(emptyFirst);
    scenario = emptyFirst ? "empty-first-hand" : "two-hands";
    viewer = PLAYER_ONE;
    status = "Ready";
    revision++;
  }
  const logs = $derived.by(() => {
    revision;
    return game.getServerEngine().getRuntime().getMoveLogHistory().map((log, index) => {
      const composed = composeMoveLogForViewer(log, viewer);
      return formatEventLogBody({
        id: String(index), timestamp: log.timestamp, turnNumber: board.turnNumber,
        moveId: log.moveType === "turnStart" ? "turnStart" : assertLorcanaSimulatorMoveId(log.moveType),
        title: log.moveType, playerId: log.playerId, typedLogEntry: composed,
      }, viewer === PLAYER_ONE ? "playerOne" : "playerTwo", "en", (id) => ({ label: cardLabel(id) })).segments;
    });
  });
  onDestroy(() => { void game.dispose(); });
</script>

<main class="min-h-screen bg-zinc-950 p-6 text-zinc-100">
  <h1 class="mb-2 text-xl font-bold">Shere Khan — Three-player ability audit</h1>
  <p class="mb-4 text-sm text-zinc-300">Real player clients, projected hands, public actions and simulator log formatting. This audit page checks the printed ability; it does not provide a full three-player tabletop.</p>
  <p class="mb-4">When you play this character, each opponent may choose and discard a card. For each opponent who doesn’t, get 1 ink drop.</p>
  <div class="mb-4 flex gap-3">
    <button class="rounded border p-2" onclick={() => reset(false)}>Reset two hands</button>
    <button class="rounded border p-2" onclick={() => reset(true)}>Reset empty first hand</button>
    <label>View <select class="ml-2 rounded bg-zinc-800 p-2" bind:value={viewer}>
      {#each players as player}<option value={player}>{names[player]}</option>{/each}
    </select></label>
  </div>
  <p role="status">{status}. Scenario: {scenario}. Bag: {board.bagEffects.length}. Pending choices: {board.pendingEffects.length}.</p>
  <section class="my-4 grid grid-cols-3 gap-4" aria-label="Player boards">
    {#each players as player}
      {@const state = board.players[player]}
      <article class="rounded border border-zinc-600 p-3">
        <h2 class="text-lg font-bold">{names[player]}</h2>
        <p>Ink drops: {state.inkDrops}. Hand: {state.hand.length}. Discard: {state.discard.length}.</p>
        <p>Ready ink: {readyInk[player]}</p>
        <h3 class="mt-2 font-bold">Hand</h3>
        <ul>{#each state.hand as id, index}<li data-card-instance-id={board.cards[id]?.hidden ? undefined : id}>Copy {index + 1}: {cardLabel(id)}
          {#if player === viewer && viewer === PLAYER_ONE}
            <button class="ml-2 rounded border p-1" onclick={() => execute(() => client.playCard(id as CardInstanceId, cardLabel(id).startsWith("Fru Fru") ? { inkDrops: 1 } : {}))}>Play {cardLabel(id)}</button>
          {/if}
        </li>{/each}</ul>
        <h3 class="mt-2 font-bold">Discard</h3>
        <ul>{#each state.discard as id}<li data-card-instance-id={id}>{cardLabel(id)}</li>{/each}</ul>
        <h3 class="mt-2 font-bold">In play</h3>
        <ul>{#each state.play as id}<li data-card-instance-id={id}>{cardLabel(id)}</li>{/each}</ul>
      </article>
    {/each}
  </section>
  <section class="mb-4 rounded border border-zinc-600 p-3" aria-label="Ability choices">
    {#each board.bagEffects.filter((effect) => effect.chooserId === viewer) as effect}
      <button class="rounded border p-2" onclick={() => execute(() => client.resolvePendingByCard(effect.sourceId))}>Resolve Shere Khan ability</button>
    {/each}
    {#if selection?.kind === "optional-selection"}
      <p>{names[viewer]} may discard one own hand card.</p>
      <button class="mr-2 rounded border p-2" onclick={() => execute(() => client.resolveNextPending({ resolveOptional: true }))}>Choose discard</button>
      <button class="rounded border p-2" onclick={() => execute(() => client.resolveNextPending({ resolveOptional: false }))}>Decline discard</button>
    {:else if selection && (selection.kind === "discard-choice" || selection.kind === "target-selection")}
      <p>{names[viewer]}: choose exactly one own hand card.</p>
      {#if selection.canDeclineSelection || selection.originatesFromOptional}
        <button class="mr-2 rounded border p-2" onclick={() => execute(() => client.resolveNextPending({ resolveOptional: false }))}>Decline discard</button>
      {/if}
      {#each candidateIds as id, index}
        <button class="mr-2 rounded border p-2" onclick={() => execute(() => client.resolveNextPending({ targets: [id] }))}>Discard copy {index + 1}: {cardLabel(id)}</button>
      {/each}
    {:else if board.pendingEffects.length > 0}
      <p>Waiting for {names[board.pendingEffects[0].selectionContext?.chooserId ?? board.pendingChoice?.playerID ?? ""]}.</p>
    {:else if board.bagEffects.length === 0}
      <p>No unresolved ability.</p>
    {/if}
  </section>
  <section aria-label="Event log">
    <h2 class="mb-2 text-lg font-bold">Event log — {names[viewer]}</h2>
    <ol class="space-y-2">{#each logs as segments}<li class="rounded bg-zinc-900 p-2">
      {#each segments as segment}
        {#if segment.kind === "player"}<strong>{names[segment.playerId ?? ""] ?? segment.text}</strong>
        {:else if segment.kind === "card"}<span class="text-amber-200">{segment.fallbackLabel ?? cardLabel(segment.cardId)}</span>
        {:else if segment.kind === "icon"}{segment.label}
        {:else}{segment.text}{/if}
      {/each}
    </li>{/each}</ol>
  </section>
</main>
