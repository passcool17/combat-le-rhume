export const JOURNAL_KEY = `remedes-naturels-journal-v1`;

export const PREFS_KEY = `remedes-naturels-prefs-v1`;

export const PROTOCOLE_DU_JOUR = [
  {
    id: `tot`,
    title: `Frapper fort`,
    detail: `Dès le mal de gorge : 1. spray povidone-iode 0,45 % · 2. peroxyde 3 % Food Grade · 3. pastilles antiseptiques · 4. miel.`,
  },
  {
    id: `hydratation`,
    title: `Hydratation`,
    detail: `2,5 à 3 litres par jour, eau et tisanes. Boire régulièrement, même sans soif.`,
  },
  {
    id: `repos`,
    title: `Au chaud la nuit`,
    detail: `Double couverture, bas, bonnet : garder toute la chaleur de ton corps. Seulement s’il n’y a pas de fièvre, de mal de tête ou de frissons. Arrête si tu as trop chaud ou si tu te sens moins bien.`,
  },
  {
    id: `immunite`,
    title: `Vitamine D`,
    detail: `En priorité. Un supplément est souvent recommandé au Québec en automne et en hiver : demande conseil à ton pharmacien ou à ton médecin. Adulte : 1 000 à 2 000 UI tous les jours (pas de grosses doses espacées), plafond 4 000 UI. En phase aiguë : zinc en pastilles et vitamine C 2 g par jour (voir les fiches).`,
  },
  {
    id: `cibles`,
    title: `Remèdes ciblés`,
    detail: `Selon les symptômes : échinacée, sureau, aiguilles de pin, ail-vinaigre-miel, inhalations.`,
  },
  {
    id: `alimentation`,
    title: `Alimentation`,
    detail: `Anti-inflammatoire : ail, oignon, gingembre, curcuma, bouillons. Éviter l’alcool et le sucre en excès.`,
  },
];

export const PILIERS_SOUTIEN = [
  {
    title: `Infusions & plantes`,
    detail: `Gingembre, thym, sureau, aiguilles de pin, échinacée — les bases végétales.`,
  },
  {
    title: `Soutien ciblé`,
    detail: `Vitamine D d’abord, surtout l’automne et l’hiver au Québec. Zinc et vitamine C pendant la maladie, avec la quercétine (500 mg 2 fois par jour, adulte), mélange ail-vinaigre-miel. Argent colloïdal : en gargarisme ou dans le nez seulement (environ 15 ppm, adulte), jamais avalé.`,
  },
  {
    title: `Hydratation & repos`,
    detail: `Eau, tisanes, et une nuit au chaud si tu es confortable.`,
  },
];

export const PHASES = [
  {
    id: `debut`,
    label: `Premiers signes`,
    lines: [
      `Vitamine D en priorité, surtout l’automne et l’hiver au Québec.`,
      `Zinc en pastilles dans les 24 heures des premiers symptômes (adulte : voir la fiche Zinc).`,
      `Sureau ou échinacée, démarrés tout de suite.`,
      `Vitamine C en 2 à 3 prises dans la journée, et se coucher tôt.`,
    ],
    filter: `fievre`,
  },
  {
    id: `aigu`,
    label: `Phase aiguë`,
    lines: [
      `Protocole complet : boire, dormir, rester au chaud.`,
      `Tisanes (pin, thym, gingembre) et mélange ail-vinaigre-miel au réveil.`,
      `Lavages de nez à l’eau salée.`,
    ],
    filter: `tous`,
  },
  {
    id: `convalescence`,
    label: `Convalescence`,
    lines: [
      `Repas simples, bouillons, aliments fermentés ou probiotiques.`,
      `Ne pas reprendre le rythme d’un coup. Le sommeil reste prioritaire.`,
      `Échinacée : jusqu’à 10 jours.`,
    ],
    filter: `tous`,
  },
];

export const SYMPTOMES_PROTOCOLE = [
  {
    id: `fievre`,
    label: `Fièvre`,
  },
  {
    id: `toux`,
    label: `Toux`,
  },
  {
    id: `congestion`,
    label: `Congestion`,
  },
  {
    id: `gorge`,
    label: `Mal de gorge`,
  },
  {
    id: `fatigue`,
    label: `Fatigue`,
  },
];

