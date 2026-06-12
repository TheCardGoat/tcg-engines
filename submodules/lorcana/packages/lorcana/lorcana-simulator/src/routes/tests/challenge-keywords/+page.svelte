<script lang="ts">
import LorcanaBrowserHarnessView from "@/features/simulator-devtools/harness/LorcanaBrowserHarnessView.svelte";
import { challengeKeywordsFixture as fixture } from "@/features/simulator-devtools/fixtures/challenge-keywords.js";
</script>

<LorcanaBrowserHarnessView {fixture} view="playerOne" />
