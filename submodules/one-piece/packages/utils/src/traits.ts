/** Exact flattened source strings verified against the official card list.
 * Each source below is https://en.onepiece-cardgame.com/cardlist/?freewords=<ID>.
 * Do not split on spaces: Former Navy and Neo Navy are single distinct types.
 */
const FLATTENED_TRAITS: Record<string, readonly string[]> = {
  // ST11-005: the English list retains the Japanese Music token; ST11-003/004 use Music.
  音楽: ["Music"],
  // OP15-065
  "Alabasta Hot Springs Island": ["Alabasta", "Hot Springs Island"],
  // OP04-003
  "Alabasta Straw Hat Crew": ["Alabasta", "Straw Hat Crew"],
  // EB02-028
  "Alabasta Whitebeard Pirates": ["Alabasta", "Whitebeard Pirates"],
  // OP17-046
  "Amazon Lily Rocks Pirates": ["Amazon Lily", "Rocks Pirates"],
  // OP04-004
  "Animal Alabasta": ["Animal", "Alabasta"],
  // OP04-010
  "Animal Alabasta Straw Hat Crew": ["Animal", "Alabasta", "Straw Hat Crew"],
  // OP09-089
  "Animal Blackbeard Pirates": ["Animal", "Blackbeard Pirates"],
  // OP07-088
  "Animal CP0": ["Animal", "CP0"],
  // OP09-054
  "Animal Cross Guild": ["Animal", "Cross Guild"],
  // OP10-069
  "Animal Dressrosa": ["Animal", "Dressrosa"],
  // OP08-010
  "Animal Drum Kingdom": ["Animal", "Drum Kingdom"],
  // OP08-001
  "Animal Drum Kingdom Straw Hat Crew": ["Animal", "Drum Kingdom", "Straw Hat Crew"],
  // OP03-035
  "Animal East Blue": ["Animal", "East Blue"],
  // OP13-030
  "Animal FILM Straw Hat Crew": ["Animal", "FILM", "Straw Hat Crew"],
  // OP02-034
  "Animal Film Straw Hat Crew": ["FILM", "Animal", "Straw Hat Crew"],
  // OP11-032
  "Animal Fish-Man Island": ["Animal", "Fish-Man Island"],
  // OP07-074
  "Animal Foxy Pirates": ["Animal", "Foxy Pirates"],
  // EB01-032
  "Animal Impel Down": ["Animal", "Impel Down"],
  // OP08-093
  "Animal Kingdom Pirates Drake Pirates Navy": ["Navy", "Drake Pirates", "Animal Kingdom Pirates"],
  // OP08-091
  "Animal Kingdom Pirates Former CP9": ["Animal Kingdom Pirates", "Former CP9"],
  // OP08-079
  "Animal Kingdom Pirates Former Rocks Pirates": ["Former Rocks Pirates", "Animal Kingdom Pirates"],
  // OP17-073
  "Animal Kingdom Pirates Hawkins Pirates": ["Animal Kingdom Pirates", "Hawkins Pirates"],
  // OP01-110
  "Animal Kingdom Pirates Land of Wano": ["Land of Wano", "Animal Kingdom Pirates"],
  // EB04-031
  "Animal Kingdom Pirates Lunarian": ["Lunarian", "Animal Kingdom Pirates"],
  // OP08-087
  "Animal Kingdom Pirates On-Air Pirates": ["Animal Kingdom Pirates", "On-Air Pirates"],
  // OP04-047
  "Animal Kingdom Pirates Plague": ["Plague", "Animal Kingdom Pirates"],
  // OP01-107
  "Animal Kingdom Pirates SMILE": ["Animal Kingdom Pirates", "SMILE"],
  // EB04-030
  "Animal Kingdom Pirates The Four Emperors": ["The Four Emperors", "Animal Kingdom Pirates"],
  // OP08-119
  "Animal Kingdom Pirates The Four Emperors Big Mom Pirates": [
    "The Four Emperors",
    "Animal Kingdom Pirates",
    "Big Mom Pirates",
  ],
  // OP07-043
  "Animal Kuja Pirates": ["Animal", "Kuja Pirates"],
  // OP12-024
  "Animal Land of Wano": ["Animal", "Land of Wano"],
  // OP16-090
  "Animal Land of Wano Straw Hat Crew": ["Animal", "Land of Wano", "Straw Hat Crew"],
  // OP14-032
  "Animal Muggy Kingdom": ["Animal", "Muggy Kingdom"],
  // OP09-012
  "Animal Red-Haired Pirates": ["Animal", "Red-Haired Pirates"],
  // OP15-071
  "Animal Sky Island": ["Animal", "Sky Island"],
  // OP08-100
  "Animal Sky Island Jaya": ["Animal", "Jaya", "Sky Island"],
  // OP01-015
  "Animal Straw Hat Crew": ["Animal", "Straw Hat Crew"],
  // OP10-087
  "Animal Straw Hat Crew Dressrosa": ["Animal", "Dressrosa", "Straw Hat Crew"],
  // EB02-003
  "Animal Straw Hat Crew Drum Kingdom": ["Animal", "Drum Kingdom", "Straw Hat Crew"],
  // OP07-103
  "Animal Straw Hat Crew Egghead": ["Animal", "Egghead", "Straw Hat Crew"],
  // OP17-084
  "Animal Straw Hat Crew Elbaph": ["Animal", "Elbaph", "Straw Hat Crew"],
  // OP09-029
  "Animal Straw Hat Crew ODYSSEY": ["ODYSSEY", "Animal", "Straw Hat Crew"],
  // OP10-014
  "Animal Straw Hat Crew Punk Hazard": ["Animal", "Punk Hazard", "Straw Hat Crew"],
  // OP15-107
  "Animal Straw Hat Crew Sky Island": ["Animal", "Sky Island", "Straw Hat Crew"],
  // EB02-007
  "Animal Straw Hat Crew Water Seven": ["Animal", "Water Seven", "Straw Hat Crew"],
  // OP03-065
  "Animal Water Seven": ["Animal", "Water Seven"],
  // OP03-030
  "Arlong Pirates East Blue": ["East Blue", "Arlong Pirates"],
  // OP07-040
  "Baroque Works The Seven Warlords of the Sea": ["The Seven Warlords of the Sea", "Baroque Works"],
  // OP09-025
  "Baroque Works The Seven Warlords of the Sea ODYSSEY": [
    "ODYSSEY",
    "The Seven Warlords of the Sea",
    "Baroque Works",
  ],
  // OP10-045
  "Beautiful Pirates Dressrosa": ["Dressrosa", "Beautiful Pirates"],
  // EB01-012
  "Beautiful Pirates Supernovas": ["Supernovas", "Beautiful Pirates"],
  // OP14-004
  "Beautiful Pirates Supernovas Dressrosa": ["Dressrosa", "Supernovas", "Beautiful Pirates"],
  // OP08-069
  "Big Mom Pirates Former Rocks Pirates": ["Former Rocks Pirates", "Big Mom Pirates"],
  // OP13-070
  "Big Mom Pirates Homies": ["Homies", "Big Mom Pirates"],
  // OP01-075
  "Biological Weapon Navy": ["Biological Weapon", "Navy"],
  // OP12-109
  "Biological Weapon Navy Egghead": ["Biological Weapon", "Egghead", "Navy"],
  // OP10-012
  "Biological Weapon Punk Hazard": ["Biological Weapon", "Punk Hazard"],
  // OP10-085
  "Blackbeard Pirates Dressrosa": ["Dressrosa", "Blackbeard Pirates"],
  // OP10-082
  "Blackbeard Pirates Former Navy": ["Former Navy", "Blackbeard Pirates"],
  // OP10-084
  "Blackbeard Pirates Giant": ["Giant", "Blackbeard Pirates"],
  // OP16-106
  "Blackbeard Pirates Giant Impel Down": ["Giant", "Impel Down", "Blackbeard Pirates"],
  // OP16-108
  "Blackbeard Pirates Impel Down": ["Impel Down", "Blackbeard Pirates"],
  // ST27-005
  "Blackbeard Pirates The Four Emperors": ["The Four Emperors", "Blackbeard Pirates"],
  // OP12-054
  "Blackbeard Pirates The Seven Warlords of the Sea": [
    "The Seven Warlords of the Sea",
    "Blackbeard Pirates",
  ],
  // EB04-002
  "Bonney Pirates Egghead": ["Egghead", "Bonney Pirates"],
  // EB03-017
  "Bonney Pirates Supernovas": ["Supernovas", "Bonney Pirates"],
  // OP15-012
  "Buggy Pirates East Blue": ["East Blue", "Buggy Pirates"],
  // OP16-048
  "Buggy Pirates Impel Down": ["Impel Down", "Buggy Pirates"],
  // ST17-003
  "Buggy's Delivery The Seven Warlords of the Sea": [
    "The Seven Warlords of the Sea",
    "Buggy's Delivery",
  ],
  // EB04-043
  "CP0 Egghead": ["Egghead", "CP0"],
  // OP09-038
  "CP9 ODYSSEY": ["ODYSSEY", "CP9"],
  // OP10-104
  "Caribou Pirates Supernovas": ["Supernovas", "Caribou Pirates"],
  // OP13-080
  "Celestial Dragons Five Elders": ["Celestial Dragons", "Five Elders"],
  // OP15-040
  "Donquixote Pirates Dressrosa": ["Dressrosa", "Donquixote Pirates"],
  // OP16-047
  "Donquixote Pirates Impel Down": ["Impel Down", "Donquixote Pirates"],
  // OP05-022
  "Donquixote Pirates Navy": ["Navy", "Donquixote Pirates"],
  // OP09-032
  "Donquixote Pirates Navy ODYSSEY": ["ODYSSEY", "Navy", "Donquixote Pirates"],
  // OP12-064
  "Donquixote Pirates Navy Punk Hazard": ["Punk Hazard", "Navy", "Donquixote Pirates"],
  // OP12-076
  "Donquixote Pirates Punk Hazard": ["Punk Hazard", "Donquixote Pirates"],
  // OP12-107
  "Donquixote Pirates The Seven Warlords of the Sea": [
    "The Seven Warlords of the Sea",
    "Donquixote Pirates",
  ],
  // OP09-031
  "Donquixote Pirates The Seven Warlords of the Sea ODYSSEY": [
    "ODYSSEY",
    "The Seven Warlords of the Sea",
    "Donquixote Pirates",
  ],
  // OP11-020
  "Drake Pirates Navy SWORD": ["Navy", "SWORD", "Drake Pirates"],
  // OP01-054
  "Drake Pirates Navy Supernovas": ["Supernovas", "Navy", "Drake Pirates"],
  // OP04-089
  "Dressrosa Barto Club": ["Dressrosa", "Barto Club"],
  // OP06-088
  "Dressrosa Happosui Army": ["Dressrosa", "Happosui Army"],
  // OP15-050
  "Dressrosa Mogaro Kingdom": ["Dressrosa", "Mogaro Kingdom"],
  // OP10-057
  "Dressrosa The Tontattas": ["The Tontattas", "Dressrosa"],
  // OP15-041
  "Dressrosa Yonta Maria Fleet": ["Dressrosa", "Yonta Maria Fleet"],
  // OP03-023
  "East Blue Alvida Pirates": ["East Blue", "Alvida Pirates"],
  // OP15-028
  "East Blue Black Cat Pirates": ["East Blue", "Black Cat Pirates"],
  // EB03-014
  "East Blue Frost Moon Village": ["East Blue", "Frost Moon Village"],
  // OP13-010
  "East Blue Neptunian": ["Neptunian", "East Blue"],
  // OP17-035
  "East Blue Straw Hat Crew": ["East Blue", "Straw Hat Crew"],
  // EB03-059
  "Egghead Seraphim": ["Seraphim", "Egghead"],
  // OP17-086
  "Elbaph Straw Hat Crew": ["Elbaph", "Straw Hat Crew"],
  // OP17-096
  "Elbaph The Four Emperors Straw Hat Crew": ["Elbaph", "The Four Emperors", "Straw Hat Crew"],
  // OP06-006
  "FILM Asuka Island": ["FILM", "Asuka Island"],
  // ST16-003
  "FILM Big Mom Pirates": ["FILM", "Big Mom Pirates"],
  // EB01-017
  "FILM CP0": ["FILM", "CP0"],
  // OP08-011
  "FILM Drum Kingdom": ["FILM", "Drum Kingdom"],
  // OP06-070
  "FILM Eldoraggo Crew": ["FILM", "Eldoraggo Crew"],
  // OP13-029
  "FILM Fish-Man Straw Hat Crew": ["Fish-Man", "FILM", "Straw Hat Crew"],
  // OP06-005
  "FILM Former Navy Gasparde Pirates": ["FILM", "Former Navy", "Gasparde Pirates"],
  // OP13-068
  "FILM Former Roger Pirates": ["FILM", "Former Roger Pirates"],
  // OP06-073
  "FILM Golden Lion Pirates": ["FILM", "Golden Lion Pirates"],
  // EB03-004
  "FILM Grantesoro": ["FILM", "Grantesoro"],
  // OP13-035
  "FILM Heart Pirates Minks": ["Minks", "FILM", "Heart Pirates"],
  // OP13-031
  "FILM Heart Pirates Supernovas": ["FILM", "Supernovas", "Heart Pirates"],
  // OP17-047
  "FILM Impel Down Golden Lion Pirates": ["FILM", "Impel Down", "Golden Lion Pirates"],
  // OP06-008
  "FILM Mugiwara Chase": ["FILM", "Mugiwara Chase"],
  // OP06-074
  "FILM Navy": ["FILM", "Navy"],
  // EB03-002
  "FILM Neo Navy": ["FILM", "Neo Navy"],
  // OP06-004
  "FILM Omatsuri Island": ["FILM", "Omatsuri Island"],
  // OP06-016
  "FILM Revolutionary Army": ["FILM", "Revolutionary Army"],
  // OP13-026
  "FILM Straw Hat Crew": ["FILM", "Straw Hat Crew"],
  // ST16-005
  "FILM Straw Hat Crew Supernovas": ["FILM", "Supernovas", "Straw Hat Crew"],
  // OP13-028
  "FILM The Four Emperors Red-Haired Pirates": ["FILM", "The Four Emperors", "Red-Haired Pirates"],
  // OP02-079
  "FILM The Pirates Fest": ["FILM", "The Pirates Fest"],
  // OP12-010
  "FILM The Pirates Fest Former Roger Pirates": [
    "FILM",
    "The Pirates Fest",
    "Former Roger Pirates",
  ],
  // OP07-021
  "Fallen Monk Pirates Supernovas": ["Supernovas", "Fallen Monk Pirates"],
  // OP15-099
  "Fallen Monk Pirates Supernovas Sky Island": ["Sky Island", "Supernovas", "Fallen Monk Pirates"],
  // OP01-011
  Film: ["FILM"],
  // OP02-033
  "Film Fish-Man Straw Hat Crew": ["FILM", "Fish-Man", "Straw Hat Crew"],
  // OP02-035
  "Film Heart Pirates Supernovas": ["FILM", "Supernovas", "Heart Pirates"],
  // OP02-072
  "Film Neo Navy": ["FILM", "Neo Navy"],
  // OP02-036
  "Film Straw Hat Crew": ["FILM", "Straw Hat Crew"],
  // OP02-043
  "Film Straw Hat Crew Supernovas": ["FILM", "Supernovas", "Straw Hat Crew"],
  // OP17-105
  "Firetank Pirates Former Big Mom Pirates": ["Firetank Pirates", "Former Big Mom Pirates"],
  // OP11-052
  "Firetank Pirates Former Rolling Pirates": ["Firetank Pirates", "Former Rolling Pirates"],
  // ST02-004
  "Firetank Pirates Supernovas": ["Supernovas", "Firetank Pirates"],
  // OP17-069
  "Fish-Man Animal Kingdom Pirates": ["Fish-Man", "Animal Kingdom Pirates"],
  // OP01-063
  "Fish-Man Arlong Pirates": ["Fish-Man", "Arlong Pirates"],
  // OP03-029
  "Fish-Man Arlong Pirates East Blue": ["Fish-Man", "East Blue", "Arlong Pirates"],
  // OP06-037
  "Fish-Man Flying Pirates": ["Fish-Man", "Flying Pirates"],
  // OP12-013
  "Fish-Man Former Arlong Pirates": ["Fish-Man", "Former Arlong Pirates"],
  // OP11-034
  "Fish-Man Former Arlong Pirates Fish-Man Island": [
    "Fish-Man",
    "Fish-Man Island",
    "Former Arlong Pirates",
  ],
  // OP07-063
  "Fish-Man Foxy Pirates": ["Fish-Man", "Foxy Pirates"],
  // EB04-033
  "Fish-Man Giant Foxy Pirates": ["Giant", "Fish-Man", "Foxy Pirates"],
  // OP02-067
  "Fish-Man Impel Down": ["Fish-Man", "Impel Down"],
  // OP17-051
  "Fish-Man Impel Down The Sun Pirates": ["Fish-Man", "Impel Down", "The Sun Pirates"],
  // OP01-037
  "Fish-Man Land of Wano The Akazaya Nine": ["Fish-Man", "Land of Wano", "The Akazaya Nine"],
  // OP06-035
  "Fish-Man New Fish-Man Pirates": ["Fish-Man", "New Fish-Man Pirates"],
  // OP15-033
  "Fish-Man New Fish-Man Pirates Fish-Man Island": [
    "Fish-Man",
    "Fish-Man Island",
    "New Fish-Man Pirates",
  ],
  // OP05-012
  "Fish-Man Revolutionary Army": ["Fish-Man", "Revolutionary Army"],
  // OP13-090
  "Fish-Man Revolutionary Army Dressrosa": ["Fish-Man", "Dressrosa", "Revolutionary Army"],
  // OP17-053
  "Fish-Man Rocks Pirates": ["Fish-Man", "Rocks Pirates"],
  // OP01-071
  "Fish-Man Straw Hat Crew": ["Fish-Man", "Straw Hat Crew"],
  // OP07-102
  "Fish-Man Straw Hat Crew Egghead": ["Fish-Man", "Egghead", "Straw Hat Crew"],
  // OP17-083
  "Fish-Man Straw Hat Crew Elbaph": ["Fish-Man", "Elbaph", "Straw Hat Crew"],
  // OP07-045
  "Fish-Man The Seven Warlords of the Sea The Sun Pirates": [
    "Fish-Man",
    "The Seven Warlords of the Sea",
    "The Sun Pirates",
  ],
  // OP07-032
  "Fish-Man The Sun Pirates": ["Fish-Man", "The Sun Pirates"],
  // OP11-035
  "Fish-Man The Sun Pirates Fish-Man Island": ["Fish-Man", "Fish-Man Island", "The Sun Pirates"],
  // OP16-046
  "Fish-Man The Sun Pirates Impel Down": ["Fish-Man", "Impel Down", "The Sun Pirates"],
  // OP13-069
  "Fish-Man Water Seven": ["Fish-Man", "Water Seven"],
  // OP08-050
  "Fish-Man Whitebeard Pirates": ["Fish-Man", "Whitebeard Pirates"],
  // OP09-046
  "Former Baroque Works Cross Guild": ["Cross Guild", "Former Baroque Works"],
  // OP03-051
  "Former Navy East Blue": ["East Blue", "Former Navy"],
  // OP01-033
  "Former Whitebeard Pirates Land of Wano": ["Land of Wano", "Former Whitebeard Pirates"],
  // OP03-059
  "Galley-La Company Water Seven": ["Water Seven", "Galley-La Company"],
  // OP10-050
  "Giant Dressrosa New Giant Pirates": ["Giant", "Dressrosa", "New Giant Pirates"],
  // OP17-119
  "Giant Elbaph": ["Giant", "Elbaph"],
  // OP17-085
  "Giant Elbaph Giant Pirates": ["Giant", "Elbaph", "Giant Pirates"],
  // OP17-081
  "Giant Elbaph New Giant Pirates": ["Giant", "Elbaph", "New Giant Pirates"],
  // OP17-089
  "Giant Former Navy Elbaph": ["Giant", "Elbaph", "Former Navy"],
  // OP11-075
  "Giant Former Navy Ohara": ["Giant", "Ohara", "Former Navy"],
  // OP02-109
  "Giant Navy": ["Giant", "Navy"],
  // OP12-050
  "Giant Navy Ohara": ["Giant", "Ohara", "Navy"],
  // OP02-061
  "Giant Revolutionary Army": ["Giant", "Revolutionary Army"],
  // OP06-083
  "Giant Thriller Bark Pirates": ["Giant", "Thriller Bark Pirates"],
  // OP16-017
  "Giant Whitebeard Pirates Allies": ["Giant", "Whitebeard Pirates Allies"],
  // OP07-011
  "Goa Kingdom Bluejam Pirates": ["Goa Kingdom", "Bluejam Pirates"],
  // OP15-048
  "Happosui Army Dressrosa": ["Dressrosa", "Happosui Army"],
  // OP10-109
  "Hawkins Pirates Supernovas": ["Supernovas", "Hawkins Pirates"],
  // OP14-012
  "Heart Pirates Minks": ["Minks", "Heart Pirates"],
  // OP16-030
  "Heart Pirates Supernovas": ["Supernovas", "Heart Pirates"],
  // OP12-106
  "Heart Pirates Supernovas Dressrosa": ["Dressrosa", "Supernovas", "Heart Pirates"],
  // OP09-030
  "Heart Pirates Supernovas ODYSSEY": ["ODYSSEY", "Supernovas", "Heart Pirates"],
  // EB04-005
  "Heart Pirates Supernovas The Seven Warlords of the Sea": [
    "The Seven Warlords of the Sea",
    "Supernovas",
    "Heart Pirates",
  ],
  // OP07-047
  "Heart Pirates The Seven Warlords of the Sea": ["The Seven Warlords of the Sea", "Heart Pirates"],
  // PRB02-002
  "Heart Pirates The Seven Warlords of the Sea Punk Hazard": [
    "Punk Hazard",
    "The Seven Warlords of the Sea",
    "Heart Pirates",
  ],
  // OP16-056
  "Impel Down Former Baroque Works": ["Impel Down", "Former Baroque Works"],
  // OP02-086
  "Impel Down Jailer Beast": ["Impel Down", "Jailer Beast"],
  // OP15-111
  "Jaya Botanist": ["Jaya", "Botanist"],
  // OP14-005
  "Kid Pirates Supernovas": ["Supernovas", "Kid Pirates"],
  // OP01-108
  "Kid Pirates Supernovas SMILE": ["Supernovas", "Kid Pirates", "SMILE"],
  // OP15-007
  "Krieg Pirates East Blue": ["East Blue", "Krieg Pirates"],
  // EB03-026
  "Kuja Pirates The Seven Warlords of the Sea": ["The Seven Warlords of the Sea", "Kuja Pirates"],
  // OP02-059
  "Kuja Pirates The Seven Warlords of the Sea Impel Down": [
    "Impel Down",
    "The Seven Warlords of the Sea",
    "Kuja Pirates",
  ],
  // OP12-029
  "Land of Wano East Blue Frost Moon Village": ["East Blue", "Frost Moon Village", "Land of Wano"],
  // OP16-085
  "Land of Wano Kouzuki Clan": ["Land of Wano", "Kouzuki Clan"],
  // OP10-083
  "Land of Wano Kouzuki Clan Dressrosa": ["Dressrosa", "Land of Wano", "Kouzuki Clan"],
  // OP10-028
  "Land of Wano Kouzuki Clan Punk Hazard": ["Punk Hazard", "Land of Wano", "Kouzuki Clan"],
  // OP13-063
  "Land of Wano Kouzuki Clan Roger Pirates": ["Land of Wano", "Kouzuki Clan", "Roger Pirates"],
  // OP17-007
  "Land of Wano Kouzuki Clan Whitebeard Pirates": [
    "Land of Wano",
    "Kouzuki Clan",
    "Whitebeard Pirates",
  ],
  // OP17-066
  "Land of Wano Kurozumi Clan": ["Land of Wano", "Kurozumi Clan"],
  // OP12-032
  "Land of Wano Minks The Akazaya Nine": ["Minks", "Land of Wano", "The Akazaya Nine"],
  // OP17-004
  "Land of Wano Minks Whitebeard Pirates": ["Minks", "Land of Wano", "Whitebeard Pirates"],
  // OP13-060
  "Land of Wano Roger Pirates": ["Land of Wano", "Roger Pirates"],
  // OP16-094
  "Land of Wano Spade Pirates": ["Land of Wano", "Spade Pirates"],
  // OP16-086
  "Land of Wano Straw Hat Crew": ["Land of Wano", "Straw Hat Crew"],
  // OP14-023
  "Land of Wano The Akazaya Nine": ["Land of Wano", "The Akazaya Nine"],
  // OP10-026
  "Land of Wano The Akazaya Nine Punk Hazard": ["Punk Hazard", "Land of Wano", "The Akazaya Nine"],
  // OP07-077
  "Land of Wano The Four Emperors": ["The Four Emperors", "Land of Wano"],
  // OP15-036
  "Land of Wano Thriller Bark Pirates": ["Land of Wano", "Thriller Bark Pirates"],
  // EB01-002
  "Land of Wano Whitebeard Pirates": ["Land of Wano", "Whitebeard Pirates"],
  // OP17-064
  "Lunarian Animal Kingdom Pirates": ["Lunarian", "Animal Kingdom Pirates"],
  // OP12-102
  "Merfolk Fish-Man Island": ["Merfolk", "Fish-Man Island"],
  // EB04-017
  "Minks Big Mom Pirates": ["Minks", "Big Mom Pirates"],
  // OP09-114
  "Minks Revolutionary Army": ["Minks", "Revolutionary Army"],
  // OP13-071
  "Minks Roger Pirates": ["Minks", "Roger Pirates"],
  // OP08-022
  "Minks The Akazaya Nine": ["Minks", "The Akazaya Nine"],
  // OP08-108
  "Monkey Mountain Alliance Jaya": ["Jaya", "Monkey Mountain Alliance"],
  // OP16-076
  "Navy Admiral": ["Admiral", "Navy"],
  // OP17-075
  "Navy Drake Pirates Animal Kingdom Pirates": ["Navy", "Drake Pirates", "Animal Kingdom Pirates"],
  // OP12-082
  "Navy Dressrosa": ["Dressrosa", "Navy"],
  // OP11-099
  "Navy East Blue": ["East Blue", "Navy"],
  // OP12-104
  "Navy Egghead": ["Egghead", "Navy"],
  // EB02-034
  "Navy Foxy Pirates": ["Navy", "Foxy Pirates"],
  // OP09-026
  "Navy ODYSSEY": ["ODYSSEY", "Navy"],
  // OP10-001
  "Navy Punk Hazard": ["Punk Hazard", "Navy"],
  // OP11-001
  "Navy SWORD": ["Navy", "SWORD"],
  // EB01-049
  "Navy Water Seven": ["Water Seven", "Navy"],
  // OP10-025
  "ODYSSEY Sky Island": ["ODYSSEY", "Sky Island"],
  // OP17-070
  "On-Air Pirates Animal Kingdom Pirates": ["On-Air Pirates", "Animal Kingdom Pirates"],
  // OP14-008
  "On-Air Pirates Supernovas": ["Supernovas", "On-Air Pirates"],
  // OP09-094
  "Peachbeard Pirates Blackbeard Pirates Allies": [
    "Peachbeard Pirates",
    "Blackbeard Pirates Allies",
  ],
  // OP10-010
  "Punk Hazard Brownbeard Pirates": ["Punk Hazard", "Brownbeard Pirates"],
  // OP01-069
  "Punk Hazard Scientist": ["Scientist", "Punk Hazard"],
  // OP12-100
  "Revolutionary Army Dressrosa": ["Dressrosa", "Revolutionary Army"],
  // EB04-054
  "Revolutionary Army Egghead": ["Egghead", "Revolutionary Army"],
  // OP02-050
  "Revolutionary Army Impel Down": ["Impel Down", "Revolutionary Army"],
  // OP09-027
  "Revolutionary Army ODYSSEY": ["ODYSSEY", "Revolutionary Army"],
  // OP02-057
  "Revolutionary Army The Seven Warlords of the Sea": [
    "The Seven Warlords of the Sea",
    "Revolutionary Army",
  ],
  // OP09-118
  "Roger Pirates King of the Pirates": ["King of the Pirates", "Roger Pirates"],
  // OP07-101
  "Scientist Egghead": ["Scientist", "Egghead"],
  // EB04-057
  "Scientist Ohara": ["Ohara", "Scientist"],
  // OP06-114
  "Sky Island Shandian Warrior": ["Sky Island", "Shandian Warrior"],
  // OP15-101
  "Sky Island Shandian Warrior Jaya": ["Jaya", "Sky Island", "Shandian Warrior"],
  // OP15-066
  "Sky Island Vassals": ["Sky Island", "Vassals"],
  // EB02-035
  "Straw Hat Crew Big Mom Pirates": ["Big Mom Pirates", "Straw Hat Crew"],
  // OP10-088
  "Straw Hat Crew Dressrosa": ["Dressrosa", "Straw Hat Crew"],
  // EB01-009
  "Straw Hat Crew Drum Kingdom": ["Drum Kingdom", "Straw Hat Crew"],
  // EB02-022
  "Straw Hat Crew East Blue": ["East Blue", "Straw Hat Crew"],
  // OP07-099
  "Straw Hat Crew Egghead": ["Egghead", "Straw Hat Crew"],
  // OP17-087
  "Straw Hat Crew Elbaph": ["Elbaph", "Straw Hat Crew"],
  // OP02-062
  "Straw Hat Crew Impel Down": ["Impel Down", "Straw Hat Crew"],
  // OP10-034
  "Straw Hat Crew ODYSSEY": ["ODYSSEY", "Straw Hat Crew"],
  // OP10-005
  "Straw Hat Crew Punk Hazard": ["Punk Hazard", "Straw Hat Crew"],
  // OP15-109
  "Straw Hat Crew Sky Island": ["Sky Island", "Straw Hat Crew"],
  // OP07-034
  "Straw Hat Crew Supernovas": ["Supernovas", "Straw Hat Crew"],
  // OP10-118
  "Straw Hat Crew Supernovas Dressrosa": ["Dressrosa", "Supernovas", "Straw Hat Crew"],
  // OP13-118
  "Straw Hat Crew Supernovas Fish-Man Island": ["Fish-Man Island", "Supernovas", "Straw Hat Crew"],
  // OP09-036
  "Straw Hat Crew Supernovas ODYSSEY": ["ODYSSEY", "Supernovas", "Straw Hat Crew"],
  // OP05-119
  "Straw Hat Crew The Four Emperors": ["The Four Emperors", "Straw Hat Crew"],
  // OP07-109
  "Straw Hat Crew The Four Emperors Egghead": ["The Four Emperors", "Egghead", "Straw Hat Crew"],
  // OP17-093
  "Straw Hat Crew The Four Emperors Elbaph": ["Elbaph", "The Four Emperors", "Straw Hat Crew"],
  // OP11-051
  "Straw Hat Crew The Vinsmoke Family": ["The Vinsmoke Family", "Straw Hat Crew"],
  // OP03-070
  "Straw Hat Crew Water Seven": ["Water Seven", "Straw Hat Crew"],
  // OP07-031
  "Supernovas Barto Club": ["Supernovas", "Barto Club"],
  // OP17-101
  "Supernovas Caribou Pirates": ["Supernovas", "Caribou Pirates"],
  // OP11-055
  "Supernovas Dressrosa": ["Dressrosa", "Supernovas"],
  // OP14-011
  "Supernovas Dressrosa Barto Club": ["Dressrosa", "Supernovas", "Barto Club"],
  // OP17-100
  "Supernovas Firetank Pirates": ["Supernovas", "Firetank Pirates"],
  // OP17-076
  "The Four Emperors Animal Kingdom Pirates": ["The Four Emperors", "Animal Kingdom Pirates"],
  // OP11-073
  "The Four Emperors Big Mom Pirates": ["The Four Emperors", "Big Mom Pirates"],
  // OP09-051
  "The Four Emperors Cross Guild": ["The Four Emperors", "Cross Guild"],
  // P-083
  "The Four Emperors Red-Haired Pirates": ["The Four Emperors", "Red-Haired Pirates"],
  // OP14-027
  "The Four Emperors Red-Haired Pirates East Blue": [
    "East Blue",
    "The Four Emperors",
    "Red-Haired Pirates",
  ],
  // OP13-042
  "The Four Emperors Whitebeard Pirates": ["The Four Emperors", "Whitebeard Pirates"],
  // OP10-024
  "The Four Emperors Whitebeard Pirates ODYSSEY": [
    "ODYSSEY",
    "The Four Emperors",
    "Whitebeard Pirates",
  ],
  // OP15-062
  "The Moon Space Pirates": ["The Moon", "Space Pirates"],
  // OP15-027
  "The Seven Warlords of the Sea East Blue": ["East Blue", "The Seven Warlords of the Sea"],
  // OP12-030
  "The Seven Warlords of the Sea Muggy Kingdom": ["Muggy Kingdom", "The Seven Warlords of the Sea"],
  // OP10-029
  "The Seven Warlords of the Sea ODYSSEY": ["ODYSSEY", "The Seven Warlords of the Sea"],
  // OP16-105
  "The Seven Warlords of the Sea Thriller Bark Pirates": [
    "The Seven Warlords of the Sea",
    "Thriller Bark Pirates",
  ],
  // OP07-020
  "The Sun Pirates Merfolk": ["Merfolk", "The Sun Pirates"],
  // OP11-024
  "The Sun Pirates Merfolk Fish-Man Island": ["Merfolk", "Fish-Man Island", "The Sun Pirates"],
  // OP06-061
  "The Vinsmoke Family GERMA 66": ["The Vinsmoke Family", "GERMA 66"],
  // OP07-061
  "The Vinsmoke Family Kingdom of GERMA": ["Kingdom of GERMA", "The Vinsmoke Family"],
  // OP07-082
  "Thriller Bark Pirates Former Rocks Pirates": ["Thriller Bark Pirates", "Former Rocks Pirates"],
  // EB03-045
  "Thriller Bark Pirates Muggy Kingdom": ["Muggy Kingdom", "Thriller Bark Pirates"],
  // OP10-036
  "Thriller Bark Pirates ODYSSEY Muggy Kingdom": [
    "ODYSSEY",
    "Muggy Kingdom",
    "Thriller Bark Pirates",
  ],
  // OP03-062
  "Water Seven Merfolk": ["Merfolk", "Water Seven"],
  // OP03-063
  "Water Seven The Franky Family": ["Water Seven", "The Franky Family"],
  // OP16-049
  "Whitebeard Pirates Impel Down": ["Impel Down", "Whitebeard Pirates"],
  // OP09-035
  "Whitebeard Pirates ODYSSEY": ["ODYSSEY", "Whitebeard Pirates"],
};

