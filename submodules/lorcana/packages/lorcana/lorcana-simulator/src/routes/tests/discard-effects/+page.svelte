<script lang="ts">
import LorcanaBrowserHarnessView from "@/features/simulator-devtools/harness/LorcanaBrowserHarnessView.svelte";
import { discardEffectsFixture as fixture } from "@/features/simulator-devtools/fixtures/discard-effects.js";

</script>

<svelte:head>
  <title>Discard Effects Test</title>
</svelte:head>

<LorcanaBrowserHarnessView {fixture} view="playerOne" />

