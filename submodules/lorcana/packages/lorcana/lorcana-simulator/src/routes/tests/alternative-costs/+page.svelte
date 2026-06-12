<script lang="ts">
import LorcanaBrowserHarnessView from "@/features/simulator-devtools/harness/LorcanaBrowserHarnessView.svelte";
import { alternativeCostsFixture as fixture } from "@/features/simulator-devtools/fixtures/alternative-costs.js";
</script>

<LorcanaBrowserHarnessView {fixture} view="playerOne" />
