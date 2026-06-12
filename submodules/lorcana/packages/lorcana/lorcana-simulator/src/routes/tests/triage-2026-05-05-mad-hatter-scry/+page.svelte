<script lang="ts">
import LorcanaBrowserHarnessView from "@/features/simulator-devtools/harness/LorcanaBrowserHarnessView.svelte";
import { triage20260505MadHatterScryFixture as fixture } from "@/features/simulator-devtools/fixtures/triage-2026-05-05-mad-hatter-scry.js";
</script>

<svelte:head>
  <title>Triage 2026-05-05 — Mad Hatter scry</title>
</svelte:head>

<LorcanaBrowserHarnessView {fixture} view="playerOne" />
