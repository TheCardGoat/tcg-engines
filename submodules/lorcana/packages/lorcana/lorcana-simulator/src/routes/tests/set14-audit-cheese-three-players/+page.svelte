<script lang="ts">
  import { onDestroy } from "svelte";
  import { LorcanaMultiplayerTestEngine, PLAYER_ONE, PLAYER_TWO } from "@tcg/lorcana-engine/testing";
  import { fruFruVipGuest, inkcasterSkates, leaningTowerOfCheesea, portAuthorityCenterHub } from "@tcg/lorcana-cards/cards/014";
  import { breakCard } from "@tcg/lorcana-cards/cards/001";
  import { iFindEmIFlattenEm } from "@tcg/lorcana-cards/cards/004";
  import type { CardInstanceId, CommandResult } from "@tcg/lorcana-engine";
  import { assertLorcanaSimulatorMoveId } from "@/features/simulator/model/contracts";
  import { composeMoveLogForViewer, formatEventLogBody } from "@/features/simulator/model/event-log-formatting";
  const players = [PLAYER_ONE, PLAYER_TWO, "player_three"];
  const names: Record<string, string> = { [PLAYER_ONE]: "Player One", [PLAYER_TWO]: "Player Two", player_three: "Player Three" };
  let viewer = $state<string>(PLAYER_ONE);
  let revision = $state(0);
  let status = $state("Ready");
  function createGame() {
    return LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [breakCard], play: [leaningTowerOfCheesea, inkcasterSkates, fruFruVipGuest], inkwell: 2, deck: 8 },
      { hand: [leaningTowerOfCheesea, leaningTowerOfCheesea, breakCard, fruFruVipGuest], play: [leaningTowerOfCheesea, leaningTowerOfCheesea, leaningTowerOfCheesea, inkcasterSkates, fruFruVipGuest, portAuthorityCenterHub], discard: [leaningTowerOfCheesea], inkwell: 2, inkDrops: 2, deck: 8 },
      { additionalPlayers: { player_three: { hand: [breakCard, iFindEmIFlattenEm], play: [inkcasterSkates], inkwell: 6, deck: 8 } } },
    );
  }
  const initialGame = createGame();
  let game = $state.raw(initialGame);
  const client = $derived(game.asLorcanaPlayer(viewer));
  const board = $derived.by(() => { revision; return client.getBoard(); });
  const readyInk = $derived.by(() => { revision; return Object.fromEntries(players.map((player) => [player, client.getAvailableInk(player)])); });
  const cardStates = $derived.by(() => { revision; return Object.fromEntries(players.flatMap((player) => board.players[player].play.map((id) => [id, { ward: client.hasKeyword(id, "Ward"), damage: client.getDamage(id), exerted: client.isExerted(id) }]))); });
  function cardLabel(id: string): string {
    const card = board.cards[id];
    if (!card || card.hidden) return "Hidden card";
    const definition = client.getCardDefinitionByInstanceId(id as CardInstanceId);
    return definition.version ? `${definition.name} — ${definition.version}` : definition.name;
  }
  function execute(action: () => CommandResult) {
    const result = action(); status = result.success ? "Action completed" : result.error ?? "Action rejected"; revision++;
  }
  let playedTower = $state<CardInstanceId | undefined>();
  let drawn = $state<CardInstanceId | undefined>();
  function reset() { playedTower = undefined; drawn = undefined; void game.dispose(); game = createGame(); viewer = PLAYER_ONE; status = "Ready"; revision++; }
  function playTower() {
    const id = game.findCardInstanceId(leaningTowerOfCheesea, "hand", viewer)!;
    execute(() => client.playCard(id, { inkDrops: 1 }));
    playedTower = id;
  }
  function trade(accept: boolean) {
    const before = new Set(game.getCardInstanceIdsInZone("hand", viewer));
    execute(() => client.resolvePendingByCard(playedTower!, { resolveOptional: accept }));
    drawn = game.getCardInstanceIdsInZone("hand", viewer).find(id => !before.has(id));
  }
  function breakItem(ownTower = false) {
    const target = ownTower ? playedTower! : game.findCardInstanceId(inkcasterSkates, "play", PLAYER_TWO)!;
    execute(() => client.playCard(game.findCardInstanceId(breakCard, "hand", viewer)!, { targets: [target] }));
  }
  const logs = $derived.by(() => {
    revision;
    return game.getServerEngine().getRuntime().getMoveLogHistory().map((log, index) => {
      const composed = composeMoveLogForViewer(log, viewer);
      return formatEventLogBody({
        id: String(index), timestamp: log.timestamp, turnNumber: board.turnNumber,
        moveId: log.moveType === "turnStart" ? "turnStart" : assertLorcanaSimulatorMoveId(log.moveType === "singCard" ? "playCard" : log.moveType),
        title: log.moveType, playerId: log.playerId, typedLogEntry: composed, knownPlayerIds: players,
      }, viewer === PLAYER_ONE ? "playerOne" : "playerTwo", "en", (id) => ({ label: cardLabel(id) })).segments;
    });
  });
  onDestroy(() => { void game.dispose(); });