export const SYMPTOMES = [
  {
    id: `nez-bouche`,
    label: `Nez bouché`,
    title: `Nez bouché / congestion`,
    tips: [
      {
        lead: `Inhalation vapeur`,
        detail: `Bol d’eau très chaude + 2 à 3 gouttes d’eucalyptus radiata. Respirer 5 à 10 minutes sous une serviette, 2 à 3 fois par jour.`,
      },
      {
        lead: `Tisane d’aiguilles de pin`,
        detail: `2 à 3 tasses par jour.`,
        prepId: `pin`,
      },
      {
        lead: `Zinc`,
        detail: `En pastilles, dans les 24 heures des premiers symptômes (adulte : voir la fiche Zinc).`,
      },
      {
        lead: `Lavage nasal`,
        detail: `Solution saline : ½ à 1 c. à café de sel dans 250 ml d’eau tiède, bouillie ou filtrée, jusqu’à 6 fois par jour les 2 premiers jours. Peroxyde dans le nez : jamais pur, seulement la recette « La plus forte » (adulte).`,
        prepId: `sinus`,
      },
    ],
  },
  {
    id: `ecoulements`,
    label: `Écoulements`,
    title: `Écoulements / rhinorrhée`,
    tips: [
      {
        lead: `Zinc`,
        detail: `En pastilles, dès les premières heures (adulte : voir la fiche Zinc).`,
      },
      {
        lead: `Vitamine C`,
        detail: `Adulte : 1 g par jour en soutien ; 2 g par jour en 2 à 3 prises dès les premiers symptômes. Pas plus de 2 g par jour.`,
      },
      {
        lead: `Échinacée`,
        detail: `Selon l’étiquette, prises augmentées pendant le rhume ou la grippe, jusqu’à 10 jours.`,
      },
      {
        lead: `Produits laitiers`,
        detail: `Les éviter temporairement s’ils aggravent les sécrétions.`,
      },
      {
        lead: `Hydratation`,
        detail: `Boire abondamment, toute la journée.`,
      },
    ],
  },
  {
    id: `mal-gorge`,
    label: `Mal de gorge`,
    title: `Mal de gorge`,
    tips: [
      {
        lead: `Gargarisme eau salée`,
        detail: `½ c. à café de sel dans un verre d’eau tiède, 3 à 4 fois par jour, et jusqu’à 6 fois par jour les 2 premiers jours.`,
      },
      {
        lead: `Mélange ail-vinaigre-miel`,
        detail: `1 c. à soupe diluée, 1 à 2 fois par jour.`,
        prepId: `ail`,
      },
      {
        lead: `Miel`,
        detail: `1 c. à soupe de miel seul, plusieurs fois par jour. Jamais d’ustensile en métal.`,
      },
      {
        lead: `Tisane sauge ou thym`,
        detail: `2 à 3 tasses.`,
      },
      {
        lead: `Gargarisme au peroxyde`,
        detail: `1 c. à soupe de peroxyde 3 % Food Grade + 1 c. à soupe d’eau. 30 s en bouche + 30 s en gorge, puis recracher. 3 fois par jour, jusqu’à 5 jours. Ne jamais avaler. Garder la bouteille à l’abri du soleil.`,
      },
      {
        lead: `Oreilles`,
        detail: `Peroxyde dans les oreilles : prudence. Jamais si le tympan est perforé, s’il y a un tube (drain), une douleur ou un écoulement. Même mélange que le gargarisme : 1 c. à soupe de peroxyde 3 % Food Grade + 1 c. à soupe d’eau (50/50), quelques gouttes dans chaque oreille. Laisser agir 5 minutes maximum, ou avant si étourdissement : arrêter dès qu’un étourdissement apparaît. Puis pencher la tête pour vider. Demande d’abord conseil à un pharmacien.`,
      },
    ],
  },
  {
    id: `toux`,
    label: `Toux`,
    title: `Toux`,
    tips: [
      {
        lead: `Sirop de thym et miel`,
        detail: `1 c. à café, 3 à 4 fois par jour.`,
        prepId: `thym`,
      },
      {
        lead: `Tisane`,
        detail: `Aiguilles de pin ou thym, 2 à 3 tasses.`,
        prepId: `pin`,
      },
      {
        lead: `Miel au coucher`,
        detail: `1 c. à soupe de miel seul, 30 min avant le coucher. Enfant de 1 à 5 ans : 2 c. à thé. Jamais avant 1 an.`,
      },
      {
        lead: `Air et voix`,
        detail: `Repos vocal et humidification de l’air.`,
      },
      {
        lead: `Irritants`,
        detail: `Éviter la fumée et l’air trop sec.`,
      },
    ],
  },
  {
    id: `fievre`,
    label: `Fièvre`,
    title: `Fièvre`,
    tips: [
      {
        lead: `Repos total`,
        detail: `Sommeil prioritaire. En cas de fièvre, de mal de tête ou de frissons, ne pas forcer le bonnet ni la surchauffe.`,
      },
      {
        lead: `Hydratation`,
        detail: `Eau, tisanes, bouillons : au moins 2,5 à 3 litres.`,
      },
      {
        lead: `Sureau ou échinacée`,
        detail: `Sureau (adulte) : 1 c. à soupe 4 fois par jour pendant 5 jours, dans les 48 premières heures. Échinacée : selon l’étiquette.`,
      },
      {
        lead: `Surveiller`,
        detail: `Prendre la température. Adapter ou arrêter le protocole si le mal de tête devient intense ou si les frissons sont importants.`,
      },
      {
        lead: `Efforts`,
        detail: `Aucun effort physique pendant la fièvre.`,
      },
    ],
  },
  {
    id: `fatigue`,
    label: `Fatigue`,
    title: `Fatigue`,
    tips: [
      {
        lead: `Repos`,
        detail: `8 à 10 heures de sommeil, plus des siestes si possible.`,
      },
      {
        lead: `Vitamine D`,
        detail: `Adulte : 1 000 à 2 000 UI tous les jours en hiver, plafond 4 000 UI.`,
      },
      {
        lead: `Zinc et vitamine C`,
        detail: `En soutien, aux doses du protocole.`,
      },
      {
        lead: `Mélange ail-vinaigre-miel`,
        detail: `1 c. à soupe au réveil.`,
        prepId: `ail`,
      },
      {
        lead: `Repas`,
        detail: `Alimentation légère, mais nourrissante.`,
      },
    ],
  },
  {
    id: `courbatures`,
    label: `Courbatures`,
    title: `Courbatures`,
    tips: [
      {
        lead: `Chaleur douce`,
        detail: `Repos, bain chaud ou bouillotte.`,
      },
      {
        lead: `Magnésium`,
        detail: `200 à 350 mg le soir, si besoin. Pas plus de 350 mg en supplément.`,
      },
      {
        lead: `Vitamine C et curcuma`,
        detail: `Curcuma avec un peu de poivre noir.`,
      },
      {
        lead: `Hydratation`,
        detail: `Boire davantage que d’habitude.`,
      },
      {
        lead: `Efforts`,
        detail: `Éviter le sport intense jusqu’au retour de la forme.`,
      },
    ],
  },
  {
    id: `maux-tete`,
    label: `Maux de tête`,
    title: `Maux de tête`,
    tips: [
      {
        lead: `Hydratation`,
        detail: `Souvent lié à un manque d’eau. Boire régulièrement.`,
      },
      {
        lead: `Pièce calme`,
        detail: `Repos dans une pièce sombre, sans bruit.`,
      },
      {
        lead: `Tisane`,
        detail: `Gingembre ou menthe, 2 à 3 tasses.`,
        prepId: `gingembre`,
      },
      {
        lead: `Compression`,
        detail: `Froide ou chaude, selon ce qui soulage.`,
      },
      {
        lead: `Écrans`,
        detail: `Limiter les écrans et le bruit.`,
      },
    ],
  },
];