/** Per-card source corrections verified from canonical official card-list rows. */
const VERIFIED_CARD_TRAITS: Record<string, readonly string[]> = {
  "EB01-036": ["Impel Down", "Jailer Beast"],
  "EB03-034": ["Rocks Pirates"],
  "OP01-008": ["Supernovas", "Beautiful Pirates"],
  "OP01-018": ["Giant", "New Giant Pirates"],
  "OP01-019": ["Supernovas", "Barto Club"],
  "OP01-034": ["Minks", "Land of Wano", "The Akazaya Nine"],
  "OP02-040": ["FILM", "Straw Hat Crew"],
  "OP02-041": ["FILM", "Supernovas", "Straw Hat Crew"],
  "OP03-036": ["East Blue", "Black Cat Pirates"],
  "OP03-038": ["East Blue", "Krieg Pirates"],
  "OP03-114": ["The Four Emperors", "Big Mom Pirates"],
  "OP05-040": ["Donquixote Pirates"],
  "OP07-004": ["Mountain Bandits"],
  "OP07-009": ["Mountain Bandits"],
  "OP10-064": ["Kingdom of GERMA"],
  "OP11-031": ["Fish-Man", "Fish-Man Island", "The Sun Pirates"],
  "OP13-009": ["Mountain Bandits"],
  "OP13-013": ["Mountain Bandits"],
  "OP15-015": ["East Blue", "Mountain Bandits"],
  "OP16-003": ["The Four Emperors", "Whitebeard Pirates"],
  "P-014": ["FILM", "Navy"],
  "P-029": ["FILM", "Supernovas", "Barto Club"],
};

