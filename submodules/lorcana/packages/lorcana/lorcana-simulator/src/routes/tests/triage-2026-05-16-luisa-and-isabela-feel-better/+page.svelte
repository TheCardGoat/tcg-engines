<script lang="ts">
import LorcanaBrowserHarnessView from "@/features/simulator-devtools/harness/LorcanaBrowserHarnessView.svelte";
import { triage20260516LuisaAndIsabelaFeelBetterFixture as fixture } from "@/features/simulator-devtools/fixtures/triage-2026-05-16-luisa-and-isabela-feel-better.js";
</script>

<svelte:head>
  <title>Triage 2026-05-16 — Luisa + Isabela `to: SELF`</title>
</svelte:head>

<LorcanaBrowserHarnessView {fixture} view="playerOne" />