export const REMEDES = [
  {
    id: `ail`,
    name: `Ail, vinaigre de cidre et miel`,
    kicker: `Mélange de base`,
    topics: [`fievre`, `gorge`],
    how: `1 à 2 c. à soupe au réveil, dilué dans un peu d’eau tiède si besoin. Maximum 2 fois par jour.`,
    extra: [
      `Pendant la phase aiguë, 5 à 10 jours.`,
      `Option : ail vieilli en gélules (2,56 g par jour dans une étude), selon l’étiquette.`,
      `Recette complète dans Préparations.`,
    ],
    tag: `Immunité · rhume · grippe`,
  },
  {
    id: `echinacee`,
    name: `Échinacée`,
    kicker: `Dès les premiers signes`,
    topics: [`fievre`],
    how: `Tisane, 1 à 2 tasses par jour, ou extrait selon l’étiquette, avec des prises augmentées pendant le rhume ou la grippe. Commencer dès les premiers symptômes.`,
    extra: [
      `Jusqu’à 10 jours.`,
      `Extrait standardisé d’Echinacea purpurea (plante fraîche), dès les premiers symptômes et jusqu’à 10 jours : environ 4 000 mg d’extrait par jour en plusieurs prises (type Echinaforce), ou Echinilin : 10 doses le 1er jour, puis 4 doses par jour pendant 7 jours. Suivre l’étiquette du produit.`,
      `En prévention pendant la saison : 2 400 mg par jour, en cycles de 2 mois séparés par 1 semaine de pause.`,
      `Dans les essais, l’extrait standardisé réduit le nombre de rhumes et leur durée, chez l’adulte comme chez l’enfant.`,
    ],
    securite: [
      `Allergie aux Astéracées (herbe à poux, marguerite, camomille, chrysanthème) : ne pas en prendre. Asthme, eczéma ou rhume des foins : risque de réaction allergique, demande avis avant.`,
      `Maladie auto-immune (comme la sclérose en plaques), tuberculose, VIH ou autre baisse de l’immunité, ou médicaments immunosuppresseurs : pas sans avis médical.`,
      `Enfants : la partie aérienne dès 2 ans, la racine pas avant 12 ans (Santé Canada). De 4 à 12 ans, en prévention : Echinaforce Junior sur avis médical.`,
      `Grossesse : en parler à un professionnel de la santé avant. Peu de données pour l’allaitement.`,
      `Durée : jusqu’à 10 jours en traitement ; en prévention, cycles de 2 mois avec pause. Consulte si les symptômes durent plus de 10 jours, s’aggravent ou si une forte fièvre apparaît.`,
      `Effets possibles : maux de ventre, nausées, éruption de la peau. Arrête en cas de réaction allergique.`,
    ],
    tag: `Immunité · prévention`,
  },
  {
    id: `gingembre`,
    name: `Gingembre`,
    kicker: `Gorge · toux`,
    topics: [`gorge`, `toux`],
    how: `Tisane : 5 à 10 g de racine fraîche râpée (2 à 4 cm), infusée 10 minutes dans 250 ml d’eau chaude, 2 à 3 tasses par jour. Ou 1,5 g de gingembre en poudre ou en capsule, 2 fois par jour.`,
    extra: [
      `Maximum 3 g de racine séchée par jour. À partir de 6 ans.`,
      `Le gingembre détend les muscles des voies respiratoires, calme la toux chez l’animal et freine en laboratoire le virus respiratoire syncytial (VRS).`,
      `Recette de tisane dans Préparations.`,
    ],
    securite: [
      `Anticoagulants (comme la warfarine) ou antiplaquettaires (comme l’aspirine ou le clopidogrel) : risque de saignement, demande au pharmacien avant d’en prendre en supplément.`,
      `Calculs biliaires : seulement après avis médical.`,
      `Grossesse : en parler à un professionnel de la santé avant de prendre des suppléments. Peu de données pour l’allaitement.`,
      `Médicaments du diabète ou de la tension : le gingembre peut renforcer leur effet. Surveille et demande au pharmacien.`,
      `Effets possibles : brûlures d’estomac, inconfort au ventre, diarrhée, irritation de la bouche ou de la gorge.`,
    ],
    tag: `Gorge · toux · tisane`,
  },
  {
    id: `pin`,
    name: `Aiguilles de pin`,
    kicker: `Vitamine C végétale`,
    topics: [`toux`, `congestion`],
    how: `Tisane, 2 à 3 tasses par jour. Riche en vitamine C naturelle et en antioxydants.`,
    extra: [
      `Choisir des aiguilles fraîches, bien rincées, sur des pins non traités.`,
    ],
    tag: `Vitamine C · congestion`,
  },
  {
    id: `lavage`,
    name: `Lavage nasal`,
    kicker: `Congestion`,
    topics: [`congestion`],
    how: `Solution saline : jusqu’à 6 fois par jour les 2 premiers jours, puis 1 à 3 fois par jour. Tête penchée, respirer par la bouche, ne pas forcer.`,
    extra: [
      `Les recettes sont dans les préparations. Peroxyde dans le nez : jamais pur, seulement la recette « La plus forte » (adulte).`,
    ],
    tag: `Nez · sinus`,
  },
  {
    id: `zinc`,
    name: `Zinc`,
    kicker: `Les 24 premières heures`,
    topics: [`fievre`, `gorge`],
    adulteSeulement: true,
    how: `Dose des études : pastilles de zinc d’environ 13 mg, 1 pastille toutes les 2 à 3 heures éveillé (≈ 75 à 90 mg par jour), dans les 24 heures des premiers symptômes. 5 à 7 jours maximum. Adulte seulement.`,
    avertissement: [
      `Dépasse la limite usuelle de 40 mg par jour : seulement pour une courte durée (5 à 7 jours maximum).`,
      `Peut causer nausées et goût métallique. Carence en cuivre si prolongé.`,
      `Jamais plus de 100 mg par jour : aucun bénéfice de plus.`,
      `Demande avis au pharmacien si tu prends des médicaments ou en cas de grossesse.`,
      `Jamais de zinc dans le nez (spray ou gel nasal) : risque de perte de l’odorat.`,
    ],
    extra: [
      `Les pastilles sont utiles pour le mal de gorge.`,
    ],
    extraEnfant: [`Jamais de zinc dans le nez (spray ou gel nasal).`],
    cuivre: `Cure courte (5 à 7 jours) : le zinc à forte dose bloque l’absorption du cuivre seulement s’il est pris pendant des semaines. Ensuite, mange des aliments riches en cuivre (fruits de mer, graines et noix, abats, céréales de son, grains entiers et chocolat).`,
    tag: `Immunité · premiers symptômes`,
  },
  {
    id: `quercetine`,
    name: `Quercétine`,
    kicker: `Avec le zinc · adulte`,
    topics: [`fievre`, `gorge`],
    caution: true,
    adulteSeulement: true,
    how: `Dose des études : 500 mg de quercétine, 2 fois par jour avec un repas (1 000 mg par jour), en même temps que les pastilles de zinc, pendant 5 à 7 jours. Adulte seulement.`,
    extra: [
      `Avec le zinc : la quercétine aide le zinc à entrer dans les cellules (démontré en laboratoire).`,
      `Souvent vendue avec de la vitamine C et de la bromélaïne, qui aident son absorption. La forme phytosome est jusqu’à 20 fois mieux absorbée.`,
      `En prévention (hiver, efforts intenses) : même dose, jusqu’à 12 semaines.`,
      `Aliments riches en quercétine : oignons, pommes, thé noir ou vert, agrumes, raisins rouges, cerises, framboises.`,
    ],
    securite: [
      `Pas plus de 600 mg par prise ni 1 200 mg par jour, avec un repas. Au-delà de 12 semaines, demande avis (Santé Canada).`,
      `Pas si tu as un problème de reins : la quercétine pourrait l’aggraver.`,
      `Peut interagir avec certains antibiotiques (quinolones), la cyclosporine, les anticoagulants comme la warfarine et d’autres médicaments. Si tu prends des médicaments, demande au pharmacien.`,
      `Adulte seulement (dose établie pour 18 ans et plus). Pas pendant la grossesse ni l’allaitement.`,
    ],
    tag: `Avec le zinc · adulte`,
  },
  {
    id: `nac`,
    name: `NAC (N‑acétylcystéine)`,
    kicker: `Saison des rhumes et grippes · adulte`,
    topics: [`fievre`, `toux`],
    caution: true,
    adulteSeulement: true,
    how: `600 mg de NAC, 1 à 2 fois par jour avec un repas, pendant la saison des rhumes et grippes. Adulte seulement.`,
    extra: [
      `Essai De Flora 1997 (262 personnes âgées, 6 mois d’hiver) : 600 mg 2 fois par jour. Parmi les personnes infectées par la grippe, 25 % ont eu des symptômes avec la NAC contre 79 % avec le placebo.`,
      `Au Canada, pour plus de 600 mg par jour (adulte de 18 ans et plus) : passe par un pharmacien ou un médecin.`,
      `La NAC aide aussi à rendre le mucus plus fluide. Comprimé effervescent : bien le dissoudre dans un demi-verre d’eau avant de boire.`,
    ],
    securite: [
      `Asthme : la NAC peut déclencher un bronchospasme. Arrête tout de suite si la respiration siffle ou se resserre.`,
      `Ulcère de l’estomac ou du duodénum (actuel ou passé) : demande avis avant.`,
      `Nitroglycérine : la NAC en augmente l’effet (maux de tête, étourdissements). Antibiotiques : demande au pharmacien comment espacer les prises.`,
      `Grossesse et allaitement : demande à un professionnel de la santé avant.`,
      `Calculs rénaux : demande avis avant.`,
      `Troubles de la coagulation ou chirurgie prévue : la NAC pourrait ralentir la coagulation. Arrête-la 2 semaines avant une chirurgie.`,
      `Jamais avant 2 ans. Enfant : seulement sur avis médical.`,
      `Effets fréquents : odeur de soufre, nausées, vomissements, diarrhée. Au début, le mucus peut être plus abondant : prudence si tu tousses faiblement.`,
    ],
    tag: `Grippe · mucus · adulte`,
  },
  {
    id: `astragale`,
    name: `Astragale`,
    kicker: `Saison des rhumes et grippes · adulte`,
    topics: [`fievre`],
    caution: true,
    adulteSeulement: true,
    how: `Santé Canada : 2 à 4,8 g de racine séchée par jour (gélules, teinture ou tisane), pour l’adulte de 18 ans et plus. En pratique : 2 à 4 g par jour, ou une décoction de 10 à 15 g de tranches mijotées 20 à 25 minutes, à boire en 2 tasses par jour, pendant la saison des rhumes et grippes.`,
    extra: [
      `Racine d’astragale (Astragalus membranaceus, huang qi 黄芪) : utilisée en médecine chinoise pour renforcer les défenses, et en phytothérapie pour aider à garder un système immunitaire en santé (Santé Canada).`,
      `Décoction : 10 à 15 g de tranches séchées (environ 5 à 8 tranches) dans l’eau, à feu doux 20 à 25 minutes. Filtrer et boire en 2 tasses dans la journée.`,
      `Gélules ou teinture : choisis un produit avec un numéro NPN de Santé Canada.`,
    ],
    securite: [
      `Maladie auto-immune (lupus, polyarthrite rhumatoïde, sclérose en plaques, etc.) : pas d’astragale, car elle stimule l’immunité.`,
      `Immunosuppresseurs (cyclosporine, tacrolimus, mycophénolate, cyclophosphamide, après une greffe) : ne pas en prendre, l’astragale peut contrer leur effet.`,
      `Lithium : l’astragale peut réduire son élimination et augmenter son taux dans le sang. Évite-la ou parles-en au médecin.`,
      `Grossesse et allaitement : à éviter.`,
      `Enfants et adolescents : pas d’astragale. La dose de Santé Canada vise l’adulte de 18 ans et plus.`,
      `Achète seulement la racine d’A. membranaceus ou d’A. mongholicus, d’une source fiable : d’autres espèces d’Astragalus sont toxiques.`,
      `Diabète ou hypertension sous traitement : parles-en au médecin ou au pharmacien avant.`,
    ],
    tag: `Immunité · prévention · adulte`,
  },
  {
    id: `betadine`,
    name: `Spray Betadine 0,45 %`,
    kicker: `Priorité n°1`,
    topics: [`gorge`],
    caution: true,
    how: `1 vaporisation au fond de la gorge, jusqu’à 3 fois par jour. Recracher l’excédent. Povidone-iode 0,45 %, flacon de 50 ml.`,
    extra: [
      `Le geste le plus direct dès les premiers signes. Pas en même temps que le peroxyde.`,
      `Pas avant 6 ans, ni en cas de trouble de la thyroïde, de grossesse ou d’allaitement. Arrêter si ça irrite.`,
    ],
    tag: `Gorge · povidone-iode`,
    href: `https://www.amazon.ca/dp/B0G1ZJF7Y6`,
  },
  {
    id: `vitamines`,
    name: `Vitamines C et D`,
    kicker: `Soutien de fond`,
    topics: [`fievre`],
    how: `Vitamine C en soutien : 1 g par jour (par ex. 500 mg, 2 fois par jour). Au-delà de 2 g par jour : risque de diarrhée et de calculs rénaux.`,
    extra: [
      `Vitamine D, en priorité : un supplément est souvent recommandé au Québec en automne et en hiver ; demande conseil à ton pharmacien ou à ton médecin.`,
      `Vitamine D : 1 000 à 2 000 UI tous les jours, pas de grosses doses espacées. Plafond : 4 000 UI par jour. Utile pour le système immunitaire.`,
      `Vitamine K2 avec la vitamine D (adulte) : 90 à 120 µg de MK-7 par jour, avec le repas où tu prends ta vitamine D, pour aider le calcium à aller dans les os plutôt que dans les artères. Au Canada, 120 µg par jour au maximum dans les produits de santé naturels ; il existe des produits D3 + K2.`,
      `Soleil : visage et bras, sans lunettes, sans brûler. 30 minutes au minimum, une heure c’est mieux, surtout en été.`,
    ],
    // Profil Enfant : sans la K2 (adulte seulement).
    extraEnfant: [
      `Vitamine D, en priorité : un supplément est souvent recommandé au Québec en automne et en hiver ; demande conseil à ton pharmacien ou à ton médecin.`,
      `Vitamine D : 1 000 à 2 000 UI tous les jours, pas de grosses doses espacées. Plafond : 4 000 UI par jour. Utile pour le système immunitaire.`,
      `Soleil : visage et bras, sans lunettes, sans brûler. 30 minutes au minimum, une heure c’est mieux, surtout en été.`,
    ],
    // Sécurité de la vitamine K2 : adulte seulement (cachée en profil Enfant).
    securiteTitre: `Sécurité · vitamine K2`,
    securiteAdulte: true,
    securite: [
      `Warfarine ou autre antivitamine K (acénocoumarol) : pas de K2 sans l’accord du médecin. Même à petite dose (10 à 20 µg par jour), la MK-7 change l’effet de la warfarine (INR).`,
      `Autre anticoagulant (apixaban, rivaroxaban, dabigatran) : Santé Canada demande l’avis du médecin ou du pharmacien avant de prendre de la vitamine K, à toute dose.`,
      `Dialyse ou insuffisance rénale : parles-en au néphrologue avant (vitamine D, calcium et anticoagulants y sont souvent ajustés).`,
      `Grossesse et allaitement : pas de K2 en supplément, seulement dans les aliments, sauf avis médical.`,
      `Enfants : pas de K2 en supplément sans avis.`,
      `Garde la dose de vitamine D de l’appli (1 000 à 2 000 UI, plafond 4 000 UI) : la K2 ne permet pas de dépasser ce plafond.`,
    ],
    tag: `Soutien de base`,
  },
  {
    id: `vitamines-b`,
    name: `Vitamines B (complexe B méthylé)`,
    kicker: `Soutien de fond · adulte`,
    topics: [`fievre`],
    caution: true,
    adulteSeulement: true,
    how: `B12 (méthylcobalamine) : 250 à 1 000 µg par jour. Folate : 400 µg par jour (méthylfolate ou acide folique), jamais plus de 1 000 µg d’acide folique. B6 : 10 mg par jour au maximum au total, en additionnant tous les produits. Ou un complexe B méthylé avec un numéro NPN de Santé Canada. Adulte seulement.`,
    extra: [
      `Les vitamines B6, B9 (folate) et B12 sont nécessaires au système immunitaire : un manque l’affaiblit, et le corriger le rétablit.`,
      `B12 : comprimé à croquer ou sublingual. Surtout utile après 50 ans, chez les végétaliens et sous metformine ou inhibiteur de la pompe à protons.`,
      `B6 : 1,3 à 1,7 mg par jour suffisent. Additionne la B6 de tous tes produits (multivitamines, magnésium-B6, etc.) pour rester à 10 mg ou moins.`,
    ],
    securite: [
      `B6 et nerfs : à 10 mg par jour ou plus, risque d’atteinte des nerfs (engourdissements, picotements, douleur aux mains et aux pieds). Arrête et consulte si ces symptômes apparaissent (Santé Canada).`,
      `Folate et B12 : beaucoup d’acide folique (plus de 1 000 µg par jour) peut masquer un manque de B12 pendant que les nerfs s’abîment. Fais vérifier ta B12 avant de prendre beaucoup de folate.`,
      `Reins : de fortes doses de vitamines B (folate 2,5 mg, B6 25 mg, B12 1 mg) ont accéléré la baisse de la fonction rénale chez des diabétiques atteints de néphropathie (JAMA 2010). Problème de reins : demande l’avis du médecin.`,
      `Neuropathie optique de Leber : évite la cyanocobalamine (prends la méthylcobalamine).`,
      `Allergie au cobalt : attention, la B12 contient du cobalt.`,
      `Metformine et inhibiteurs de la pompe à protons (oméprazole, pantoprazole, etc.) : ils abaissent la B12. Parles-en au pharmacien.`,
      `Grossesse : 400 µg d’acide folique par jour sont recommandés avant et pendant la grossesse. Pas de fortes doses de B6 sans avis.`,
      `Enfants : doses adaptées à l’âge seulement (limites plus basses pour la B6), avec le pharmacien.`,
      `Phénytoïne ou méthotrexate : le folate peut baisser l’effet de la phénytoïne et interférer avec le méthotrexate. Parles-en au médecin.`,
    ],
    tag: `Immunité · soutien · adulte`,
  },
  {
    id: `nmn`,
    name: `NMN (nicotinamide mononucléotide)`,
    kicker: `Soutien de fond · adulte`,
    topics: [`fievre`],
    caution: true,
    adulteSeulement: true,
    how: `250 mg par jour, jusqu’à 500 mg par jour, le matin ou en début d’après-midi. Choisis un produit avec un numéro NPN de Santé Canada. Adulte seulement.`,
    extra: [
      `Le NMN est un précurseur du NAD+, un cofacteur important du métabolisme de l’énergie (Santé Canada). Le NAD+ aide les cellules à produire de l’énergie et à se réparer, y compris les cellules du système immunitaire.`,
      `Énergie et récupération : chez l’humain, 250 à 600 mg par jour ont fait monter le NAD+ dans le sang, avec moins de fatigue, une marche plus rapide et une meilleure endurance à l’effort.`,
      `Pris l’après-midi, 250 mg par jour ont le plus réduit la somnolence et la fatigue chez des personnes âgées (essai de 12 semaines).`,
    ],
    securite: [
      `Santé Canada : 1 200 mg par jour au maximum et 600 mg par prise.`,
      `Durée : à 250 mg par jour ou moins, demande l’avis d’un professionnel de la santé pour continuer au-delà de 12 semaines ; au-dessus de 250 mg par jour, au-delà de 8 semaines (Santé Canada).`,
      `Diabète : demande l’avis du médecin avant (Santé Canada). Le NMN peut changer la sensibilité à l’insuline : surveille ta glycémie si tu prends un médicament pour le diabète.`,
      `Grossesse ou allaitement : demande l’avis d’un professionnel de la santé avant (Santé Canada).`,
      `Enfants : pas de NMN. Santé Canada l’autorise seulement pour les adultes de 18 ans et plus.`,
      `Dans les études chez l’humain, le NMN a été bien toléré jusqu’à 900 mg par jour pendant 60 jours et 1 250 mg par jour pendant 4 semaines. Reste quand même à la dose de l’appli.`,
    ],
    tag: `Énergie · immunité · adulte`,
  },
  {
    id: `vitamine-c-double`,
    name: `Double dose de vitamine C`,
    kicker: `Dès les premiers symptômes`,
    topics: [`fievre`, `gorge`],
    how: `Dès les premiers symptômes, doubler la dose : 2 g par jour (1 g → 2 g), en 2 à 3 prises avec de l’eau, pendant la durée du rhume ou de la grippe.`,
    extra: [
      `Ne pas dépasser 2 g par jour chez l’adulte : au-delà, risque de diarrhée et de calculs rénaux.`,
      `Prudence en cas de calculs rénaux ou d’hémochromatose. Si tu prends des médicaments, demande à ton pharmacien.`,
    ],
    tag: `Vitamine C · premiers symptômes`,
  },
  {
    id: `argent`,
    name: `Argent colloïdal`,
    kicker: `Gorge et nez · adulte`,
    topics: [`gorge`, `congestion`],
    caution: true,
    adulteSeulement: true,
    how: `Gargarisme : argent colloïdal à environ 15 ppm, 15 à 30 secondes, puis recracher. Jusqu’à 3 fois par jour. Ne jamais avaler.`,
    extra: [
      `Nez : rinçage ou vaporisation à environ 15 ppm, 2 fois par jour, jusqu’à 10 jours. Ne jamais avaler.`,
      `Adulte seulement.`,
    ],
    securite: [
      `Pas par la bouche : avalé de façon prolongée, l’argent s’accumule et colore la peau en bleu-gris, de façon permanente (argyrie).`,
      `Choisir un produit avec un numéro NPN ou DIN à 8 chiffres : Santé Canada a rappelé des produits non autorisés.`,
      `Peut nuire à l’absorption de certains antibiotiques et de la thyroxine. Si tu prends des médicaments, demande au pharmacien.`,
      `Jamais pour les enfants, ni pendant la grossesse ou l’allaitement.`,
    ],
    tag: `Gargarisme · nez · ne jamais avaler`,
  },
  {
    id: `peroxyde`,
    name: `Peroxyde d’hydrogène 3 %`,
    kicker: `3 % Food Grade seulement`,
    topics: [`gorge`],
    caution: true,
    how: `Uniquement du peroxyde 3 % Food Grade (jamais le 35 %). Ne jamais exposer la bouteille au soleil : la lumière dégrade le produit.`,
    extra: [
      `Oreilles : peroxyde dans les oreilles : prudence. Jamais si le tympan est perforé, s’il y a un tube (drain), une douleur ou un écoulement. Même mélange que le gargarisme : 1 c. à soupe de peroxyde 3 % Food Grade + 1 c. à soupe d’eau (50/50), quelques gouttes dans chaque oreille. Laisser agir 5 minutes maximum, ou avant si étourdissement : arrêter dès qu’un étourdissement apparaît. Puis pencher la tête pour vider. Demande d’abord conseil à un pharmacien.`,
      `Gargarisme : 1 c. à soupe de peroxyde 3 % Food Grade + 1 c. à soupe d’eau. 30 s en bouche + 30 s en gorge, puis recracher. 3 fois par jour, jusqu’à 5 jours. Ne jamais avaler.`,
      `Arrêter en cas d’irritation. Usage court uniquement.`,
    ],
    tag: `Usage très prudent`,
  },
  {
    id: `pastilles`,
    name: `Pastilles antiseptiques`,
    kicker: `En déplacement`,
    topics: [`gorge`],
    how: `Fortes pour commencer, puis plus douces par la suite. Utiles quand le spray ou le gargarisme n’est pas pratique.`,
    extra: [
      `Suivre le nombre indiqué sur le produit. Le spray reste la première ligne.`,
    ],
    tag: `Gorge · déplacement`,
  },
  {
    id: `girofle`,
    name: `Clou de girofle`,
    kicker: `Gorge · adulte`,
    topics: [`gorge`],
    caution: true,
    adulteSeulement: true,
    how: `Mal de gorge : mâcher lentement 1 à 2 clous de girofle entiers, plusieurs fois par jour, puis les recracher. Adulte seulement.`,
    extra: [
      `Gargarisme : eau infusée de clous de girofle, tiède, plusieurs fois par jour, puis recracher.`,
      `Infusion : 2 c. à thé de clous de girofle dans 2 tasses d’eau chaude, 10 minutes, puis filtrer.`,
      `Bain de bouche du commerce à l’huile essentielle de girofle (1 à 5 %) : plusieurs fois par jour, 1 semaine maximum (Agence européenne du médicament).`,
      `Son eugénol engourdit la douleur dans la bouche aussi bien qu’un gel de benzocaïne, et freine en laboratoire le virus de la grippe A et un coronavirus du rhume.`,
    ],
    securite: [
      `Huile essentielle : jamais pure dans la bouche, jamais avalée. Avalée, même en petite quantité, elle peut causer de graves atteintes du foie, des convulsions ou un coma (MedlinePlus).`,
      `Garde l’huile hors de portée des enfants. Produits à l’huile de girofle : pas avant 18 ans (Agence européenne du médicament).`,
      `Pas si tu prends un anticoagulant ou de l’acétaminophène, ni en cas de maladie du foie (Santé Canada).`,
      `Pas pendant la grossesse ni l’allaitement. Pas si tu es allergique au baume du Pérou.`,
      `Recrache le clou après l’avoir mâché : avalé de travers, il peut se coincer dans les voies respiratoires.`,
    ],
    tag: `Gorge · eugénol`,
  },
  {
    id: `sureau`,
    name: `Sureau noir`,
    kicker: `Dès les premiers signes`,
    topics: [`fievre`],
    how: `Sirop (adulte) : 1 c. à soupe (15 ml), 4 fois par jour pendant 5 jours, à commencer dans les 48 premières heures. Tisane : 2 à 3 tasses.`,
    extra: [`L’effet est meilleur s’il est commencé tôt.`],
    tag: `Grippe · immunité`,
  },
  {
    id: `probiotiques`,
    name: `Probiotiques`,
    kicker: `Après la phase aiguë`,
    topics: [],
    how: `Aliments fermentés (kéfir, yaourt nature, choucroute, kimchi) ou un complément, selon l’étiquette. Plutôt après la phase aiguë, ou en soutien intestinal.`,
    extra: [`Utile en convalescence, et après une antibiothérapie.`],
    tag: `Immunité · convalescence`,
  },
  {
    id: `origan`,
    name: `Huile d’origan`,
    kicker: `Toujours diluée`,
    topics: [],
    caution: true,
    how: `1 goutte dans une cuillère d’huile porteuse ou de miel. Maximum 1 à 2 gouttes diluées, 2 à 3 fois par jour, en phase aiguë seulement.`,
    extra: [
      `Très concentrée. Jamais pure.`,
      `À éviter chez les jeunes enfants, les femmes enceintes, et en usage prolongé.`,
    ],
    tag: `Antimicrobien · prudent`,
  },
  {
    id: `reglisse`,
    name: `Racine de réglisse`,
    kicker: `En combinaison`,
    topics: [`toux`, `gorge`],
    how: `Peu utile seule. Mieux combinée au thym, au miel ou à une autre tisane de gorge.`,
    extra: [
      `Tisane, 1 à 2 tasses par jour, quelques jours seulement.`,
      `Peut augmenter la pression artérielle en usage prolongé. À éviter en cas d’hypertension ou de problème cardiaque.`,
    ],
    tag: `Gorge · anti-inflammatoire`,
  },
  {
    id: `thym`,
    name: `Thym`,
    kicker: `Toux grasse`,
    topics: [`toux`],
    how: `Sirop : 1 c. à café, 3 à 4 fois par jour. Ou 2 à 3 tasses de tisane.`,
    extra: [`Utile pour la toux grasse et les voies respiratoires.`],
    tag: `Toux · voies respiratoires`,
  },
  {
    id: `miel`,
    name: `Miel seul`,
    kicker: `Pour le mal de gorge`,
    topics: [`toux`, `gorge`],
    how: `Pour le mal de gorge, prendre seulement du miel : 1 cuillère à soupe de miel seul, avec une cuillère qui n’est pas en métal (bois, plastique ou céramique). Pas dans une tisane, pas de citron.`,
    extra: [`Ne pas rincer la gorge ni boire juste après : laisser le miel agir dans la gorge.`, `Pour la toux de nuit : 1 c. à soupe de miel seul, 30 min avant le coucher.`, `Apaise la gorge et la toux, notamment la nuit.`],
    tag: `Gorge · toux nocturne`,
  },
  {
    id: `violette`,
    name: `Violette et herbe à chats`,
    kicker: `Toux avec fièvre`,
    topics: [`toux`, `fievre`],
    how: `Dans la teinture aux trois plantes, ou en tisane légère.`,
    extra: [
      `Apaisantes quand la toux s’accompagne de maux de tête ou de fièvre.`,
    ],
    tag: `Toux · fièvre`,
  },
];

