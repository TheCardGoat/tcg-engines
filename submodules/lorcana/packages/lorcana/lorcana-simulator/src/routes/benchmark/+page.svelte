<script lang="ts">
  import type { CardInput, CardInstanceId } from "@tcg/lorcana-engine";
  import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
  import { boardPressureFixture } from "@/features/simulator-devtools/fixtures/board-pressure.js";

  // Use sync transport to isolate engine cost (no network latency)
  const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
    boardPressureFixture.playerOne,
    boardPressureFixture.playerTwo,
    {
      browserTransport: { mode: "sync" },
      skipPreGame: boardPressureFixture.skipPreGame ?? true,
      seed: boardPressureFixture.seed ?? "benchmark",
    },
  );

  // Bind to player one — methods like ink(), quest(), passTurn() work without playerId
  const p1 = testEngine.asPlayerOne();

  type Timing = { label: string; ms: number };
  let timings = $state<Timing[]>([]);
  let moves = $state(p1.getAvailableMoves());

  /** Execute fn(), measure wall time, then refresh available moves */
  function run(label: string, fn: () => void): void {
    const t0 = performance.now();
    fn();
    const ms = parseFloat((performance.now() - t0).toFixed(1));
    timings = [{ label, ms }, ...timings];
    moves = p1.getAvailableMoves();
  }

  /** Get first available defender for a given attacker */
  function firstDefender(attackerId: string): string | undefined {
    const opts = p1.getMoveOptions("challenge", attackerId as CardInstanceId);
    const first = opts.find((o) => o.kind === "card");
    return first?.kind === "card" ? first.cardId : undefined;
  }

  const avg = $derived(
    timings.length
      ? parseFloat((timings.reduce((a, t) => a + t.ms, 0) / timings.length).toFixed(1))
      : null,
  );
  const last = $derived(timings[0]?.ms ?? null);
</script>

<div style="font-family: monospace; padding: 24px; max-width: 820px; margin: 0 auto;">
  <h1 style="font-size: 1.1rem; margin: 0 0 4px;">Engine Benchmark — minimal UI</h1>
  <p style="color: #888; font-size: 0.8rem; margin: 0 0 20px;">
    Fixture: <strong>{boardPressureFixture.name}</strong> &nbsp;|&nbsp;
    P1 play: {Array.isArray(boardPressureFixture.playerOne.play) ? boardPressureFixture.playerOne.play.length : (boardPressureFixture.playerOne.play ?? 0)} cards,
    P2 play: {Array.isArray(boardPressureFixture.playerTwo.play) ? boardPressureFixture.playerTwo.play.length : (boardPressureFixture.playerTwo.play ?? 0)} cards &nbsp;|&nbsp;
    No card art, no Svelte components — pure engine timing
  </p>

  {#if avg !== null}
    <div style="display: flex; gap: 32px; margin-bottom: 20px;">
      <div>
        <div style="font-size: 0.7rem; color: #888;">LAST</div>
        <div style="font-size: 1.6rem; font-weight: bold; color: {last !== null && last < 50 ? '#22c55e' : last !== null && last > 150 ? '#ef4444' : '#facc15'}">
          {last}ms
        </div>
      </div>
      <div>
        <div style="font-size: 0.7rem; color: #888;">AVG ({timings.length} actions)</div>
        <div style="font-size: 1.6rem; font-weight: bold; color: {avg < 50 ? '#22c55e' : avg > 150 ? '#ef4444' : '#facc15'}">
          {avg}ms
        </div>
      </div>
    </div>
  {/if}

  <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 24px;">
    {#each moves as move}
      {#if move.moveId === "putCardIntoInkwell"}
        {#each move.selectableCardIds as cardId}
          <button
            style="padding: 8px 12px; background: #1a1a2e; border: 1px solid #4444aa; color: #aad4ff; border-radius: 4px; cursor: pointer; font-family: monospace; font-size: 0.8rem;"
            onclick={() => run("ink", () => { p1.ink(cardId); })}
          >
            Ink [{cardId.slice(-8)}]
          </button>
        {/each}
      {:else if move.moveId === "quest"}
        {#each move.selectableCardIds as cardId}
          <button
            style="padding: 8px 12px; background: #1a2e1a; border: 1px solid #44aa44; color: #aaffaa; border-radius: 4px; cursor: pointer; font-family: monospace; font-size: 0.8rem;"
            onclick={() => run("quest", () => { p1.quest(cardId); })}
          >
            Quest [{cardId.slice(-8)}]
          </button>
        {/each}
      {:else if move.moveId === "challenge"}
        {#each move.selectableCardIds as attackerId}
          {@const defender = firstDefender(attackerId)}
          {#if defender}
            <button
              style="padding: 8px 12px; background: #2e1a1a; border: 1px solid #aa4444; color: #ffaaaa; border-radius: 4px; cursor: pointer; font-family: monospace; font-size: 0.8rem;"
              onclick={() => run("challenge", () => { p1.challenge(attackerId as CardInput, defender as CardInput); })}
            >
              Challenge [{attackerId.slice(-8)}] → [{defender.slice(-8)}]
            </button>
          {/if}
        {/each}
      {:else if move.moveId === "passTurn"}
        <button
          style="padding: 8px 12px; background: #2e2e1a; border: 1px solid #aaaa44; color: #ffffaa; border-radius: 4px; cursor: pointer; font-family: monospace; font-size: 0.8rem;"
          onclick={() => run("passTurn", () => { p1.passTurn(); })}
        >
          Pass Turn
        </button>
      {:else if move.moveId !== "concede"}
        <button
          style="padding: 8px 12px; background: #1a1a1a; border: 1px solid #555; color: #888; border-radius: 4px; cursor: not-allowed; font-family: monospace; font-size: 0.8rem;"
          disabled
        >
          {move.moveId} (not timed)
        </button>
      {/if}
    {/each}

    {#if moves.length === 0}
      <span style="color: #888; font-size: 0.85rem;">No moves available (game may have ended or state changed).</span>
    {/if}
  </div>

  {#if timings.length === 0}
    <p style="color: #666; font-size: 0.85rem;">Click any button above to start benchmarking.</p>
  {:else}
    <div style="border: 1px solid #333; padding: 8px; max-height: 320px; overflow-y: auto;">
      {#each timings as t, i}
        <div style="display: flex; justify-content: space-between; padding: 3px 4px; border-bottom: 1px solid #1a1a1a; font-size: 0.8rem;">
          <span style="color: #aaa;">#{timings.length - i} {t.label}</span>
          <span style="font-weight: bold; color: {t.ms < 50 ? '#22c55e' : t.ms > 150 ? '#ef4444' : '#facc15'}">{t.ms}ms</span>
        </div>
      {/each}
    </div>
  {/if}
</div>
