<script lang="ts">
import LorcanaBrowserHarnessView from "@/features/simulator-devtools/harness/LorcanaBrowserHarnessView.svelte";
import { singSecondStarFixture as fixture } from "@/features/simulator-devtools/fixtures/sing-second-star.js";

const scenarios = [
  "Sing path: tap any combination of player one's characters totaling cost 10+ to sing Second Star to the Right (Enchanted) for free, then choose a player to draw 5.",
  "Hard-cast path: pay the 10 ink cost from the inkwell and choose a player to draw 5 — used as a control to confirm the action effect itself works.",
  "Bug under test: player report says after picking singers (or paying ink) there's no command to resolve and the prompt says 'no cards to select'. The 'chosen player' target should resolve to a player, not a card.",
];
</script>

<svelte:head>
  <title>Sing Second Star (Enchanted) Test</title>
</svelte:head>

<div class="flex min-h-screen flex-col bg-slate-950 text-slate-50">
  <section class="border-b border-slate-800 bg-slate-950/95 px-4 py-4 sm:px-6">
    <div class="mx-auto max-w-6xl">
      <h1 class="text-lg font-semibold tracking-tight sm:text-xl">
        Sing Second Star to the Right (Enchanted)
      </h1>
      <p class="mt-2 max-w-4xl text-sm text-slate-300">
        Reproduces the player report where singing or hard-casting Second Star to the Right
        (Enchanted) leaves the resolution stuck on a "no cards to select" prompt. Player one has
        the enchanted song in hand, four dry singers totaling well over cost 10, and 10 ink to also
        try the hard-cast path.
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
