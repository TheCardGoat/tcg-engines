<script lang="ts">
  import { onDestroy } from "svelte";
  import { LorcanaMultiplayerTestEngine, PLAYER_ONE, PLAYER_TWO } from "@tcg/lorcana-engine/testing";
  import { donaldDuckTaxiDriver, baymaxQualifiedPhysician, fruFruVipGuest, inkcasterSkates, theBeanstalkOnwardAndUpward } from "@tcg/lorcana-cards/cards/014";
  import { aladdinPrinceAli } from "@tcg/lorcana-cards/cards/001";
  import { queenOfHeartsImpulsiveRuler } from "@tcg/lorcana-cards/cards/002";
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
      { play: [aladdinPrinceAli, { card: baymaxQualifiedPhysician, exerted: true }, fruFruVipGuest], inkDrops: 4, deck: 8 },
      { hand: [donaldDuckTaxiDriver, donaldDuckTaxiDriver, donaldDuckTaxiDriver, baymaxQualifiedPhysician, baymaxQualifiedPhysician], play: [aladdinPrinceAli, queenOfHeartsImpulsiveRuler, inkcasterSkates, theBeanstalkOnwardAndUpward], discard: [baymaxQualifiedPhysician], inkDrops: 12, deck: 8 },
    );
  }
  const initialGame = createGame();
  let game = $state.raw(initialGame);
  const client = $derived(game.asLorcanaPlayer(viewer));
  const board = $derived.by(() => { revision; return client.getBoard(); });
  const readyInk = $derived.by(() => { revision; return Object.fromEntries(players.map((player) => [player, client.getAvailableInk(player)])); });
  const cardStates = $derived.by(() => { revision; return Object.fromEntries(players.flatMap((player) => board.players[player].play.map((id) => [id, { strength: client.getCardStrength(id), rush: client.hasKeyword(id, "Rush"), location: client.getCardLocationId(id), damage: client.getDamage(id), exerted: client.isExerted(id) }]))); });
  function cardLabel(id: string): string {
    const card = board.cards[id];
    if (!card || card.hidden) return "Hidden card";
    const definition = client.getCardDefinitionByInstanceId(id as CardInstanceId);
    return definition.version ? `${definition.name} — ${definition.version}` : definition.name;
  }
  function execute(action: () => CommandResult) {
    const result = action(); status = result.success ? "Action completed" : result.error ?? "Action rejected"; revision++;
  }
  let playedDonald = $state<CardInstanceId | undefined>();
  function reset() { playedDonald = undefined; void game.dispose(); game = createGame(); viewer = PLAYER_ONE; status = "Ready"; revision++; }
  function playDonald() {
    const id = game.findCardInstanceId(donaldDuckTaxiDriver, "hand", viewer)!;
    execute(() => client.playCard(id, { inkDrops: 3 })); playedDonald = id;
  }
  function choose(target: CardInstanceId) { execute(() => client.resolvePendingByCard(playedDonald!, { targets: [target] })); }
  function chooseBaymax(zone: "hand" | "play" | "discard" = "play") { choose(game.findCardInstanceId(baymaxQualifiedPhysician, zone, PLAYER_TWO)!); }
  const logs = $derived.by(() => {
    revision;
    return game.getServerEngine().getRuntime().getMoveLogHistory().map((log, index) => {
      const composed = composeMoveLogForViewer(log, viewer);
      return formatEventLogBody({
        id: String(index), timestamp: log.timestamp, turnNumber: board.turnNumber,
        moveId: log.moveType === "turnStart" ? "turnStart" : assertLorcanaSimulatorMoveId(log.moveType === "moveToLocation" ? "moveCharacterToLocation" : log.moveType),
        title: log.moveType, playerId: log.playerId, typedLogEntry: composed, knownPlayerIds: players,
      }, viewer === PLAYER_ONE ? "playerOne" : "playerTwo", "en", (id) => ({ label: cardLabel(id) })).segments;
    });
  });
  onDestroy(() => { void game.dispose(); });
