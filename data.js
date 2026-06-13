// ══════════════════════════════════════════════════════════════════
//  data.js — DRENAET Agboville
//  Direction Régionale de l'Éducation Nationale de l'alphabétisation 
//  et de l'Enseignement Technique d'Agboville
//  Mis à jour : Juin 2026
// ══════════════════════════════════════════════════════════════════

const DATA = {

  // ── MOT DE PASSE UNIQUE ─────────────────────────────────────────
  mot_de_passe: "2026",  // ← Changer ici pour modifier le mot de passe

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
      {
        id:    "secretariat",
        nom:   "Secrétariat",
        icone: "📝",
        agents: [
          // Exemple : { nom:"NOM PRÉNOM", poste:"Secrétaire", matricule:"", contact:"", photo:"", statut:"present", anciennete:"" }
        ]
      },
      {
        id:    "informatique",
        nom:   "Service Informatique",
        icone: "💻",
        agents: []
      },
      {
        id:    "rh",
        nom:   "Service Ressources Humaines",
        icone: "👥",
        agents: []
      },
      {
        id:    "examens",
        nom:   "Examens & Concours",
        icone: "🎓",
        agents: []
      },
      {
        id:    "courriers_archives",
        nom:   "Courriers & Archives",
        icone: "📂",
        agents: []
      }
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
