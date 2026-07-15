<script lang="ts">
import LorcanaBrowserHarnessView from "@/features/simulator-devtools/harness/LorcanaBrowserHarnessView.svelte";
import { triage20260505DiabloDiscardShiftFixture as fixture } from "@/features/simulator-devtools/fixtures/triage-2026-05-05-diablo-discard-shift.js";
</script>

<svelte:head>
  <title>Triage 2026-05-05 — Diablo discard-shift</title>
</svelte:head>

<LorcanaBrowserHarnessView {fixture} view="playerOne" />