</script>
<main class="min-h-screen bg-zinc-950 p-6 text-zinc-100">
  <h1 class="mb-2 text-xl font-bold">Leaning Tower of Cheese-a — Three-player audit</h1>
  <p>Real player clients and simulator log formatting. Bounded ability checks; no full three-player tabletop.</p>
  <p>Fair Trade: You may draw, then choose and discard. Extra Cheesy: With four named items in play, your items gain Ward.</p>
  <div class="my-3 flex gap-3">
    <button class="rounded border p-2" onclick={reset}>Reset audit</button>
    <label>View <select class="ml-2 rounded bg-zinc-800 p-2" bind:value={viewer}>{#each players as player}<option value={player}>{names[player]}</option>{/each}</select></label>
  </div>
  <p role="status">{status}. Turn: {board.turnNumber}. Bag: {board.bagEffects.length}. Pending choices: {board.pendingEffects.length}.</p>
  <section class="my-3 grid grid-cols-3 gap-4" aria-label="Player boards">
    {#each players as player}
      {@const state = board.players[player]}
      <article class="rounded border border-zinc-600 p-3">
        <h2 class="font-bold">{names[player]}</h2>
        <p>Deck: {state.deckCount}. Lore: {state.lore}. Drops: {state.inkDrops}. Ready ink: {readyInk[player]}.</p>
        <h3>Hand</h3><ul>{#each state.hand as id}<li>{cardLabel(id)}</li>{/each}</ul>
        <h3>In play</h3><ul>{#each state.play as id}<li>{cardLabel(id)}. Ward: {cardStates[id]?.ward ? "yes" : "no"}. Damage: {cardStates[id]?.damage}. Exerted: {cardStates[id]?.exerted ? "yes" : "no"}.</li>{/each}</ul>
        <h3>Discard</h3><ul>{#each state.discard as id}<li>{cardLabel(id)}</li>{/each}</ul>
      </article>
    {/each}
  </section>
  <section class="mb-3 flex flex-wrap gap-2" aria-label="Public actions">
    <button class="rounded border p-2" onclick={() => execute(() => client.passTurn())}>Pass turn</button>
    <button class="rounded border p-2" onclick={playTower}>Play Tower with one drop</button>
    <button class="rounded border p-2" onclick={() => trade(true)}>Accept Fair Trade</button>
    <button class="rounded border p-2" onclick={() => trade(false)}>Decline Fair Trade</button>
    <button class="rounded border p-2" onclick={() => execute(() => client.resolveNextPending({ targets: [] }))}>Try skipping discard</button>
    <button class="rounded border p-2" onclick={() => execute(() => client.resolveNextPending({ targets: [game.findCardInstanceId(inkcasterSkates, "play", PLAYER_TWO)!] }))}>Try in-play item discard</button>
    <button class="rounded border p-2" onclick={() => execute(() => client.resolveNextPending({ targets: game.getCardInstanceIdsInZone("hand", viewer).slice(0, 2) }))}>Try two discards</button>
    <button class="rounded border p-2" onclick={() => execute(() => client.respondWith(drawn!))}>Discard newly drawn card</button>
    <button class="rounded border p-2" onclick={() => breakItem(true)}>Break own fifth Tower</button>
    <button class="rounded border p-2" onclick={() => breakItem()}>Try Break protected Skates</button>
    <button class="rounded border p-2" onclick={() => execute(() => client.playCard(game.findCardInstanceId(iFindEmIFlattenEm, "hand", viewer)!))}>Banish all items with Flatten</button>
  </section>
  <section aria-label="Event log">
    <h2 class="mb-2 font-bold">Event log — {names[viewer]}</h2>
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
