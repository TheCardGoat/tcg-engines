<script lang="ts">
import LorcanaBrowserHarnessView from "@/features/simulator-devtools/harness/LorcanaBrowserHarnessView.svelte";
import { triage20260505TouchTheSkyFixture as fixture } from "@/features/simulator-devtools/fixtures/triage-2026-05-05-touch-the-sky.js";
</script>

<svelte:head>
  <title>Triage 2026-05-05 — Touch the Sky</title>
</svelte:head>

<LorcanaBrowserHarnessView {fixture} view="playerOne" />