export const TOUX_CONSEIL = `Combiner les plantes avec le repos de la voix, un air humidifié et beaucoup de liquides. Si la toux dure plus de 7 à 10 jours, ou s’accompagne de fièvre, consulter.`;

export const DOSES_ENFANT = {
  ail: `Petite quantité diluée, pas chez le tout-petit. Le miel n’est pas avant 1 an.`,
  echinacee: `Partie aérienne dès 2 ans, la racine pas avant 12 ans, dose selon l’âge et l’étiquette, quelques jours seulement. De 4 à 12 ans, en prévention : Echinaforce Junior sur avis médical. Pas en cas d’allergie aux Astéracées.`,
  gingembre: `À partir de 6 ans, dose réduite selon l’âge (Santé Canada). Plus jeune : seulement un peu dans les aliments.`,
  pin: `Tisane légère, bien diluée.`,
  lavage: `Version douce, selon l’âge. Ne pas forcer.`,
  zinc: `Pas la dose des études (réservée à l’adulte). Chez l’enfant : selon le poids, avec un avis du pharmacien.`,
  betadine: `À partir de 6 ans, sous surveillance : 1 vaporisation, jusqu’à 3 fois par jour. Pas avant.`,
  pastilles: `Selon l’âge indiqué sur la boîte. Pas les pastilles fortes d’adulte.`,
  vitamines: `Selon l’âge. Ne pas donner la dose adulte de vitamine D sans avis.`,
  'vitamine-c-double': `Dose selon l’âge : demander au pharmacien avant de doubler.`,
  argent: `À éviter chez l’enfant.`,
  quercetine: `À éviter chez l’enfant.`,
  nac: `Jamais avant 2 ans. Enfant : seulement sur avis médical. La dose de 600 mg est pour l’adulte.`,
  'vitamines-b': `Doses adaptées à l’âge seulement (limites plus basses pour la B6), avec le pharmacien.`,
  nmn: `Pas de NMN chez l’enfant : Santé Canada l’autorise seulement pour les adultes de 18 ans et plus.`,
  astragale: `Pas chez l’enfant ni l’adolescent : la dose de Santé Canada vise l’adulte de 18 ans et plus.`,
  girofle: `À éviter chez l’enfant. L’huile essentielle de girofle avalée est très toxique : toujours hors de portée.`,
  peroxyde: `À éviter, ou seulement avec un avis. Pas dans les oreilles d’un jeune enfant.`,
  sureau: `Dose réduite. Commencer très peu pour voir la tolérance.`,
  probiotiques: `Selon le produit et l’âge. Préférer un aliment fermenté doux.`,
  origan: `Déconseillée.`,
  reglisse: `Usage limité, et pas en continu.`,
  thym: `Tisane légère plutôt que le sirop concentré.`,
  miel: `À partir de 1 an seulement. Jamais avant. De 1 à 5 ans : 2 c. à thé de miel seul, 30 min avant le coucher pour la toux de nuit.`,
  violette: `Teinture : 10 à 15 gouttes à partir de 2 ans. En dessous, tisane très légère.`,
};

