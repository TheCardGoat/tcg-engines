<script lang="ts">
import LorcanaBrowserHarnessView from "@/features/simulator-devtools/harness/LorcanaBrowserHarnessView.svelte";
import { defensiveKeywordsFixture as fixture } from "@/features/simulator-devtools/fixtures/defensive-keywords.js";
</script>

<LorcanaBrowserHarnessView {fixture} view="playerOne" />
