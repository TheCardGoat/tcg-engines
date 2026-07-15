<script lang="ts">
import LorcanaBrowserHarnessView from "@/features/simulator-devtools/harness/LorcanaBrowserHarnessView.svelte";
import { multipleTriggers as fixture } from "@/features/simulator-devtools/fixtures/multiple-triggers.js";
</script>

<LorcanaBrowserHarnessView {fixture} view="playerOne" />