export const RECETTES = [
  {
    id: `ail`,
    title: `Mélange ail, vinaigre de cidre et miel`,
    ingredients: [
      `8 gousses d’ail frais, pelées`,
      `1 tasse (250 ml) de vinaigre de cidre non filtré, non pasteurisé, avec la mère`,
      `1 tasse (250 ml) de miel cru non pasteurisé`,
    ],
    steps: [
      `Mixer 45 à 60 secondes jusqu’à un mélange homogène.`,
      `Verser dans un bocal en verre hermétique.`,
      `Laisser au réfrigérateur 5 jours, en remuant chaque jour.`,
      `Ne jamais utiliser d’instrument en métal avec le miel : bois, plastique ou verre.`,
    ],
    use: `Au frigo, plusieurs semaines. 1 à 2 c. à soupe au réveil.`,
  },
  {
    id: `pin`,
    title: `Tisane d’aiguilles de pin`,
    ingredients: [
      `1 petite poignée d’aiguilles de pin fraîches, bien rincées`,
      `250 ml d’eau frémissante, pas bouillante`,
      `Optionnel : un peu de miel après infusion, avec une cuillère non métallique`,
    ],
    steps: [`Infuser 8 à 10 minutes.`, `Filtrer.`],
    use: `2 à 3 tasses par jour. Pins non traités seulement.`,
  },
  {
    id: `gingembre`,
    title: `Tisane gingembre, citron et miel`,
    ingredients: [
      `5 à 10 g de gingembre frais râpé (2 à 4 cm)`,
      `Jus d’un demi-citron`,
      `1 c. à café de miel, ajouté après infusion`,
      `250 ml d’eau chaude`,
    ],
    steps: [
      `Infuser le gingembre 10 minutes.`,
      `Ajouter citron et miel hors du feu.`,
    ],
    use: `2 à 3 tasses par jour. Utile pour la gorge et la congestion.`,
  },
  {
    id: `thym`,
    title: `Sirop de thym et miel`,
    ingredients: [
      `1 bonne poignée de thym frais`,
      `200 ml d’eau`,
      `Miel, à parts égales avec le réduit`,
    ],
    steps: [
      `Faire réduire l’eau et le thym de moitié, à feu doux.`,
      `Filtrer.`,
      `Mélanger à parts égales avec le miel, cuillère en bois ou en plastique.`,
    ],
    use: `1 c. à café, 3 à 4 fois par jour. Se conserve au frigo plusieurs semaines.`,
  },
  {
    id: `tylenol`,
    title: `Teinture aux trois plantes`,
    intro: `Trois plantes utilisées traditionnellement contre la douleur, l’inflammation et la fièvre : grande camomille (feverfew), violette douce et herbe à chats (catnip).`,
    ingredients: [
      `Environ ⅓ de tasse de chaque herbe séchée, à parts égales : catnip, fleurs de violette, feverfew`,
      `Eau très chaude, juste assez pour faire flotter les herbes`,
      `Glycérine végétale biologique (ou alcool, ou vinaigre de cidre)`,
    ],
    steps: [
      `Remplir un bocal d’environ un tiers à la moitié avec les herbes séchées.`,
      `Ajouter juste assez d’eau très chaude pour les faire flotter.`,
      `Compléter avec la glycérine végétale.`,
      `Remuer. Couvrir d’un tissu et d’un élastique.`,
      `Laisser macérer 6 semaines au frais et à l’obscurité, en secouant régulièrement.`,
      `Filtrer. Conserver dans un flacon compte-gouttes opaque.`,
    ],
    use: `Adultes : 60 à 90 gouttes dans un peu d’eau, selon le besoin (douleur, inflammation, fièvre, maux de tête). Enfants dès 2 ans : commencer par 10 à 15 gouttes et ajuster selon le poids. Attendre au moins 20 minutes entre les prises.`,
    caution: `Usage éducatif uniquement. Ne remplace pas un médicament contre la fièvre ni un avis médical. Consulter un professionnel avant utilisation, surtout chez les enfants, les femmes enceintes, ou en cas de traitement. Arrêter en cas de réaction inhabituelle.`,
  },
  {
    id: `sinus`,
    title: `Nettoyage des sinus`,
    intro: `Le lavage nasal dégage les sinus, réduit la congestion et limite la prolifération des pathogènes. Jusqu’à 6 fois par jour les 2 premiers jours, puis 1 à 3 fois par jour selon l’intensité.`,
    blocks: [
      {
        title: `Solution saline, la plus douce`,
        items: [
          `1 tasse (250 ml) d’eau tiède, bouillie ou filtrée`,
          `½ à 1 c. à café de sel non iodé, ou sel de mer fin`,
          `Optionnel : ½ c. à café de bicarbonate de soude, pour adoucir`,
          `Pour une bouteille de rince-sinus de 6 oz (177 ml) : ⅓ à ⅔ c. à café de sel, ⅓ c. à café de bicarbonate (optionnel)`,
        ],
        note: `Dissoudre. Pot neti, seringue ou flacon spray. Incliner la tête, faire passer d’une narine à l’autre, puis se moucher doucement.`,
      },
      {
        title: `La plus forte`,
        adulteOnly: true,
        intro: `La solution saline + du peroxyde. Pour 1 tasse (250 ml), ou une bouteille de rince-sinus de 6 oz (177 ml).`,
        items: [
          `1 tasse (250 ml) d’eau tiède, bouillie ou filtrée`,
          `½ à 1 c. à café de sel non iodé, ou sel de mer fin`,
          `Optionnel : ½ c. à café de bicarbonate de soude, pour adoucir`,
          `½ c. à café de peroxyde d’hydrogène 3 % Food Grade (jamais le 35 %)`,
          `Pour une bouteille de rince-sinus de 6 oz (177 ml) : ⅓ à ⅔ c. à café de sel, ⅓ c. à café de bicarbonate (optionnel) et ¼ c. à café de peroxyde 3 % Food Grade`,
        ],
        note: `Mélanger. Pot neti, seringue ou flacon spray. Incliner la tête, faire passer d’une narine à l’autre, puis se moucher doucement. Ne pas avaler. Adulte seulement.`,
      },
      {
        title: `Conseils d’usage`,
        items: [
          `Toujours de l’eau propre : bouillie puis refroidie, ou filtrée.`,
          `Se moucher doucement après le rinçage.`,
          `Éviter le lavage juste avant de dormir s’il reste un écoulement.`,
          `Si la congestion est forte, une inhalation vapeur d’abord pour ouvrir les voies.`,
        ],
      },
    ],
  },
];

