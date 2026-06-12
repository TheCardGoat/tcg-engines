<script lang="ts">
  import LorcanaBrowserHarnessView from "@/features/simulator-devtools/harness/LorcanaBrowserHarnessView.svelte";
  import { preGameFixture } from "@/features/simulator-devtools/fixtures/pre-game";
  const fixture = preGameFixture;
</script>

<LorcanaBrowserHarnessView {fixture} view="playerOne" />
