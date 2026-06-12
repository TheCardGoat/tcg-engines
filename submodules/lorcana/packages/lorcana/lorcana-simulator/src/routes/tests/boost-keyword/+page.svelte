<script lang="ts">
import LorcanaBrowserHarnessView from "@/features/simulator-devtools/harness/LorcanaBrowserHarnessView.svelte";
import { boostKeywordFixture as fixture } from "@/features/simulator-devtools/fixtures/boost-keyword.js";
</script>

<LorcanaBrowserHarnessView {fixture} view="playerOne" />
