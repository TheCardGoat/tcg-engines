<script lang="ts">
import LorcanaBrowserHarnessView from "@/features/simulator-devtools/harness/LorcanaBrowserHarnessView.svelte";
import { triage20260508ShereKhanSkipOptionalFixture as fixture } from "@/features/simulator-devtools/fixtures/triage-2026-05-08-shere-khan-skip-optional.js";
</script>

<svelte:head>
  <title>Triage 2026-05-08 — Shere Khan ON THE HUNT skip optional</title>
</svelte:head>

<LorcanaBrowserHarnessView {fixture} view="playerOne" />
