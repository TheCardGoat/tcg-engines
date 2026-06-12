<script lang="ts">
import LorcanaBrowserHarnessView from "@/features/simulator-devtools/harness/LorcanaBrowserHarnessView.svelte";
import { triage20260511DinBodyguardEnterExertedFixture as fixture } from "@/features/simulator-devtools/fixtures/triage-2026-05-11-din-bodyguard-enter-exerted.js";
</script>

<svelte:head>
  <title>Triage 2026-05-11 — DiNO + Bodyguard enter exerted</title>
</svelte:head>

<LorcanaBrowserHarnessView {fixture} view="playerOne" />