export const QUAND_CONSULTER = [
  `Fièvre élevée (plus de 39 °C) ou qui dure plus de 3 jours`,
  `Difficulté à respirer ou douleur thoracique`,
  `Symptômes qui s’aggravent après une amélioration`,
  `Chez un enfant, une personne âgée ou une personne fragile : plus tôt`,
  `En cas de doute, mieux vaut consulter`,
];

export const MODE_SOUTIEN = {
  title: `L’équipe de soutien de ton système immunitaire`,
  detail: `Les soins naturels aident ton système à se défendre contre le rhume et la grippe.`,
  choice: `Dès les premiers signes, agir tôt sur le mal de gorge, avec des gestes simples et réguliers.`,
};

export const A_FAIRE = [
  `Frapper fort dès le mal de gorge`,
  `Très chaud la nuit, bonnet compris, sans fièvre, mal de tête ni frissons`,
  `Vitamine D en supplément`,
  `Zinc dès le début`,
  `Hydratation et sommeil`,
];

export const A_EVITER = [
  `Attendre que ça s’aggrave`,
  `Rester au froid`,
  `Alcool`,
  `Efforts intenses`,
  `Sucre et produits ultra-transformés`,
];

export const SYMPTOMES_TYPIQUES = [
  {
    lead: `Mal de gorge`,
    detail: `Souvent le premier signe. Gorge irritée, douloureuse à avaler.`,
  },
  {
    lead: `Nez bouché`,
    detail: `Congestion, écoulements, éternuements.`,
  },
  {
    lead: `Toux`,
    detail: `Sèche au début, puis parfois grasse.`,
  },
  {
    lead: `Fièvre`,
    detail: `Légère à modérée, parfois plus élevée.`,
  },
  {
    lead: `Fatigue`,
    detail: `Courbatures, sensation de lourdeur.`,
  },
  {
    lead: `Maux de tête`,
    detail: `Fréquents avec la congestion ou la fièvre.`,
  },
];

