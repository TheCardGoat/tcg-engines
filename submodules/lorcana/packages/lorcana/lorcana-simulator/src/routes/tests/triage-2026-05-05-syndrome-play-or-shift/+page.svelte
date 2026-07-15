<script lang="ts">
import LorcanaBrowserHarnessView from "@/features/simulator-devtools/harness/LorcanaBrowserHarnessView.svelte";
import { triage20260505SyndromePlayOrShiftFixture as fixture } from "@/features/simulator-devtools/fixtures/triage-2026-05-05-syndrome-play-or-shift.js";
</script>

<svelte:head>
  <title>Triage 2026-05-05 — Syndrome play-or-shift</title>
</svelte:head>

<LorcanaBrowserHarnessView {fixture} view="playerOne" />
