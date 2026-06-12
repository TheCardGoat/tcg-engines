<script lang="ts">
import LorcanaBrowserHarnessView from "@/features/simulator-devtools/harness/LorcanaBrowserHarnessView.svelte";
import { triage20260505GoofySetForAdventureFixture as fixture } from "@/features/simulator-devtools/fixtures/triage-2026-05-05-goofy-set-for-adventure.js";
</script>

<svelte:head>
  <title>Triage 2026-05-05 — Goofy Set for Adventure</title>
</svelte:head>

<LorcanaBrowserHarnessView {fixture} view="playerOne" />
