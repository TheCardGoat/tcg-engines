<script lang="ts">
import LorcanaBrowserHarnessView from "@/features/simulator-devtools/harness/LorcanaBrowserHarnessView.svelte";
import { moveDamageFixture as fixture } from "@/features/simulator-devtools/fixtures/move-damage.js";
</script>

<svelte:head>
  <title>Move Damage Effects Test</title>
</svelte:head>

<LorcanaBrowserHarnessView {fixture} view="playerOne" />
