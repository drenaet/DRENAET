// ══════════════════════════════════════════════════════════════════
//  data.js — DRENAET Agboville
//  Direction Régionale de l'Éducation Nationale de l'alphabétisation 
//  et de l'Enseignement Technique d'Agboville
//  Mis à jour : Juin 2026
// ══════════════════════════════════════════════════════════════════

const DATA = {

  // ── MOT DE PASSE UNIQUE ─────────────────────────────────────────
  mot_de_passe: "2026",  // ← Changer ici pour modifier le mot de passe

  // ── GOOGLE SHEETS — IDs des formulaires ────────────────────────
  // L'ID se trouve dans l'URL : docs.google.com/spreadsheets/d/ ICI /edit
  sheets: {
    secondaires_prives:  "1zPe70IuACqRoDRwFWl570eP7jMHRABEd_KMKT_jwvh4",
    secondaires_publics: "1h8m4MBr0ONq3q1bRqLqWZA1GlvsMP6ATfHJXnJ7mhv0",

    // ── SHEET UNIQUE ÉCOLES IEPP ─────────────────────────────────
    // Un seul Google Form collecte toutes les écoles (IEPP 1/2/3,
    // Primaire/Maternelle, Public/Privé).
    // Les réponses arrivent dans l'onglet "Ecoles actives".
    // La fonction distributeEcoles() analyse et distribue automatiquement.
    ecoles_iepp: "1l-hszH2MfKtLxd8GgM7HnwMuiJP5jm2Y4_HARJMW90w",  // ← collez ici l'ID de votre Google Sheet unique IEPP

    // Nom exact de l'onglet dans le Sheet (sensible à la casse)
    ecoles_iepp_onglet: "Ecoles actives",

    // ── CORRESPONDANCE DES COLONNES DU FORM ──────────────────────
    // Modifiez ces valeurs si les intitulés de vos questions changent.
    ecoles_iepp_colonnes: {
      INSPECTION:    "Inspection",        // Colonne A — liste déroulante IEPP
      CYCLE:         "Cycle",             // Colonne B — liste déroulante Primaire/Maternelle
      TYPE:          "Type",              // Colonne C — réponse courte Public/Privé
      CODE_ECOLE:    "Code de l'ecole",   // Colonne D
      NOM_ECOLE:     "Nom de l'école",    // Colonne E
      NB_CLASSES:      "Nombre de classes",      // Colonne F
      NB_ELEVES:       "Nombres d'élèves",        // Colonne G
      NB_ENSEIGNANTS:  "Nombre d'enseignants",    // Colonne H  ← nouveau
      NOM_DIRECTEUR:   "Nom du Directeur",        // Colonne I
    },

    // Sheet du personnel admin
    admin:        "1sOOO6-XV76-vQ8k34MH07sm9miK-SL_2MjnIt4Yi_Po",           // ← ID du Google Sheet personnel DRENAET
    admin_onglet: "Personnel",  // ← Nom exact de l'onglet

    // Colonnes exactes de votre Sheet (en-têtes tels qu'ils apparaissent)
    admin_colonnes: {
      SERVICE:   "Services",    // Colonne A
      NOM:       "Nom_Prenoms", // Colonne B
      MATRICULE: "Matricule",   // Colonne C
      CONTACT:   "Contact",     // Colonne D
    },
  },

  // ── MÉDIAS ──────────────────────────────────────────────────────
  facebook:              "",   // ← URL page Facebook
  telegram:              "",   // ← URL canal Telegram
  mot_de_passe_telegram: "",   // ← Mot de passe Telegram (facultatif)

  // ── INFORMATIONS GÉNÉRALES ──────────────────────────────────────
  info: {
    slogan: "« Œuvrer à l'amélioration de la qualité de l'enseignement et de la formation professionnelle dans la région d'Agboville. »",
    adresse: "Agboville, Côte d'Ivoire",
    email:   "non_defini@",
    annonces: [
      {
        type:    "info",
        couleur: "blue",
        emoji:   "📋",
        titre:   "Bienvenue sur le portail DRENAET Agboville",
        texte:   "Plateforme officielle de la Direction Régionale de l'Éducation Nationale de l'alphabétisation et de l'Enseignement Technique d'Agboville. Toutes les informations sur les établissements et le personnel.",
        date:    "Juin 2026"
      },
      {
        type:    "urgent",
        couleur: "orange",
        emoji:   "📢",
        titre:   "Collecte des données en cours",
        texte:   "Les établissements secondaires sont invités à renseigner leurs informations via le formulaire Google Forms transmis par la DRENAET.",
        date:    "Juin 2026"
      }
    ]
  },

  // ── DIRECTION ───────────────────────────────────────────────────
  direction: {
    chef_nom:      "",              // ← Nom du Directeur Régional
    chef_titre:    "Directeur Régional",
    chef_photo:    "",
    chef_contact:  "",
    chef_matricule:"",

    sg_nom:        "",              // ← Nom du Secrétaire Général
    sg_titre:      "Secrétaire Général",
    sg_photo:      "",
    sg_contact:    "",
    sg_matricule:  "",
  },

  // ── PERSONNEL ADMINISTRATIF ─────────────────────────────────────
  personnel_admin: {
    services: [
      { id:"sécretariat", nom:"Secrétariat",         icone:"📝", agents:[] },
      { id:"examens",     nom:"Examens et Concours", icone:"🎓", agents:[] },
      { id:"rh",          nom:"Ressources Humaines", icone:"👥", agents:[] },
      { id:"informatique",nom:"Informatique",         icone:"💻", agents:[] },
      { id:"economat",    nom:"Economat",             icone:"💰", agents:[] },
      { id:"autre",       nom:"Autre",                icone:"📋", agents:[] },
    ]
  },

  // ── ÉTABLISSEMENTS SECONDAIRES PRIVÉS ───────────────────────────
  // Remplis via Google Form → Google Sheet → script Apps Script
  secondaires_prives: [
    // Exemple :
    // { id:1, numero:1, code:'', nom:"NOM ÉTABLISSEMENT", chef_nom:"", chef_contact:"",
    //   profs:{ francais:0, maths:0, phychim:0, svt:0, hg:0, anglais:0, allemand:0, espagnol:0, edhc:0, eps:0, artplast:0, musique:0 } }
  ],

  // ── ÉTABLISSEMENTS SECONDAIRES PUBLICS ──────────────────────────
  secondaires_publics: [
    // Exemple :
    // { id:50, numero:1, code:'', nom:"LYCEE MODERNE D'AGBOVILLE", sous_type:'Lycée Moderne',
    //   chef_nom:"", chef_contact:"",
    //   profs:{ francais:0, maths:0, phychim:0, svt:0, hg:0, anglais:0, allemand:0, espagnol:0, edhc:0, eps:0, artplast:0, musique:0 } }
  ],

  // ── INSPECTIONS (IEPP) ──────────────────────────────────────────
  // Chaque IEPP gère ses établissements primaires et préscolaires
  iepp: [
    {
      id:           "iepp1",
      nom:          "IEPP 1 AGBOVILLE",
      icone:        "🏫",
      couleur:      "#1565C0",   // bleu
      inspecteur_nom:      "",
      inspecteur_contact:  "",
      inspecteur_photo:    "",
      adjoint_nom:         "",
      adjoint_contact:     "",
      adjoint_photo:       "",

      // Google Sheet IDs pour cette inspection (à remplir)
      sheet_primaires_publics:  "",  // ← ID du Google Sheet IEPP1 primaires publics
      sheet_primaires_prives:   "",  // ← ID du Google Sheet IEPP1 primaires privés
      sheet_prescolaires_publics: "",
      sheet_prescolaires_prives:  "",

      primaires_publics:   [],  // rempli depuis Google Sheet
      primaires_prives:    [],
      prescolaires_publics:[],
      prescolaires_prives: [],
    },
    {
      id:           "iepp2",
      nom:          "IEPP 2 AGBOVILLE",
      icone:        "🏫",
      couleur:      "#10B981",   // vert
      inspecteur_nom:      "",
      inspecteur_contact:  "",
      inspecteur_photo:    "",
      adjoint_nom:         "",
      adjoint_contact:     "",
      adjoint_photo:       "",

      sheet_primaires_publics:  "",
      sheet_primaires_prives:   "",
      sheet_prescolaires_publics: "",
      sheet_prescolaires_prives:  "",

      primaires_publics:   [],
      primaires_prives:    [],
      prescolaires_publics:[],
      prescolaires_prives: [],
    },
    {
      id:           "iepp3",
      nom:          "IEPP 3 AGBOVILLE",
      icone:        "🏫",
      couleur:      "#F59E0B",   // ambre
      inspecteur_nom:      "",
      inspecteur_contact:  "",
      inspecteur_photo:    "",
      adjoint_nom:         "",
      adjoint_contact:     "",
      adjoint_photo:       "",

      sheet_primaires_publics:  "",
      sheet_primaires_prives:   "",
      sheet_prescolaires_publics: "",
      sheet_prescolaires_prives:  "",

      primaires_publics:   [],
      primaires_prives:    [],
      prescolaires_publics:[],
      prescolaires_prives: [],
    }
  ],

  // ── COURRIERS ───────────────────────────────────────────────────
  courriers: [
    // Exemple :
    // {
    //   mois: "Janvier 2026",
    //   icone: "📅",
    //   arrives: [
    //     { num:"A001", date:"03/01/2026", objet:"Convocation réunion", expediteur:"DRENA", obs:"traite", pdf:"" }
    //   ],
    //   departs: [
    //     { num:"D001", date:"05/01/2026", objet:"Rapport mensuel", destinataire:"MENA", obs:"info", pdf:"" }
    //   ]
    // }
  ],

  // ── GALERIE PHOTOS ──────────────────────────────────────────────
  galerie: [
    // Exemple : { url:"https://...", legende:"Réunion de rentrée" }
  ],

};
