<script lang="ts">
  import { onDestroy } from "svelte";
  import { LorcanaMultiplayerTestEngine, PLAYER_ONE, PLAYER_TWO } from "@tcg/lorcana-engine/testing";
  import { hctorRiveraStreetMusician, fruFruVipGuest } from "@tcg/lorcana-cards/cards/014";
  import { hesATramp } from "@tcg/lorcana-cards/cards/007";
  import type { CardInstanceId, CommandResult } from "@tcg/lorcana-engine";
  import { assertLorcanaSimulatorMoveId } from "@/features/simulator/model/contracts";
  import { composeMoveLogForViewer, formatEventLogBody } from "@/features/simulator/model/event-log-formatting";
  const players = [PLAYER_ONE, PLAYER_TWO];
  const names: Record<string, string> = { [PLAYER_ONE]: "Player One", [PLAYER_TWO]: "Player Two", player_three: "Player Three" };
  let viewer = $state<string>(PLAYER_ONE);
  let revision = $state(0);
  let status = $state("Ready");
  function createGame() {
    return LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [hctorRiveraStreetMusician, fruFruVipGuest], hand: [hesATramp], inkDrops: 3, deck: 6 },
      { play: [hctorRiveraStreetMusician, fruFruVipGuest], hand: [hesATramp], inkDrops: 4, deck: 6 },
    );
  }
  const initialGame = createGame();
  let game = $state.raw(initialGame);
  const client = $derived(game.asLorcanaPlayer(viewer));
  const board = $derived.by(() => { revision; return client.getBoard(); });
  const readyInk = $derived.by(() => { revision; return Object.fromEntries(players.map((player) => [player, client.getAvailableInk(player)])); });
  const cardStates = $derived.by(() => { revision; return Object.fromEntries(players.flatMap((player) => board.players[player].play.map((id) => [id, { strength: client.getCardStrength(id), damage: client.getDamage(id), exerted: client.isExerted(id) }]))); });
  function cardLabel(id: string): string {
    const card = board.cards[id];
    if (!card || card.hidden) return "Hidden card";
    const definition = client.getCardDefinitionByInstanceId(id as CardInstanceId);
    return definition.version ? `${definition.name} — ${definition.version}` : definition.name;
  }
  // Composed typed logs contain only public references and this viewer's private references.
  // Resolve those stable identities independently of the card's current hidden zone.
  function logCardLabel(id: string): string {
    const definition = game.getCardDefinition(id);
    if (!definition) return "Hidden card";
    return definition.version ? `${definition.name} — ${definition.version}` : definition.name;
  }
  function execute(action: () => CommandResult) {
    const result = action(); status = result.success ? "Action completed" : result.error ?? "Action rejected"; revision++;
  }
  function reset() { void game.dispose(); game = createGame(); viewer = PLAYER_ONE; status = "Ready"; revision++; }
  function sing(opposing = false) {
    const owner = opposing ? (viewer === PLAYER_ONE ? PLAYER_TWO : PLAYER_ONE) : viewer;
    execute(() => client.playCard(game.findCardInstanceId(hesATramp, "hand", viewer)!, {
      cost: { cost: "sing", singer: game.findCardInstanceId(hctorRiveraStreetMusician, "play", owner)! },
      targets: [game.findCardInstanceId(hctorRiveraStreetMusician, "play", viewer)!],
    }));
  }
  const logs = $derived.by(() => {
    revision;
    return game.getServerEngine().getRuntime().getMoveLogHistory().map((log, index) => {
      const composed = composeMoveLogForViewer(log, viewer);
      return formatEventLogBody({
        id: String(index), timestamp: log.timestamp, turnNumber: board.turnNumber,
        moveId: log.moveType === "turnStart" ? "turnStart" : assertLorcanaSimulatorMoveId(log.moveType === "singCard" ? "playCard" : log.moveType),
        title: log.moveType, playerId: log.playerId, typedLogEntry: composed, knownPlayerIds: players,
      }, viewer === PLAYER_ONE ? "playerOne" : "playerTwo", "en", (id) => ({ label: logCardLabel(id) })).segments;
    });
  });
  onDestroy(() => { void game.dispose(); });
</script>
<main class="min-h-screen bg-zinc-950 p-6 text-zinc-100">
  <h1 class="mb-2 text-xl font-bold">Héctor Rivera — Cost-one song audit</h1>
  <p>Real player clients and simulator log formatting. Bounded ability checks with exact source copies.</p>
  <p>Singer 2. Strike a Chord: When played, you may put the top card of your deck into your discard. Singing is not entry.</p>
  <div class="my-3 flex gap-3">
    <button class="rounded border p-2" onclick={reset}>Reset audit</button>
    <label>View <select class="ml-2 rounded bg-zinc-800 p-2" bind:value={viewer}>{#each players as player}<option value={player}>{names[player]}</option>{/each}</select></label>
  </div>
  <p role="status">{status}. Turn: {board.turnNumber}. Bag: {board.bagEffects.length}. Pending choices: {board.pendingEffects.length}.</p>
  <section class="my-3 grid grid-cols-2 gap-4" aria-label="Player boards">
    {#each players as player}
      {@const state = board.players[player]}
      <article class="rounded border border-zinc-600 p-3">
        <h2 class="font-bold">{names[player]}</h2>
        <p>Deck: {state.deckCount}. Lore: {state.lore}. Drops: {state.inkDrops}. Ready ink: {readyInk[player]}.</p>
        <h3>Hand</h3><ul>{#each state.hand as id}<li>{cardLabel(id)}</li>{/each}</ul>
        <h3>In play</h3><ul>{#each state.play as id}<li>{cardLabel(id)} ({id}). Strength: {cardStates[id]?.strength}. Exerted: {cardStates[id]?.exerted ? "yes" : "no"}.</li>{/each}</ul>
        <h3>Discard</h3><ul>{#each state.discard as id}<li>{cardLabel(id)}</li>{/each}</ul>
      </article>
    {/each}
  </section>
  <section class="mb-3 flex flex-wrap gap-2" aria-label="Public actions">
    <button class="rounded border p-2" onclick={() => execute(() => client.passTurn())}>Pass turn</button>
    <button class="rounded border p-2" onclick={() => sing(true)}>Try opposing Hector as singer</button>
    <button class="rounded border p-2" onclick={() => sing()}>Sing cost-one song with own Hector</button>
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
