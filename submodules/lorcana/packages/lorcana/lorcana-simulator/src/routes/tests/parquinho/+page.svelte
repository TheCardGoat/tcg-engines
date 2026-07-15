<script lang="ts">
    import { createFixture } from "@/features/simulator-devtools/fixtures/fixture-factory";
    import LorcanaBrowserHarnessView from "@/features/simulator-devtools/harness/LorcanaBrowserHarnessView.svelte";

    import {
        donaldDuckBoisterousFowl, hakunaMatata, letItGo, maximusPalaceHorse,
        mickeyMouseTrueFriend, suddenChill,
    } from "@tcg/lorcana-cards/cards/001";
    import { divebomb, lastditchEffort } from "@tcg/lorcana-cards/cards/003";
    import {
        aliceSavvySailor,
        liloEscapeArtist,
        loseTheWay,
        mauiHalfshark,
        tianaRestaurantOwner
    } from "@tcg/lorcana-cards/cards/006";
    import {
        donaldDuckAlongForTheRide,
        grandmotherWillowAncientAdvisorEpic, lonelyGrave, olafSnowmanOfAction, wreckitRalphRagingWrecker,
    } from "@tcg/lorcana-cards/cards/011";
    import {
        daisyDuckDonaldsDate, kuzcoSelfishEmperor,
        merlinBackFromBermuda,
        merlinIntellectualVisionary
    } from "@tcg/lorcana-cards/cards/005";
    import {
        donaldDuckCoinCollector, downInNewOrleans,
        jasmineSteadyStrategist,
        jasmineSteadyStrategistEnchanted
    } from "@tcg/lorcana-cards/cards/008";
    import {donaldDuckBuccaneer} from "@tcg/lorcana-cards/cards/004";
    import {circleOfLife, cursedMerfolkUrsulasHandiwork} from "@tcg/lorcana-cards/cards/009";
    import {annaIceBreaker} from "@tcg/lorcana-cards/cards/007";

    const fixture = createFixture({
        id: "parquinho",
        name: "Parquinho",
        description: "Arquivo usado para testar coisas. Basicamente um cenário de test de propósito geral.",
        playerOne: {
            inkwell: 5,
            hand: [olafSnowmanOfAction, merlinIntellectualVisionary, letItGo, downInNewOrleans,
                annaIceBreaker,
            ],
            play: [
                mauiHalfshark,
                aliceSavvySailor,
                merlinBackFromBermuda,
                wreckitRalphRagingWrecker,
                lonelyGrave,
                grandmotherWillowAncientAdvisorEpic
            ],
            discard: [circleOfLife, hakunaMatata,
                liloEscapeArtist

            ],
            deck: [donaldDuckAlongForTheRide, divebomb, loseTheWay,maximusPalaceHorse, lastditchEffort, mickeyMouseTrueFriend, kuzcoSelfishEmperor],
        },
        playerTwo: {
            play: [
                daisyDuckDonaldsDate,
                daisyDuckDonaldsDate,
                jasmineSteadyStrategist,
                {card: tianaRestaurantOwner, exerted: true},
                {card: cursedMerfolkUrsulasHandiwork, exerted: true},
            ],
            inkwell: 2,
            hand: [donaldDuckBoisterousFowl],
            deck: [donaldDuckCoinCollector, suddenChill, donaldDuckBuccaneer]
        },
        skipPreGame: true,
    });
</script>

<LorcanaBrowserHarnessView {fixture} view="playerOne" />
