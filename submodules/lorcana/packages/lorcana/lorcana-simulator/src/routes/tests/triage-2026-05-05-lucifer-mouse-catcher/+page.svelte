<script lang="ts">
import LorcanaBrowserHarnessView from "@/features/simulator-devtools/harness/LorcanaBrowserHarnessView.svelte";
import { triage20260505LuciferMouseCatcherFixture as fixture } from "@/features/simulator-devtools/fixtures/triage-2026-05-05-lucifer-mouse-catcher.js";
</script>

<svelte:head>
  <title>Triage 2026-05-05 — Lucifer MOUSE CATCHER</title>
</svelte:head>

<LorcanaBrowserHarnessView {fixture} view="playerOne" />
