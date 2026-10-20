export const JOURNAL_KEY = `remedes-naturels-journal-v1`;

export const PREFS_KEY = `remedes-naturels-prefs-v1`;

export const PROTOCOLE_DU_JOUR = [
  {
    id: `tot`,
    title: `Frapper fort`,
    detail: `Dès le mal de gorge : 1. spray povidone-iode 0,45 % · 2. peroxyde · 3. pastilles antiseptiques · 4. miel.`,
  },
  {
    id: `hydratation`,
    title: `Hydratation`,
    detail: `2,5 à 3 litres par jour, eau et tisanes. Boire régulièrement, même sans soif.`,
  },
  {
    id: `repos`,
    title: `Au chaud la nuit`,
    detail: `Tuque, couvertures, bas : garder toute la chaleur de ton corps. Seulement s’il n’y a pas de fièvre, de mal de tête ou de frissons. Arrête si tu as trop chaud ou si tu te sens moins bien.`,
  },
  {
    id: `immunite`,
    title: `Vitamine D`,
    detail: `En priorité. Un supplément est souvent recommandé au Québec en automne et en hiver : demande conseil à ton pharmacien ou à ton médecin. Adulte : souvent 2 000 à 4 000 UI/jour, selon une prise de sang. En phase aiguë : zinc 15–30 mg et vitamine C 1–2 g.`,
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
    detail: `Vitamine D d’abord, surtout l’automne et l’hiver au Québec. Zinc et vitamine C pendant la maladie, mélange ail-vinaigre-miel. Argent colloïdal : non recommandé par voie interne (mise en garde de Santé Canada).`,
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
      `Zinc 15–30 mg dès les 24 premières heures, en pastilles si la gorge pique.`,
      `Sureau ou échinacée, démarrés tout de suite.`,
      `Vitamine C répartie dans la journée, et se coucher tôt.`,
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
      `Arrêter l’échinacée après 7 à 10 jours continus.`,
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
        detail: `15–30 mg/jour en pastilles, dès le début.`,
      },
      {
        lead: `Lavage nasal`,
        detail: `Solution saline : ½ à 1 c. à café de sel dans 250 ml d’eau tiède, bouillie ou filtrée. Pas de peroxyde dans le nez.`,
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
        detail: `15–30 mg/jour dès les premières heures.`,
      },
      {
        lead: `Vitamine C`,
        detail: `500 mg à 1 g, 2 à 3 fois par jour.`,
      },
      {
        lead: `Échinacée`,
        detail: `Selon le dosage, pendant 7 à 10 jours maximum.`,
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
        detail: `½ c. à café de sel dans un verre d’eau tiède, 3 à 4 fois par jour.`,
      },
      {
        lead: `Mélange ail-vinaigre-miel`,
        detail: `1 c. à soupe diluée, 1 à 2 fois par jour.`,
        prepId: `ail`,
      },
      {
        lead: `Miel`,
        detail: `1 c. à café pure, plusieurs fois par jour. Jamais d’ustensile en métal.`,
      },
      {
        lead: `Tisane sauge ou thym`,
        detail: `2 à 3 tasses.`,
      },
      {
        lead: `Gargarisme au peroxyde`,
        detail: `1 c. à soupe de peroxyde 3 % food grade + 1 c. à soupe d’eau. Gargariser quelques minutes, puis recracher. Ne jamais avaler. Garder la bouteille à l’abri du soleil.`,
      },
      {
        lead: `Oreilles`,
        detail: `Peroxyde dans les oreilles : prudence. Jamais si le tympan est perforé, s’il y a un tube (drain), une douleur ou un écoulement. Seulement dilué (moitié eau, moitié peroxyde 3 %), quelques gouttes, puis pencher la tête pour vider. Demande d’abord conseil à un pharmacien.`,
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
        detail: `1 c. à café avant de dormir.`,
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
        detail: `Sommeil prioritaire. En cas de fièvre, de mal de tête ou de frissons, ne pas forcer la tuque ni la surchauffe.`,
      },
      {
        lead: `Hydratation`,
        detail: `Eau, tisanes, bouillons : au moins 2,5 à 3 litres.`,
      },
      {
        lead: `Sureau ou échinacée`,
        detail: `Selon le dosage indiqué sur le produit.`,
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
        detail: `Selon les besoins, souvent 2 000 à 4 000 UI/jour en hiver.`,
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
        detail: `200 à 400 mg le soir, si besoin.`,
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
      `Recette complète dans Préparations.`,
    ],
    tag: `Immunité · rhume · grippe`,
  },
  {
    id: `echinacee`,
    name: `Échinacée`,
    kicker: `Dès les premiers signes`,
    topics: [`fievre`],
    how: `Tisane, 1 à 2 tasses par jour, ou extrait selon l’emballage. Commencer dès les premiers symptômes.`,
    extra: [`7 à 10 jours maximum en continu.`],
    tag: `Immunité · prévention`,
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
    how: `Solution saline, 1 à 3 fois par jour. Tête penchée, respirer par la bouche, ne pas forcer.`,
    extra: [
      `La recette est dans les préparations. Pas de peroxyde dans le nez.`,
    ],
    tag: `Nez · sinus`,
  },
  {
    id: `zinc`,
    name: `Zinc`,
    kicker: `Les 24 premières heures`,
    topics: [`fievre`, `gorge`],
    how: `15 à 30 mg de zinc élémentaire par jour, en 2 ou 3 prises. À commencer dans les 24 premières heures.`,
    extra: [
      `Ne pas dépasser 40 mg/jour sans avis médical.`,
      `Les pastilles sont utiles pour le mal de gorge.`,
    ],
    tag: `Immunité · premiers symptômes`,
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
    how: `Vitamine C : 500 mg à 1 g, 2 à 3 fois par jour pendant la phase aiguë.`,
    extra: [
      `Vitamine D, en priorité : un supplément est souvent recommandé au Québec en automne et en hiver ; demande conseil à ton pharmacien ou à ton médecin.`,
      `Dose courante : 2 000 à 4 000 UI/jour. À adapter selon une prise de sang. Utile pour le système immunitaire.`,
      `Soleil : visage et bras, sans lunettes, sans brûler. 30 minutes au minimum, une heure c’est mieux, surtout en été.`,
    ],
    tag: `Soutien de base`,
  },
  {
    id: `vitamine-c-double`,
    name: `Double dose de vitamine C`,
    kicker: `Dès les premiers symptômes`,
    topics: [`fievre`, `gorge`],
    how: `Dès les premiers symptômes, doubler sa dose habituelle (par ex. 500 mg → 1000 mg par jour), en 2 prises avec de l’eau, pendant la durée du rhume.`,
    extra: [
      `Ne pas dépasser 2000 mg par jour chez l’adulte (risque de maux de ventre, de diarrhée).`,
      `Prudence en cas de calculs rénaux ou d’hémochromatose. Si tu prends des médicaments, demande à ton pharmacien.`,
    ],
    tag: `Vitamine C · premiers symptômes`,
  },
  {
    id: `argent`,
    name: `Argent colloïdal`,
    kicker: `Mise en garde`,
    topics: [],
    caution: true,
    how: `Non recommandé par voie interne. Santé Canada met en garde : pris par la bouche, l’argent colloïdal peut s’accumuler dans le corps et colorer la peau, les yeux et les ongles en gris-bleu, de façon permanente (argyrie).`,
    extra: [
      `Les produits non homologués n’ont pas été évalués. Un produit autorisé porte un numéro NPN ou DIN à 8 chiffres. Demande conseil à un pharmacien.`,
      `Jamais chez l’enfant ni pendant la grossesse.`,
    ],
    tag: `Mise en garde Santé Canada`,
  },
  {
    id: `peroxyde`,
    name: `Peroxyde d’hydrogène 3 %`,
    kicker: `Food grade seulement`,
    topics: [`gorge`],
    caution: true,
    how: `Uniquement du peroxyde 3 % food grade. Ne jamais exposer la bouteille au soleil : la lumière dégrade le produit.`,
    extra: [
      `Oreilles : peroxyde dans les oreilles : prudence. Jamais si le tympan est perforé, s’il y a un tube (drain), une douleur ou un écoulement. Seulement dilué (moitié eau, moitié peroxyde 3 %), quelques gouttes, puis pencher la tête pour vider. Demande d’abord conseil à un pharmacien.`,
      `Gargarisme : 1 c. à soupe de peroxyde 3 % + 1 c. à soupe d’eau. Gargariser, recracher. Ne jamais avaler.`,
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
    id: `sureau`,
    name: `Sureau noir`,
    kicker: `Dès les premiers signes`,
    topics: [`fievre`],
    how: `Sirop : 1 c. à café à 1 c. à soupe, 2 à 4 fois par jour. Tisane : 2 à 3 tasses.`,
    extra: [`L’effet est meilleur s’il est commencé tôt.`],
    tag: `Grippe · immunité`,
  },
  {
    id: `probiotiques`,
    name: `Probiotiques`,
    kicker: `Après la phase aiguë`,
    topics: [],
    how: `Aliments fermentés (kéfir, yaourt nature, choucroute, kimchi) ou un complément. Plutôt après la phase aiguë, ou en soutien intestinal.`,
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
    extra: [`Ne pas rincer la gorge ni boire juste après : laisser le miel agir dans la gorge.`, `Apaise la gorge et la toux, notamment la nuit.`],
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
  echinacee: `Dose réduite, quelques jours seulement.`,
  pin: `Tisane légère, bien diluée.`,
  lavage: `Version douce, selon l’âge. Ne pas forcer.`,
  zinc: `Selon le poids, avec un avis. Ne pas reprendre 15 à 30 mg.`,
  betadine: `À partir de 6 ans, sous surveillance : 1 vaporisation, jusqu’à 3 fois par jour. Pas avant.`,
  pastilles: `Selon l’âge indiqué sur la boîte. Pas les pastilles fortes d’adulte.`,
  vitamines: `Selon l’âge. Ne pas donner 2 000 à 4 000 UI sans avis.`,
  'vitamine-c-double': `Dose selon l’âge : demander au pharmacien avant de doubler.`,
  argent: `À éviter chez l’enfant.`,
  peroxyde: `À éviter, ou seulement avec un avis. Pas dans les oreilles d’un jeune enfant.`,
  sureau: `Dose réduite. Commencer très peu pour voir la tolérance.`,
  probiotiques: `Selon le produit et l’âge. Préférer un aliment fermenté doux.`,
  origan: `Déconseillée.`,
  reglisse: `Usage limité, et pas en continu.`,
  thym: `Tisane légère plutôt que le sirop concentré.`,
  miel: `À partir de 1 an seulement. Jamais avant.`,
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
      `2 cm de gingembre frais, râpé ou tranché`,
      `Jus d’un demi-citron`,
      `1 c. à café de miel, ajouté après infusion`,
      `250 ml d’eau chaude`,
    ],
    steps: [
      `Infuser le gingembre 8 à 10 minutes.`,
      `Ajouter citron et miel hors du feu.`,
    ],
    use: `3 à 4 tasses par jour. Utile pour la gorge et la congestion.`,
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
    intro: `Le lavage nasal dégage les sinus, réduit la congestion et limite la prolifération des pathogènes. 1 à 3 fois par jour selon l’intensité.`,
    blocks: [
      {
        title: `Solution saline, la plus douce`,
        items: [
          `1 tasse (250 ml) d’eau tiède, bouillie ou filtrée`,
          `½ à 1 c. à café de sel non iodé, ou sel de mer fin`,
          `Optionnel : ½ c. à café de bicarbonate de soude, pour adoucir`,
        ],
        note: `Dissoudre. Pot neti, seringue ou flacon spray. Incliner la tête, faire passer d’une narine à l’autre, puis se moucher doucement.`,
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
  detail: `Les soins naturels aident ton système à se défendre.`,
  choice: `Dès les premiers signes, agir tôt sur le mal de gorge, avec des gestes simples et réguliers.`,
};

export const A_FAIRE = [
  `Frapper fort dès le mal de gorge`,
  `Très chaud la nuit, tuque comprise, sans fièvre, mal de tête ni frissons`,
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
    lead: `2. Peroxyde d’hydrogène`,
    detail: `Gargarismes pour un contact prolongé. Puissant, moins pratique que le spray.`,
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
    detail: `Dès les premiers symptômes, doubler sa dose habituelle pendant la durée du rhume.`,
  },
];

export const GORGE_GESTES = [
  {
    lead: `1. Spray povidone-iode 0,45 %`,
    detail: `Spray Betadine pour la gorge. Le plus direct dès les premiers signes. Souvent à partir de 6 ans : suivre l’étiquette.`,
  },
  {
    lead: `2. Peroxyde`,
    detail: `1 c. à soupe de peroxyde 3 % food grade + 1 c. à soupe d’eau. Contact prolongé. Recracher, ne jamais avaler. Bouteille à l’abri du soleil.`,
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

export const PENDANT_MALADIE = [
  `Humidifier l’air de la chambre, surtout en hiver.`,
  `Surélever légèrement la tête pour mieux dormir en cas de congestion.`,
  `Dormir au chaud. Le corps doit rester bien couvert. Un bonnet la nuit limite les pertes de chaleur par la tête.`,
  `Rester au chaud et éviter les changements de température brusques.`,
  `Surveiller la température. Adapter le protocole en cas de mal de tête intense ou de frissons importants.`,
  `Se laver le nez à l’eau salée plusieurs fois par jour.`,
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