</script>
<main class="min-h-screen bg-zinc-950 p-6 text-zinc-100">
  <h1 class="mb-2 text-xl font-bold">Donald Duck — Player Two audit</h1>
  <p>Real player clients and simulator log formatting. Bounded ability checks with exact source copies.</p>
  <p>Rush Hour: When you play this character, chosen character gains Rush this turn.</p>
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
        <h3>In play</h3><ul>{#each state.play as id}<li>{cardLabel(id)} ({id}). Strength: {cardStates[id]?.strength}. Rush: {cardStates[id]?.rush ? "yes" : "no"}. At: {cardStates[id]?.location ?? "none"}. Damage: {cardStates[id]?.damage}. Exerted: {cardStates[id]?.exerted ? "yes" : "no"}.</li>{/each}</ul>
        <h3>Discard</h3><ul>{#each state.discard as id}<li>{cardLabel(id)}</li>{/each}</ul>
      </article>
    {/each}
  </section>
  <section class="mb-3 flex flex-wrap gap-2" aria-label="Public actions">
    <button class="rounded border p-2" onclick={() => execute(() => client.passTurn())}>Pass turn</button>
    <button class="rounded border p-2" onclick={() => execute(() => client.playCard(game.findCardInstanceId(baymaxQualifiedPhysician, "hand", viewer)!, { inkDrops: 3 }))}>Play fresh Baymax with three drops</button>
    <button class="rounded border p-2" onclick={playDonald}>Play Donald with three drops</button>
    <button class="rounded border p-2" onclick={() => chooseBaymax()}>Grant Rush to fresh Baymax</button>
    <button class="rounded border p-2" onclick={() => choose(game.findCardInstanceId(aladdinPrinceAli, "play", PLAYER_TWO)!)}>Grant Rush to friendly Ward Aladdin</button>
    <button class="rounded border p-2" onclick={() => choose(game.findCardInstanceId(queenOfHeartsImpulsiveRuler, "play", PLAYER_TWO)!)}>Grant Rush to native Queen</button>
    <button class="rounded border p-2" onclick={() => execute(() => client.resolvePendingByCard(playedDonald!, { targets: [] }))}>Try empty target</button>
    <button class="rounded border p-2" onclick={() => choose(game.findCardInstanceId(inkcasterSkates, "play", PLAYER_TWO)!)}>Try item target</button>
    <button class="rounded border p-2" onclick={() => choose(game.findCardInstanceId(theBeanstalkOnwardAndUpward, "play", PLAYER_TWO)!)}>Try location target</button>
    <button class="rounded border p-2" onclick={() => chooseBaymax("hand")}>Try hand target</button>
    <button class="rounded border p-2" onclick={() => chooseBaymax("discard")}>Try discard target</button>
    <button class="rounded border p-2" onclick={() => choose(game.findCardInstanceId(aladdinPrinceAli, "play", PLAYER_ONE)!)}>Try opposing Ward</button>
    <button class="rounded border p-2" onclick={() => execute(() => client.resolvePendingByCard(playedDonald!, { targets: [game.findCardInstanceId(baymaxQualifiedPhysician, "play", PLAYER_TWO)!, game.findCardInstanceId(aladdinPrinceAli, "play", PLAYER_TWO)!] }))}>Try two targets</button>
    <button class="rounded border p-2" onclick={() => execute(() => client.quest(game.findCardInstanceId(baymaxQualifiedPhysician, "play", PLAYER_TWO)!))}>Try quest with fresh Baymax</button>
    <button class="rounded border p-2" onclick={() => execute(() => client.challenge(game.findCardInstanceId(baymaxQualifiedPhysician, "play", PLAYER_TWO)!, game.findCardInstanceId(fruFruVipGuest, "play", PLAYER_ONE)!))}>Try challenge ready Fru Fru</button>
    <button class="rounded border p-2" onclick={() => execute(() => client.challenge(game.findCardInstanceId(baymaxQualifiedPhysician, "play", PLAYER_TWO)!, game.findCardInstanceId(baymaxQualifiedPhysician, "play", PLAYER_ONE)!))}>Challenge exerted Baymax</button>
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
