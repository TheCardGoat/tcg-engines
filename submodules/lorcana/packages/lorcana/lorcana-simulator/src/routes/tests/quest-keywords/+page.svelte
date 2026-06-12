<script lang="ts">
import LorcanaBrowserHarnessView from "@/features/simulator-devtools/harness/LorcanaBrowserHarnessView.svelte";
import { questKeywordsFixture as fixture } from "@/features/simulator-devtools/fixtures/quest-keywords.js";
</script>

<LorcanaBrowserHarnessView {fixture} view="playerOne" />