export const GESTES_COMBAT = [`betadine`, `peroxyde`, `pastilles`, `miel`, `vitamine-c-double`];

export const LOGIQUE_COMBAT = [
  {
    lead: `1. Spray povidone-iode 0,45 %`,
    detail: `Le plus direct et le plus pratique dès les premiers signes. Action locale immédiate.`,
  },
  {
    lead: `2. Peroxyde d’hydrogène 3 % Food Grade`,
    detail: `1 c. à soupe + 1 c. à soupe d’eau, en gargarisme : 30 s en bouche + 30 s en gorge, 3 fois par jour, jusqu’à 5 jours. Recracher, ne pas avaler. Puissant, moins pratique que le spray.`,
  },
  {
    lead: `3. Pastilles antiseptiques`,
    detail: `Utiles en déplacement. Fortes pour commencer, puis plus douces par la suite.`,
  },
  {
    lead: `4. Miel cru`,
    detail: `Miel seul : 1 c. à soupe, cuillère pas en métal. Ne pas boire juste après : laisser agir. Un complément, pas la première ligne.`,
  },  {
    lead: `5. Double dose de vitamine C`,
    detail: `Dès les premiers symptômes, doubler la dose : 2 g par jour, en 2 à 3 prises, pendant la durée du rhume ou de la grippe.`,
  },
];

