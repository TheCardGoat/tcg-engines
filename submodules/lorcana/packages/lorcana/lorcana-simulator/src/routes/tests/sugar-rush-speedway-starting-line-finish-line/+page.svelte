<script lang="ts">
import LorcanaBrowserHarnessView from "@/features/simulator-devtools/harness/LorcanaBrowserHarnessView.svelte";
import { sugarRushSpeedwayStartingLineFinishLineFixture as fixture } from "@/features/simulator-devtools/fixtures/sugar-rush-speedway-starting-line-finish-line.js";
</script>

<svelte:head>
  <title>Sugar Rush Speedway Starting Line to Finish Line Test</title>
</svelte:head>

<LorcanaBrowserHarnessView {fixture} view="playerOne" />
