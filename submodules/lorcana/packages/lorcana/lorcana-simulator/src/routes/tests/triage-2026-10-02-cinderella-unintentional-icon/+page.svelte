<script lang="ts">
import LorcanaBrowserHarnessView from "@/features/simulator-devtools/harness/LorcanaBrowserHarnessView.svelte";
import { triageCinderellaUnintentionalIconFixture as fixture } from "@/features/simulator-devtools/fixtures/regressions/2026-10-02/cinderella-unintentional-icon.js";
</script>

<LorcanaBrowserHarnessView {fixture} view="playerOne" />