export const GORGE_GESTES = [
  {
    lead: `1. Spray povidone-iode 0,45 %`,
    detail: `Spray Betadine pour la gorge. Le plus direct dès les premiers signes. Souvent à partir de 6 ans : suivre l’étiquette.`,
  },
  {
    lead: `2. Peroxyde 3 % Food Grade`,
    detail: `1 c. à soupe de peroxyde 3 % Food Grade + 1 c. à soupe d’eau. 30 s en bouche + 30 s en gorge, 3 fois par jour, jusqu’à 5 jours. Recracher, ne jamais avaler. Bouteille à l’abri du soleil.`,
  },
  {
    lead: `3. Pastilles antiseptiques`,
    detail: `Fortes pour commencer, puis plus douces. Pratiques en déplacement.`,
  },
  {
    lead: `4. Miel cru`,
    detail: `Complément apaisant : 1 c. à soupe de miel seul, cuillère en bois, plastique ou céramique. Pas de tisane ni de citron, et ne pas boire juste après.`,
  },
];

export const PREVENTION = [
  `Vitamine D : supplément souvent recommandé au Québec en hiver, demande conseil`,
  `Frapper fort dès le mal de gorge`,
  `Sommeil de qualité et repos`,
  `Humidifier l’air en saison froide`,
  `Alimentation riche en légumes, ail et gingembre`,
  `Limiter le sucre et les produits ultra-transformés`,
];

// Prévention réservée à l’adulte (cachée en profil Enfant, comme les autres usages du peroxyde).
export const PREVENTION_OREILLES = `Oreilles au peroxyde, en prévention (adulte) : même mélange que le gargarisme, 1 c. à soupe de peroxyde 3 % Food Grade + 1 c. à soupe d’eau (50/50). Quelques gouttes dans chaque oreille, 5 minutes maximum, ou avant si étourdissement. Puis pencher la tête pour vider. Jamais si le tympan est perforé, s’il y a un tube (drain), une douleur ou un écoulement.`;
// Prévention réservée à l’adulte : quercétine (cachée en profil Enfant).
export const PREVENTION_QUERCETINE = `Quercétine, en prévention (adulte) : 500 mg 2 fois par jour avec un repas en hiver ou pendant les efforts intenses, jusqu’à 12 semaines.`;
// Prévention réservée à l’adulte : astragale (cachée en profil Enfant).
export const PREVENTION_ASTRAGALE = `Astragale, en prévention (adulte) : 2 à 4 g de racine séchée par jour, ou une décoction de 10 à 15 g de tranches mijotées 20 à 25 minutes, en 2 tasses par jour, pendant la saison des rhumes et grippes.`;
// Prévention réservée à l’adulte : vitamines B et vitamine K2 (cachées en profil Enfant).
export const PREVENTION_VITAMINES_B = `Vitamines B, en prévention (adulte) : B12 250 à 1 000 µg et folate 400 µg par jour, B6 10 mg par jour au maximum au total, ou un complexe B méthylé avec un numéro NPN.`;
export const PREVENTION_K2 = `Vitamine K2, avec la vitamine D (adulte) : 90 à 120 µg de MK-7 par jour, au repas où tu prends ta vitamine D.`;
export const PREVENTION_NMN = `NMN, en prévention (adulte) : 250 mg par jour (jusqu’à 500 mg) avec un numéro NPN ; demande l’avis d’un professionnel de la santé au-delà de 12 semaines (8 semaines au-dessus de 250 mg).`;

export const preventionPour = (enfant) => (enfant ? PREVENTION : [...PREVENTION, PREVENTION_K2, PREVENTION_VITAMINES_B, PREVENTION_NMN, PREVENTION_QUERCETINE, PREVENTION_ASTRAGALE, PREVENTION_OREILLES]);

export const PENDANT_MALADIE = [
  `Humidifier l’air de la chambre, surtout en hiver.`,
  `Surélever légèrement la tête pour mieux dormir en cas de congestion.`,
  `Dormir au chaud. Le corps doit rester bien couvert. Un bonnet la nuit limite les pertes de chaleur par la tête.`,
  `Rester au chaud et éviter les changements de température brusques.`,
  `Surveiller la température. Adapter le protocole en cas de mal de tête intense ou de frissons importants.`,
  `Se laver le nez à l’eau salée plusieurs fois par jour, jusqu’à 6 fois par jour les 2 premiers jours.`,
  `Limiter les contacts rapprochés pendant la phase contagieuse.`,
  `Miel : jamais d’instrument en métal (cuillère, mixeur). Bois, plastique ou verre, pour préserver les enzymes du miel cru.`,
  `Éviter l’alcool pendant la phase aiguë : il déshydrate et peut affaiblir les défenses.`,
  `Nicotine et tabac : ceci n’est pas une recommandation. La nicotine est nocive et crée une dépendance. Pendant un rhume ou une grippe, la fumée irrite des voies déjà enflammées : à éviter.`,
  `Vapotage : moins agressif que la cigarette, faute de combustion, mais la vapeur peut irriter des voies déjà enflammées. À éviter ou à limiter fortement pendant la phase aiguë.`,
];

export const FILTRES = [
  {
    id: `tous`,
    label: `Tous`,
  },
  {
    id: `fievre`,
    label: `Fièvre`,
  },
  {
    id: `toux`,
    label: `Toux`,
  },
  {
    id: `congestion`,
    label: `Congestion`,
  },
  {
    id: `gorge`,
    label: `Gorge`,
  },
  {
    id: `prudence`,
    label: `Prudence`,
  },
];

export const PLANTES_TOUX = [`thym`, `miel`, `pin`, `reglisse`, `violette`];

export const PLANTES_RECETTES = {
  thym: `thym`,
  miel: `gingembre`,
  pin: `pin`,
  violette: `tylenol`,
};

export const SYMPTOMES_PRINCIPAUX = [`fievre`, `toux`, `nez-bouche`];
