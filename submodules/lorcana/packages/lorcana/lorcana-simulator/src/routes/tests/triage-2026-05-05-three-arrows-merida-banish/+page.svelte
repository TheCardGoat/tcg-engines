<script lang="ts">
import LorcanaBrowserHarnessView from "@/features/simulator-devtools/harness/LorcanaBrowserHarnessView.svelte";
import { triage20260505ThreeArrowsMeridaBanishFixture as fixture } from "@/features/simulator-devtools/fixtures/triage-2026-05-05-three-arrows-merida-banish.js";
</script>

<svelte:head>
  <title>Triage 2026-05-05 — Three Arrows + Merida banish</title>
</svelte:head>

<LorcanaBrowserHarnessView {fixture} view="playerOne" />
