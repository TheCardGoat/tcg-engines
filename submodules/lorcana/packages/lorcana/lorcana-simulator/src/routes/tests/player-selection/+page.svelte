<script lang="ts">
import LorcanaBrowserHarnessView from "@/features/simulator-devtools/harness/LorcanaBrowserHarnessView.svelte";
import { playerSelectionFixture as fixture } from "@/features/simulator-devtools/fixtures/player-selection.js";

const scenarios = [
  "Play Second Star to the Right and choose either player to verify direct player-targeted draw.",
  "Play Copper - Hound Pup and choose either player to reveal that player's hand.",
  "Play The Bare Necessities to reveal Player Two's hand and discard a non-character card of your choice.",
  "Play Water Has Memory and choose either player's deck to open the reordering flow.",
  "Play Anna - Little Sister to move a character card from the chosen player's discard to the bottom of that deck.",
  "Play Do You Want to Build A Snowman? and let the chosen opponent answer YES or NO, then resolve their follow-up choice.",
  "Play Undermine to choose a player for discard first, then pick a character for the strength boost.",
];
</script>

<svelte:head>
  <title>Player Selection Test</title>
</svelte:head>

<div class="flex min-h-screen flex-col bg-slate-950 text-slate-50">
  <section class="border-b border-slate-800 bg-slate-950/95 px-4 py-4 sm:px-6">
    <div class="mx-auto max-w-6xl">
      <h1 class="text-lg font-semibold tracking-tight sm:text-xl">Player Selection</h1>
      <p class="mt-2 max-w-4xl text-sm text-slate-300">
        This fixture concentrates the player-selection mechanic family into one browser sandbox:
        direct chosen-player effects, chosen-player hidden-zone interactions, and flows where the
        chosen player becomes the chooser for the next prompt.
      </p>
      <ol class="mt-4 grid gap-2 text-sm text-slate-200 sm:grid-cols-2">
        {#each scenarios as scenario}
          <li class="rounded-lg border border-slate-800 bg-slate-900/70 px-3 py-2">
            {scenario}
          </li>
        {/each}
      </ol>
    </div>
  </section>

  <div class="min-h-0 flex-1">
    <LorcanaBrowserHarnessView {fixture} view="playerOne" />
  </div>
</div>
