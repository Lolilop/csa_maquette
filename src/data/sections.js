// Sample sections data for the CSA website
export const sections = [
  // Added hasDetailPage field to determine if a section has a dedicated page
  // Added detailPageContent field for sections with dedicated pages
  {
    id: 1,
    name: "Tir à l'Arc",
    category: "sport",
    description: "Développez votre précision et votre concentration dans notre section de tir à l'arc, ouverte aux débutants comme aux archers confirmés.",
    fullDescription: "Développez votre précision et votre concentration dans notre section de tir à l'arc. Notre équipe d'encadrants passionnés vous accueille quel que soit votre niveau, du débutant complet au tireur confirmé. Nous disposons d'un pas de tir couvert permettant une pratique tout au long de l'année, ainsi que d'un terrain extérieur pour les beaux jours. Notre club participe régulièrement aux compétitions départementales et régionales, avec plusieurs podiums chaque année.",
    image: "/assets/images/archery.jpg",
    features: ["Tous niveaux", "Matériel fourni", "Compétitions"],
    schedule: "Mardi et Jeudi 18h-20h",
    additionalSchedule: ["Entraînement libre: Samedi 14h-17h", "Séances jeunes: Mercredi 14h-16h"],
    pricing: ["Adhésion annuelle: 180€", "Tarif réduit (étudiants, chômeurs): 140€", "Licence compétition: +30€"],
    instructors: [
      { name: "Michel Dupont", title: "Entraîneur diplômé d'État" },
      { name: "Sarah Martin", title: "Championne régionale 2023" }
    ],
    equipment: ["Arc d'initiation", "Flèches", "Plastron et protections", "Cibles fixes et mobiles"],
    hasDetailPage: true,
    detailPageContent: {
      heroTitle: "Section Tir à l'Arc",
      heroSubtitle: "Précision, concentration et convivialité",
      sections: [
        {
          title: "Présentation de la section",
          content: "<p>Bienvenue dans notre section de tir à l'arc, un sport qui allie précision, concentration et maîtrise de soi. Notre club accueille les archers de tous niveaux, des débutants aux compétiteurs avancés, dans une ambiance conviviale et bienveillante.</p><p>Le tir à l'arc développe non seulement la précision et la concentration, mais aussi la force physique, la posture et la respiration contrôlée. C'est un sport qui peut se pratiquer à tout âge et qui offre une progression gratifiante au fil du temps.</p>"
        },
        {
          title: "Nos infrastructures",
          content: "<p>Notre section dispose d'excellentes installations:</p><ul><li>Un pas de tir couvert de 18m avec 10 cibles</li><li>Un terrain extérieur permettant des tirs jusqu'à 70m</li><li>Une salle d'échauffement et de préparation physique</li><li>Un atelier d'entretien et de réglage des équipements</li></ul><p>Ces installations sont accessibles selon les horaires d'entraînement et lors des séances libres pour les membres confirmés.</p>"
        },
        {
          title: "Événements et compétitions",
          content: "<p>Tout au long de l'année, notre section organise et participe à divers événements:</p><ul><li>Tournoi interne trimestriel</li><li>Championnats départementaux et régionaux</li><li>Journées découvertes pour le public</li><li>Stages intensifs pendant les vacances scolaires</li></ul><p>La participation aux compétitions n'est pas obligatoire mais fortement encouragée pour progresser et vivre pleinement l'esprit du club!</p>"
        }
      ],
      galleryImages: [
        "/assets/images/archery_gallery_1.jpg",
        "/assets/images/archery_gallery_2.jpg",
        "/assets/images/archery_gallery_3.jpg"
      ]
    }
  },
  {
    id: 2,
    name: "Couture",
    category: "art",
    description: "Apprenez à coudre vos propres créations, de la réparation simple aux projets plus complexes, dans une ambiance conviviale et créative.",
    fullDescription: "Apprenez à coudre vos propres créations dans une ambiance conviviale et créative. Notre atelier de couture vous accueille pour des projets variés allant de la simple réparation aux réalisations plus ambitieuses. Vous pourrez utiliser nos machines à coudre et surjeteuses professionnelles, et bénéficier des conseils de nos animatrices expérimentées. Des projets collectifs sont régulièrement organisés, comme la confection de costumes pour le spectacle annuel de l'association ou des créations pour des événements caritatifs.",
    image: "/assets/images/sewing.jpg",
    features: ["Débutants bienvenus", "Machines fournies", "Projets collectifs"],
    schedule: "Lundi 14h-17h, Samedi 10h-12h",
    additionalSchedule: ["Atelier libre: Mercredi 19h-21h"],
    pricing: ["Adhésion annuelle: 160€", "Matériaux de base inclus", "Tarif famille (à partir de 2 personnes): -10%"],
    instructors: [
      { name: "Marie Lefèvre", title: "Couturière professionnelle" },
      { name: "Jeanne Dubois", title: "Animatrice textile" }
    ],
    equipment: ["Machines à coudre", "Surjeteuses", "Table de coupe", "Matériel de base"]
  },
  {
    id: 3,
    name: "Course à pied",
    category: "sport",
    description: "Rejoignez notre groupe de coureurs pour des entraînements adaptés à votre niveau et préparez ensemble des événements sportifs locaux.",
    fullDescription: "Rejoignez notre groupe de coureurs pour des entraînements adaptés à votre niveau et préparez ensemble des événements sportifs locaux. Notre section course à pied s'adresse aussi bien aux débutants qui souhaitent se mettre à la course qu'aux coureurs plus expérimentés cherchant à améliorer leurs performances. Nous proposons différents parcours en ville et dans les espaces naturels environnants. Plusieurs fois par an, nous participons collectivement à des courses locales et régionales, avec un accompagnement spécifique pour les préparations aux semi-marathons et marathons.",
    image: "/assets/images/running.jpg",
    features: ["Tous niveaux", "Sorties nature", "Préparation compétition"],
    schedule: "Mercredi 18h30, Dimanche 9h30",
    additionalSchedule: ["Entraînement spécifique compétition: Vendredi 18h30", "Séances de fractionné: Lundi 19h"],
    pricing: ["Adhésion annuelle: 120€", "Tenue du club (optionnelle): 40€"],
    instructors: [
      { name: "Thomas Bernard", title: "Coach sportif certifié" },
      { name: "Lucie Moreau", title: "Marathonienne" }
    ],
    equipment: ["Chaussures de running adaptées", "Vêtements techniques recommandés", "Montre GPS (optionnelle)"],
    hasDetailPage: true,
    detailPageContent: {
      heroTitle: "Section Course à Pied",
      heroSubtitle: "Courir ensemble, progresser et se dépasser",
      sections: [
        {
          title: "Notre approche",
          content: "<p>Notre section course à pied est bien plus qu'un simple club de running. Nous formons une véritable communauté de passionnés où chacun trouve sa place, quel que soit son niveau ou ses objectifs.</p><p>Débutants souhaitant débuter la course de façon progressive et sécurisée, coureurs réguliers cherchant à améliorer leurs performances, ou sportifs confirmés préparant des objectifs ambitieux, nos coachs vous accompagnent et adaptent les entraînements selon vos besoins.</p>"
        },
        {
          title: "Nos entraînements",
          content: "<p>Nous proposons plusieurs types de séances pour une progression complète:</p><ul><li><strong>Sorties longues</strong> pour développer l'endurance (dimanche matin)</li><li><strong>Séances de fractionné</strong> pour travailler la vitesse et la VO2max (lundi soir)</li><li><strong>Entraînements techniques</strong> avec travail des côtes, du seuil et de la foulée (mercredi soir)</li><li><strong>Préparation spécifique</strong> pour les compétitions (vendredi soir)</li></ul><p>Chaque séance commence par un échauffement collectif et se termine par des étirements et un moment convivial.</p>"
        },
        {
          title: "Événements et compétitions",
          content: "<p>Tout au long de l'année, nous participons à de nombreuses courses:</p><ul><li>Courses locales (10km, trails, courses nature)</li><li>Semi-marathons et marathons régionaux</li><li>Challenge club avec classement interne</li><li>Week-end annuel sportif et convivial</li></ul><p>La participation n'est jamais obligatoire mais toujours encouragée. L'esprit d'équipe et le plaisir de courir ensemble restent nos principales motivations!</p>"
        }
      ],
      galleryImages: [
        "/assets/images/running_gallery_1.jpg",
        "/assets/images/running_gallery_2.jpg",
        "/assets/images/running_gallery_3.jpg"
      ]
    }
  },
  {
    id: 4,
    name: "Photographie",
    category: "art",
    description: "Perfectionnez votre technique photographique et partagez votre passion lors de sorties thématiques et d'ateliers pratiques.",
    image: "/assets/images/photography.jpg",
    features: ["Sorties photo", "Ateliers techniques", "Expositions"],
    schedule: "Jeudi 19h, un weekend par mois"
  },
  {
    id: 5,
    name: "Natation",
    category: "sport",
    description: "De l'apprentissage au perfectionnement, nos maîtres-nageurs vous accompagnent pour progresser à votre rythme dans une ambiance détendue.",
    image: "/assets/images/swimming.jpg",
    features: ["Tous âges", "Cours collectifs", "Ligne d'eau réservée"],
    schedule: "Lundi, Mercredi, Vendredi 19h-21h"
  },
  {
    id: 6,
    name: "Théâtre",
    category: "art",
    description: "Explorez votre créativité, développez votre confiance en vous et vivez l'expérience unique de la scène avec notre troupe de théâtre.",
    image: "/assets/images/theater.jpg",
    features: ["Improvisation", "Représentations", "Tous niveaux"],
    schedule: "Mardi 19h-21h30"
  },
  {
    id: 7,
    name: "Tennis",
    category: "sport",
    description: "Du mini-tennis à la compétition, notre section vous propose des cours adaptés et des terrains disponibles pour jouer librement.",
    image: "/assets/images/tennis.jpg",
    features: ["Cours collectifs", "Tournois internes", "Tous âges"],
    schedule: "Du lundi au samedi, horaires variés"
  },
  {
    id: 8,
    name: "Peinture",
    category: "art",
    description: "Initiez-vous aux différentes techniques picturales ou perfectionnez votre style dans une ambiance détendue et inspirante.",
    image: "/assets/images/painting.jpg",
    features: ["Techniques variées", "Matériel fourni", "Expositions"],
    schedule: "Mercredi 16h-18h, Samedi 14h-17h"
  },
  {
    id: 9,
    name: "Yoga",
    category: "bien-être",
    description: "Retrouvez équilibre et sérénité avec nos cours de yoga adaptés à tous les niveaux, pour un bien-être physique et mental.",
    fullDescription: "Retrouvez équilibre et sérénité avec nos cours de yoga adaptés à tous les niveaux. Notre section yoga propose différentes approches et styles pour répondre aux besoins de chacun: hatha yoga traditionnel, vinyasa plus dynamique, ou yin yoga pour un travail plus profond. Les séances incluent des postures (asanas), des exercices de respiration (pranayama) et des moments de méditation. Nos professeurs diplômés vous guident pour une pratique respectueuse de votre corps et adaptée à vos capacités, dans une atmosphère bienveillante et non compétitive.",
    image: "/assets/images/yoga.jpg",
    features: ["Tous niveaux", "Plusieurs styles", "Méditation"],
    schedule: "Lundi et Jeudi 12h-13h, Mardi 19h-20h30",
    additionalSchedule: ["Hatha Yoga: Lundi et Jeudi 12h-13h", "Vinyasa Flow: Mardi 19h-20h30", "Yin Yoga: Vendredi 18h-19h"],
    pricing: ["Adhésion annuelle: 210€", "Carte 10 séances: 120€", "Séance découverte gratuite"],
    instructors: [
      { name: "Elena Costa", title: "Professeur de yoga certifiée RYT-500" },
      { name: "David Nguyen", title: "Spécialiste en yoga thérapeutique" }
    ],
    equipment: ["Tapis de yoga", "Couverture", "Briques et sangles disponibles", "Tenue confortable recommandée"],
    hasDetailPage: true,
    detailPageContent: {
      heroTitle: "Section Yoga",
      heroSubtitle: "Équilibre, sérénité et bien-être",
      sections: [
        {
          title: "Bienvenue dans notre espace zen",
          content: "<p>Notre section yoga vous invite à découvrir ou approfondir une pratique millénaire aux multiples bienfaits. Dans un cadre calme et bienveillant, nous proposons différentes approches du yoga pour répondre aux besoins et aux objectifs de chacun.</p><p>Que vous cherchiez à réduire votre stress, améliorer votre souplesse, renforcer votre corps ou simplement prendre un moment pour vous, nos cours s'adaptent à tous les niveaux et toutes les conditions physiques.</p>"
        },
        {
          title: "Nos styles de yoga",
          content: "<p>Nous proposons plusieurs styles de yoga pour varier les pratiques et répondre à vos besoins:</p><ul><li><strong>Hatha Yoga:</strong> Approche traditionnelle équilibrée, idéale pour les débutants</li><li><strong>Vinyasa Flow:</strong> Pratique dynamique reliant souffle et mouvement</li><li><strong>Yin Yoga:</strong> Pratique passive et méditative, postures tenues longtemps</li><li><strong>Yoga Restauratif:</strong> Séances douces et réparatrices avec accessoires</li></ul><p>Chaque cours inclut des postures (asanas), des exercices de respiration (pranayama) et se termine par une relaxation profonde.</p>"
        },
        {
          title: "Bienfaits et philosophie",
          content: "<p>Au-delà de l'aspect physique, notre enseignement intègre les dimensions philosophiques et spirituelles du yoga. Nous vous invitons à:</p><ul><li>Développer votre conscience corporelle</li><li>Apaiser votre mental par la méditation</li><li>Harmoniser votre souffle et votre énergie vitale</li><li>Cultiver bienveillance et non-violence envers vous-même et les autres</li></ul><p>Des ateliers thématiques sont régulièrement proposés pour approfondir certains aspects de la pratique comme la méditation, la philosophie yogique ou l'anatomie appliquée au yoga.</p>"
        }
      ],
      galleryImages: [
        "/assets/images/yoga_gallery_1.jpg",
        "/assets/images/yoga_gallery_2.jpg",
        "/assets/images/yoga_gallery_3.jpg"
      ]
    }
  }
];