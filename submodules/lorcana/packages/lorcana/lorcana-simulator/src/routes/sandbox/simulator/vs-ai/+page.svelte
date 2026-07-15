<script lang="ts">
  import { goto } from "$app/navigation";
  import HumanVsAiSetupPage from "@/features/simulator-devtools/vs-ai/HumanVsAiSetupPage.svelte";
</script>

<HumanVsAiSetupPage onNavigateToMatch={(path) => goto(path)} />
