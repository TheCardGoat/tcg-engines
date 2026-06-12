<script lang="ts">
import LorcanaBrowserHarnessView from "@/features/simulator-devtools/harness/LorcanaBrowserHarnessView.svelte";
import { triage20260505MufasaBogoRevealPlayFixture as fixture } from "@/features/simulator-devtools/fixtures/triage-2026-05-05-mufasa-bogo-reveal-play.js";
</script>

<svelte:head>
  <title>Triage 2026-05-05 — Mufasa and Chief Bogo reveal play</title>
</svelte:head>

<LorcanaBrowserHarnessView {fixture} view="playerOne" />
