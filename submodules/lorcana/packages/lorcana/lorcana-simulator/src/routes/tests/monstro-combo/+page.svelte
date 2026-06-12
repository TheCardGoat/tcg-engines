<script lang="ts">
  import { monstroComboFixture as fixture } from "@/features/simulator-devtools/fixtures/monstro-combo.js";
  import LorcanaBrowserHarnessView from "@/features/simulator-devtools/harness/LorcanaBrowserHarnessView.svelte";
</script>

<LorcanaBrowserHarnessView {fixture} view="playerOne" />
