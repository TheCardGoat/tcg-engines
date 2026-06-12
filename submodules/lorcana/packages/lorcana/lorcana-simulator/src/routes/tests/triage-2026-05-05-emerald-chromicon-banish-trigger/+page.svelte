<script lang="ts">
import LorcanaBrowserHarnessView from "@/features/simulator-devtools/harness/LorcanaBrowserHarnessView.svelte";
import { triage20260505EmeraldChromiconBanishTriggerFixture as fixture } from "@/features/simulator-devtools/fixtures/triage-2026-05-05-emerald-chromicon-banish-trigger.js";
</script>

<svelte:head>
  <title>Triage 2026-05-05 — Emerald Chromicon EMERALD LIGHT</title>
</svelte:head>

<LorcanaBrowserHarnessView {fixture} view="playerOne" />
