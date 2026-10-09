<script lang="ts">
  import { onDestroy } from "svelte";
  import { LorcanaMultiplayerTestEngine, PLAYER_ONE, PLAYER_TWO } from "@tcg/lorcana-engine/testing";
  import { captainHookConcernedCaptain, fruFruVipGuest, lesterThePossumParkMascot } from "@tcg/lorcana-cards/cards/014";
  import type { CardInstanceId, CommandResult } from "@tcg/lorcana-engine";
  import { assertLorcanaSimulatorMoveId } from "@/features/simulator/model/contracts";
  import { composeMoveLogForViewer, formatEventLogBody } from "@/features/simulator/model/event-log-formatting";
  const players = [PLAYER_ONE, PLAYER_TWO, "player_three"];
  const names: Record<string, string> = { [PLAYER_ONE]: "Player One", [PLAYER_TWO]: "Player Two", player_three: "Player Three" };
  let viewer = $state<string>(PLAYER_ONE);
  let revision = $state(0);
  let status = $state("Ready");
  let scenario = $state("defender-banish");
  function createGame(payment = false) {
    return LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [captainHookConcernedCaptain], hand: [fruFruVipGuest], lore: 5, inkDrops: 4, deck: 6 },
      { play: [{ card: lesterThePossumParkMascot, exerted: !payment }], lore: 7, inkwell: payment ? 5 : 0, inkDrops: payment ? 6 : 0, deck: 6 },
      { additionalPlayers: { player_three: { hand: [fruFruVipGuest], lore: 1, deck: 6 } } },
    );
  }
  let game = $state.raw(createGame());
  const client = $derived(game.asLorcanaPlayer(viewer));
  const board = $derived.by(() => { revision; return client.getBoard(); });
  const readyInk = $derived.by(() => { revision; return Object.fromEntries(players.map((player) => [player, client.getAvailableInk(player)])); });
  const cardStates = $derived.by(() => { revision; return Object.fromEntries(players.flatMap((player) => board.players[player].play.map((id) => [id, { reckless: client.hasKeyword(id, "Reckless"), exerted: client.isExerted(id) }]))); });
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
  function reset(payment: boolean) {
    void game.dispose(); game = createGame(payment); scenario = payment ? "ability-payment" : "defender-banish";
    viewer = PLAYER_ONE; status = "Ready"; revision++;
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
  <h1 class="mb-2 text-xl font-bold">Lester — Three-player ability audit</h1>
  <p class="mb-4">Real player clients and simulator log formatting. Bounded ability checks; no full three-player tabletop.</p>
  <p>When this character is challenged and banished, each opponent loses 2 lore.</p>
  <p>6 ink — Chosen opposing character gains Reckless until the start of your next turn.</p>
  <div class="my-4 flex gap-3">
    <button class="rounded border p-2" onclick={() => reset(false)}>Reset defender banish</button>
    <button class="rounded border p-2" onclick={() => reset(true)}>Reset ability payment</button>
    <label>View <select class="ml-2 rounded bg-zinc-800 p-2" bind:value={viewer}>
      {#each players as player}<option value={player}>{names[player]}</option>{/each}
    </select></label>
  </div>
  <p role="status">{status}. Scenario: {scenario}. Bag: {board.bagEffects.length}. Pending choices: {board.pendingEffects.length}.</p>
  <section class="my-4 grid grid-cols-3 gap-4" aria-label="Player boards">
    {#each players as player}
      {@const state = board.players[player]}
      <article class="rounded border border-zinc-600 p-3">
        <h2 class="font-bold">{names[player]}</h2>
        <p>Lore: {state.lore}. Ink drops: {state.inkDrops}. Ready ink: {readyInk[player]}.</p>
        <h3>Hand</h3><ul>{#each state.hand as id}<li>{cardLabel(id)}</li>{/each}</ul>
        <h3>In play</h3><ul>{#each state.play as id}<li>{cardLabel(id)}. Reckless: {cardStates[id]?.reckless ? "yes" : "no"}. Exerted: {cardStates[id]?.exerted ? "yes" : "no"}.</li>{/each}</ul>
        <h3>Discard</h3><ul>{#each state.discard as id}<li>{cardLabel(id)}</li>{/each}</ul>
      </article>
    {/each}
  </section>
  <section class="mb-4 flex gap-3" aria-label="Public actions">
    <button class="rounded border p-2" onclick={() => execute(() => client.passTurn())}>Pass turn</button>
    <button class="rounded border p-2" onclick={() => execute(() => client.challenge(captainHookConcernedCaptain, lesterThePossumParkMascot))}>Hook challenges Lester</button>
    <button class="rounded border p-2" onclick={() => execute(() => client.resolveOnlyBag())}>Resolve defender ability</button>
    <button class="rounded border p-2" onclick={() => execute(() => client.activateAbility(lesterThePossumParkMascot, { ability: "Maximum Cringe", targets: [captainHookConcernedCaptain] }))}>Activate with bank ink</button>
    <button class="rounded border p-2" onclick={() => execute(() => client.activateAbility(lesterThePossumParkMascot, { ability: "Maximum Cringe", targets: [captainHookConcernedCaptain], inkDrops: 6 }))}>Activate with six drops</button>
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