// Existing catalog printing ownership; unknown suffixes are not inferred.
const VERIFIED_TRAIT_PRINTINGS: Record<string, string> = {
  "EB03-034_p1": "EB03-034",
  "OP01-034_p1": "OP01-034",
  "OP02-041_p1": "OP02-041",
  "OP03-114_p1": "OP03-114",
  "OP03-114_p2": "OP03-114",
  "OP11-031_p1": "OP11-031",
  "OP16-003_p1": "OP16-003",
  "P-014_p3": "P-014",
  "P-014_r1": "P-014",
  "P-029_p4": "P-029",
  "P-029_r2": "P-029",
};

export function normalizeTraits(traits: readonly string[], canonicalId?: string): string[] {
  const rulesId = canonicalId && (VERIFIED_TRAIT_PRINTINGS[canonicalId] ?? canonicalId);
  if (rulesId && VERIFIED_CARD_TRAITS[rulesId]) return [...VERIFIED_CARD_TRAITS[rulesId]!];
  return [
    ...new Set(
      traits.flatMap((trait) =>
        trait.split(/[;,/]/).flatMap((part) => {
          const trimmed = part.trim();
          return FLATTENED_TRAITS[trimmed] ?? (trimmed ? [trimmed] : []);
        }),
      ),
    ),
  ];
}

export function matchesTrait(
  traits: readonly string[],
  expected: string,
  match: "exact" | "includes" = "exact",
): boolean {
  return normalizeTraits(traits).some((trait) =>
    match === "includes" ? trait.includes(expected) : trait === expected,
  );
}
