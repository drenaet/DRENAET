// ══ AUTH ══════════════════════════════════════════════════
let isConnected = false;
const PROTECTED_PAGES = ['admin'];

function openPwd() {
  document.getElementById('pwd-input').value = '';
  document.getElementById('pwd-error').classList.remove('show');
  document.getElementById('pwd-overlay').classList.add('show');
  setTimeout(()=>document.getElementById('pwd-input').focus(), 300);
}
function closePwd() {
  document.getElementById('pwd-overlay').classList.remove('show');
  // Revenir à la page précédente dans l'historique si on était sur une page protégée
  const current = location.hash.replace('#','') || 'info';
  if (PROTECTED_PAGES.includes(current)) {
    history.back();
  }
}
// Fermer avec la touche Échap (globale)
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if (document.getElementById('pwd-overlay').classList.contains('show')) closePwd();
  }
});
function checkPwd() {
  const val = document.getElementById('pwd-input').value;
  const mdp = DATA.mot_de_passe || 'drenaet2026';
  if (val === mdp) {
    isConnected = true;
    document.getElementById('pwd-overlay').classList.remove('show');
    const btn = document.getElementById('btn-connect');
    btn.textContent = '✅ Connecté';
    btn.classList.add('connected');
    btn.onclick = handleLogout; // Active le bouton pour la déconnexion
    document.getElementById('nav-btn-admin').style.display = 'flex'; // Affiche l'onglet Admin
  } else {
    document.getElementById('pwd-error').classList.add('show');
    const box = document.getElementById('pwd-box');
    box.style.animation = 'none'; box.offsetHeight;
    box.style.animation = 'shake .4s ease';
    document.getElementById('pwd-input').value = '';
    document.getElementById('pwd-input').focus();
  }
}

// Ouvre la fenêtre de déconnexion moderne
function handleLogout() {
  document.getElementById('logout-overlay').classList.add('show');
}

// Ferme la fenêtre si on clique sur Annuler
function closeLogoutModal() {
  document.getElementById('logout-overlay').classList.remove('show');
}

// Exécute la déconnexion réelle si on clique sur "Se déconnecter"
function confirmLogout() {
  closeLogoutModal();
  isConnected = false;
  const btn = document.getElementById('btn-connect');
  btn.innerHTML = '🔐 Connexion';
  btn.classList.remove('connected');
  btn.onclick = openPwd; // Redonne l'action de connexion
  document.getElementById('nav-btn-admin').style.display = 'none'; // Masque l'onglet Admin
  showPage('info'); // Sortie sécurisée vers la page Info
  }
function togglePwdEye() {
  const inp = document.getElementById('pwd-input');
  const eye = document.getElementById('pwd-eye');
  if(inp.type==='password'){inp.type='text';eye.textContent='🙈';}
  else{inp.type='password';eye.textContent='👁️';}
}

// ══ NAVIGATION avec historique ════════════════════════════
function showPage(name, addToHistory = true) {
  if (PROTECTED_PAGES.includes(name) && !isConnected) {
    openPwd();
    return;
  }

  // Push dans l'historique du navigateur
  if (addToHistory) {
    history.pushState({ page: name }, '', '#' + name);
  }

  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.s-item').forEach(b => b.classList.remove('active'));

  const pg = document.getElementById('page-' + name);
  if (pg) pg.classList.add('active');

  const nb = document.querySelector(`.nav-btn[onclick="showPage('${name}')"]`);
  if (nb) nb.classList.add('active');

  const sb = document.getElementById('s-' + name);
  if (sb) sb.classList.add('active');

  document.getElementById('app').scrollTop = 0;
}

// Bouton retour natif du navigateur / téléphone
window.addEventListener('popstate', function(e) {
  const name = e.state?.page || 'info';
  showPage(name, false); // false = ne pas re-pusher dans l'historique
});

// ══ BADGE PUBLIC SECONDAIRE ════════════════════════════════
function badgeSecondaire(e, isPrive) {
  if (isPrive) return { bc:'prive', label:'Privé' };
  const nom = (e.nom||'').toUpperCase();
  if (nom.startsWith('LYCEE')||nom.startsWith('LYCÉE')) return { bc:'lycee', label:'Lycée Moderne' };
  if (nom.startsWith('COLLEGE')||nom.startsWith('COLLÈGE')) return { bc:'public', label:'Collège Moderne' };
  if (nom.startsWith('CETF')) return { bc:'cetf', label:'CETF' };
  if (nom.startsWith('CEG')) return { bc:'cetf', label:'CEG' };
  const st = e.sous_type||'';
  let bc = e.badge_class||'public';
  if(st.toLowerCase().includes('lycée')||st.toLowerCase().includes('lycee')) bc='lycee';
  else if(st==='CETF'||st==='CEG') bc='cetf';
  return { bc, label: st||'Public' };
}

// ══ RENDER ALL ════════════════════════════════════════════
function renderAll() {
  const secPrives  = (DATA.secondaires_prives||[]).filter(e=>e.chef_nom&&e.chef_nom.trim()!=='');
  const secPublics = (DATA.secondaires_publics||[]).filter(e=>e.chef_nom&&e.chef_nom.trim()!=='');
  const nbSecPr = secPrives.length;
  const nbSecPu = secPublics.length;
  const nbSecTotal = nbSecPr + nbSecPu;

  // Compter primaires & préscolaires
  let nbPrimTotal=0;
  (DATA.iepp||[]).forEach(i=>{
    nbPrimTotal += (i.primaires_publics||[]).length + (i.primaires_prives||[]).length
                 + (i.prescolaires_publics||[]).length + (i.prescolaires_prives||[]).length;
  });

  const nbAgents = (DATA.personnel_admin?.services||[]).reduce((s,sv)=>s+(sv.agents||[]).length,0);

  // Courriers
  let nbArr=0, nbDep=0;
  (DATA.courriers||[]).forEach(m=>{nbArr+=(m.arrives||[]).length;nbDep+=(m.departs||[]).length;});
  const nbCour = nbArr+nbDep;

  // KPI hero accueil
  setText('kpi-sec-prives', nbSecPr);
  setText('kpi-sec-publics', nbSecPu);
  setText('kpi-primaires', nbPrimTotal);
  setText('kpi-agents', nbAgents||'—');
  setText('kpi2-secondaires', nbSecTotal);
  setText('kpi2-primaires', nbPrimTotal);
  setText('kpi2-agents', nbAgents||'—');
  setText('kpi2-courriers', nbCour||'—');

  // KPI page secondaires
  const lycees  = secPublics.filter(e=>badgeSecondaire(e,false).bc==='lycee').length;
  const colleges= secPublics.filter(e=>badgeSecondaire(e,false).bc==='public').length;
  const cetf    = secPublics.filter(e=>badgeSecondaire(e,false).bc==='cetf').length;
  setText('kp-sec-total',   nbSecTotal);
  setText('kp-sec-prives',  nbSecPr);
  setText('kp-sec-publics', nbSecPu);
  setText('kp-sec-lycees',  lycees);
  setText('kp-sec-colleges',colleges);
  setText('kp-sec-cetf',    cetf);
  setText('pill-sec-prives', nbSecPr);
  setText('pill-sec-publics', nbSecPu);
  setText('cnt-secondaires', nbSecTotal||'—');
  setText('cnt-admin', nbAgents||'—');

  // KPI IEPP
  let nbPrimPub=0, nbPrimPri=0, nbPresPub=0, nbPresPri=0;
  (DATA.iepp||[]).forEach(i=>{
    nbPrimPub+=(i.primaires_publics||[]).length;
    nbPrimPri+=(i.primaires_prives||[]).length;
    nbPresPub+=(i.prescolaires_publics||[]).length;
    nbPresPri+=(i.prescolaires_prives||[]).length;
  });
  setText('kp-iepp-total', nbPrimPub+nbPrimPri+nbPresPub+nbPresPri);
  setText('kp-iepp-primaires', nbPrimPub+nbPrimPri);
  setText('kp-iepp-prescolaires', nbPresPub+nbPresPri);

  // Courriers KPI

  renderInfo();
  renderDirection();
  renderSecondaires();
  renderIEPP();
  renderAdmin();
  renderCharts();
  renderFooter();
  renderGalerie();
}

function setText(id, val) {
  const el=document.getElementById(id);
  if(el) el.textContent=val;
}

 // Extrait l'ID d'un fichier Google Drive depuis n'importe quel format de lien
function extractDriveId(url) {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();
  const match = trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/) || trimmed.match(/id=([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
}

 // Convertit un lien Google Drive en URL d'image directe (serveur lh3)
function driveToDirectImg(url) {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (!trimmed) return '';
  // Si c'est déjà une URL directe d'image (jpg, png, etc.) et pas un lien Drive, on la renvoie telle quelle
  if (trimmed.match(/\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i) && !trimmed.includes('drive.google.com') && !trimmed.includes('docs.google.com')) {
    return trimmed;
  }
  // Si c'est un lien de partage Google Drive ou Google Forms
  if (trimmed.includes('drive.google.com') || trimmed.includes('docs.google.com')) {
    const id = extractDriveId(trimmed);
    if (id) {
      return `https://lh3.googleusercontent.com/d/${id}`;
    }
  }
  return trimmed; // fallback
}

// URL de secours si la première (lh3) ne charge pas — utilise le format "thumbnail"
// qui est souvent plus tolérant vis-à-vis des réglages de partage Google Drive
function driveFallbackImg(url) {
  const id = extractDriveId(url);
  return id ? `https://drive.google.com/thumbnail?id=${id}&sz=w500` : '';
}

// Gère l'échec de chargement d'une photo : tente l'URL de secours,
// puis affiche l'avatar avec les initiales si tout échoue
function handleAgentPhotoError(img) {
  const fallback = img.getAttribute('data-fallback');
  if (fallback && img.getAttribute('src') !== fallback && !img.dataset.triedFallback) {
    img.dataset.triedFallback = '1';
    img.src = fallback;
    return;
  }
  img.style.display = 'none';
  const sib = img.nextElementSibling;
  if (sib) sib.style.display = 'flex';
}

function convertirMarkdown(texte) {
  if (!texte) return '';
  // Échapper le HTML pour éviter les injections (sauf si vous faites confiance aux contributeurs)
  let html = texte
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
  
  // Italique : *texte* ou _texte_
  html = html.replace(/(?:^|\s)\*([^*]+)\*(?=\s|$)/g, ' <i>$1</i>');
  html = html.replace(/(?:^|\s)_([^_]+)_(?=\s|$)/g, ' <i>$1</i>');
  
  // Gras : **texte** ou __texte__
  html = html.replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>');
  html = html.replace(/__([^_]+)__/g, '<b>$1</b>');
  
  // Retour à la ligne (si le formulaire utilise \n)
  html = html.replace(/\n/g, '<br>');
  
  return html;
  }
  
  // --- BLOC GESTION DES ACTUALITÉS DYNAMIQUES ---
async function chargerActualites() {
  try {
    const sourceActualites = DATA.sheets?.actualites || "";
    if (!sourceActualites.trim()) return;

    const matchId = sourceActualites.match(/\/d\/([a-zA-Z0-9-_]+)/);
    const spreadsheetId = matchId ? matchId[1] : sourceActualites;

    // Utiliser l'onglet défini dans data.js, sinon fallback
    const onglet = DATA.sheets?.actualites_onglet || "Réponses au formulaire 1";
    const urlActualites = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(onglet)}`;

    const reponse = await fetch(urlActualites);
    const donneesCsv = await reponse.text();
    
    const lignes = determinerLignesCsv(donneesCsv);
    const conteneur = document.getElementById("actualites-container");
    if (!conteneur) return;
    
    conteneur.innerHTML = ""; 

    if (lignes.length <= 1) {
      conteneur.innerHTML = `<div style="text-align:center;color:#7f8c8d;padding:20px;">Aucune actualité pour le moment.</div>`;
      return;
    }

    // Indices des colonnes (0=Date, 1=Titre, 2=Description, 3=Image1, 4=Image2, 5=Image3, 6=Image4)
    // Utiliser DATA.sheets.actualites_colonnes si défini, sinon ces valeurs par défaut
    const cols = DATA.sheets?.actualites_colonnes || { DATE:0, TITRE:1, DESCRIPTION:2, IMAGE1:3, IMAGE2:4, IMAGE3:5, IMAGE4:6 };

    for (let i = 1; i < lignes.length; i++) {
      const colonnes = lignes[i];
      if (colonnes.length < 3) continue; 

      const dateActu = colonnes[cols.DATE] || '';
      const titreActu = colonnes[cols.TITRE] || '';
      const descBrut = colonnes[cols.DESCRIPTION] || '';
      const descActu = convertirMarkdown(descBrut);
      // Récupérer toutes les images (colonnes 3 à 6)
      const images = [
        colonnes[cols.IMAGE1],
        colonnes[cols.IMAGE2],
        colonnes[cols.IMAGE3],
        colonnes[cols.IMAGE4]
      ]
      .filter(url => url && url.trim() !== '')
      .map(url => driveToDirectImg(url.trim())); // ← Conversion Drive → direct

      // Si aucune image, utiliser une image par défaut
      if (images.length === 0) {
        images.push('images/default-placeholder.jpg');
      }

      // Construction du carousel (si plusieurs images) ou affichage unique
      let carouselHtml = '';
      if (images.length === 1) {
        carouselHtml = `<div class="actualite-img-wrapper">
          <img src="${images[0]}" alt="${titreActu}" class="actualite-img" onerror="this.src='images/default-placeholder.jpg'">
        </div>`;
      } else {
        // Carousel avec plusieurs images
        carouselHtml = `
          <div class="actualite-carousel" data-index="0">
            <div class="carousel-slides">
              ${images.map((img, idx) => `
                <div class="carousel-slide ${idx === 0 ? 'active' : ''}">
                  <img src="${img}" alt="${titreActu} - ${idx+1}" class="actualite-img" onerror="this.src='images/default-placeholder.jpg'">
                </div>
              `).join('')}
            </div>
            ${images.length > 1 ? `
              <button class="carousel-btn prev" onclick="carouselSlide(this, -1)">‹</button>
              <button class="carousel-btn next" onclick="carouselSlide(this, 1)">›</button>
              <div class="carousel-dots">
                ${images.map((_, idx) => `<span class="dot ${idx === 0 ? 'active' : ''}" onclick="goToSlide(this)"></span>`).join('')}
              </div>
            ` : ''}
          </div>
        `;
      }

      const carteHtml = `
        <div class="actualite-card">
          <div class="actualite-header">
            <span class="actualite-date">📅 Publié le ${dateActu}</span>
            <h3>${titreActu}</h3>
          </div>
          ${carouselHtml}
          <div class="actualite-content">
            <p>${descActu}</p>
          </div>
        </div>
      `;
      conteneur.innerHTML += carteHtml;
    }
  } catch (erreur) {
    console.error("Erreur lors du chargement des actualités :", erreur);
    const conteneur = document.getElementById("actualites-container");
    if (conteneur) {
      conteneur.innerHTML = `<div style="text-align:center;color:#e74c3c;padding:20px;">Impossible de charger les actualités.</div>`;
    }
  }
}

  function carouselSlide(btn, direction) {
  const carousel = btn.closest('.actualite-carousel');
  if (!carousel) return;
  const slides = carousel.querySelectorAll('.carousel-slide');
  let current = parseInt(carousel.dataset.index) || 0;
  const total = slides.length;
  current = (current + direction + total) % total;
  carousel.dataset.index = current;
  slides.forEach((s, i) => s.classList.toggle('active', i === current));
  const dots = carousel.querySelectorAll('.dot');
  dots.forEach((d, i) => d.classList.toggle('active', i === current));
}

function goToSlide(dot) {
  const carousel = dot.closest('.actualite-carousel');
  if (!carousel) return;
  const slides = carousel.querySelectorAll('.carousel-slide');
  const dots = carousel.querySelectorAll('.dot');
  const idx = Array.from(dots).indexOf(dot);
  if (idx < 0 || idx >= slides.length) return;
  carousel.dataset.index = idx;
  slides.forEach((s, i) => s.classList.toggle('active', i === idx));
  dots.forEach((d, i) => d.classList.toggle('active', i === idx));
}

function determinerLignesCsv(texteCsv) {
  const lignesBrutes = texteCsv.split(/\r?\n/);
  return lignesBrutes.map(ligne => {
    const correspondance = ligne.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || [];
    return correspondance.map(valeur => valeur.replace(/^"|"$/g, "").trim());
  }).filter(l => l.length > 0);
}

function preparerTexteAnnonce(texteBrut) {
  const limiteCaracteres = 110; 
  if (texteBrut.length > limiteCaracteres) {
    let texteTronque = texteBrut.substring(0, limiteCaracteres) + "...";
    return `${texteTronque} <a href="#" class="lire-plus-annonce" onclick="ouvrirModalAnnonce('${texteBrut.replace(/'/g, "\\'")}')">Lire plus...</a>`;
  }
  return texteBrut;
}

function ouvrirModalAnnonce(texteComplet) {
  event.preventDefault();
  alert(texteComplet); // Modifiable par une jolie fenêtre Modal CSS/JS plus tard
}
  
// ══ PAGE INFO ═════════════════════════════════════════════
// ══ INFO — Chargement depuis Google Sheets ════════════════
function loadInfoFromSheet() {
  const sheetId = (DATA.sheets?.info || '').trim();
  if (!sheetId) return; // pas configuré → on garde data.js

  const onglet = DATA.sheets?.info_onglet || 'Info';
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&headers=1&sheet=${encodeURIComponent(onglet)}`;

  const btn = document.getElementById('btn-actualiser-info');
  if (btn) { btn.textContent = '⏳'; btn.disabled = true; }

  fetch(url)
    .then(r => r.text())
    .then(raw => {
      const json = JSON.parse(raw.replace(/^[\s\S]*?setResponse\(/, '').replace(/\);\s*$/, ''));
      const rows = json.table?.rows || [];
      console.log(`📊 Info — ${rows.length} annonce(s)`);

      function cv(row, idx) {
        const c = row.c?.[idx];
        if (!c) return '';
        if (c.f !== null && c.f !== undefined) return String(c.f).trim();
        return (c.v !== null && c.v !== undefined) ? String(c.v).trim() : '';
      }

      // CODE MODIFIÉ POUR TRAITER LES IMAGES GOOGLE FORMS :
     const annonces = rows
        .map(row => {
          const urlBruteImage = cv(row, 6); // Colonne G
          let urlConvertie = urlBruteImage;

          // Si le lien vient de Google Drive / Google Forms, on l'adapte pour le web
          if (urlBruteImage && (urlBruteImage.includes('drive.google.com') || urlBruteImage.includes('docs.google.com'))) {
            const match = urlBruteImage.match(/\/d\/([^/]+)/) || urlBruteImage.match(/id=([^&]+)/);
            if (match && match[1]) {
              urlConvertie = `https://lh3.googleusercontent.com/d/${match[1]}`;
            }
          }

          return {
            titre:   cv(row, 0), // A
            texte:   cv(row, 1), // B
            date:    cv(row, 2), // C
            type:    cv(row, 3) || 'info', // D
            emoji:   cv(row, 4) || '📢',  // E
            couleur: cv(row, 5) || 'blue', // F
            image:   urlConvertie,        // G (Sera le lien direct exploitable par le carrousel)
          };
        })
        .filter(a => a.titre); // ignorer lignes vides

      if (!annonces.length) { if(btn){btn.textContent='🔄';btn.disabled=false;} return; }

      // Injecter dans DATA et rafraîchir le carousel
      if (!DATA.info) DATA.info = {};
      DATA.info.annonces = annonces;
      renderInfo();

      console.log(`✅ ${annonces.length} annonce(s) chargée(s)`);
      if (btn) { btn.textContent = '🔄'; btn.disabled = false; }
    })
    .catch(err => {
      console.error('Erreur Info Sheet:', err);
      if (btn) { btn.textContent = '❌'; btn.disabled = false; }
    });
}

function loadBandeauFromSheet() {
  const sheetId = (DATA.sheets?.bandeau || '').trim();
  const onglet = DATA.sheets?.bandeau_onglet || 'Réponses au formulaire 1';
  if (!sheetId) {
    console.warn('Bandeau: aucun ID de sheet défini');
    return;
  }

  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&headers=1&sheet=${encodeURIComponent(onglet)}`;

  fetch(url)
    .then(r => r.text())
    .then(raw => {
      try {
        const json = JSON.parse(raw.replace(/^[\s\S]*?setResponse\(/, '').replace(/\);\s*$/, ''));
        const rows = json.table?.rows || [];

        // Définition des colonnes : par défaut, Titre en B (index 1), Message en C (index 2)
        const cols = DATA.sheets?.bandeau_colonnes || { TITRE: 1, MESSAGE: 2 };

        function cv(row, idx) {
          const c = row.c?.[idx];
          if (!c) return '';
          if (c.f !== null && c.f !== undefined) return String(c.f).trim();
          return (c.v !== null && c.v !== undefined) ? String(c.v).trim() : '';
        }

        const messages = rows
          .map(row => ({
            titre: cv(row, cols.TITRE),
            texte: cv(row, cols.MESSAGE)
          }))
          .filter(m => m.texte || m.titre);

        // Si aucun message, ne rien faire (on garde le texte par défaut)
        if (!messages.length) {
          console.log('Bandeau: aucun message trouvé');
          return;
        }

        const topbandContent = document.getElementById('topband-text-content');
        if (!topbandContent) return;

        let indexActuel = 0;

        function faireDefilerBandeau() {
          const m = messages[indexActuel];
          // Effet de fondu
          topbandContent.style.opacity = "0";
          setTimeout(() => {
            topbandContent.innerHTML = `
              <div class="info-topband-title">${m.titre || ''}</div>
              <div class="info-topband-sub">${m.texte || ''}</div>
            `;
            topbandContent.style.opacity = "1";
          }, 250);
          // Passer au message suivant (boucle)
          indexActuel = (indexActuel + 1) % messages.length;
        }

        // Afficher le premier message immédiatement
        faireDefilerBandeau();
        // Rotation toutes les 5 secondes
        setInterval(faireDefilerBandeau, 5000);
      } catch (e) {
        console.error('Erreur parsing bandeau:', e);
      }
    })
    .catch(err => console.error('Erreur chargement bandeau:', err));
  }

  
let carouselIdx=0, carouselTimer=null;
function renderInfo() {
  const annonces = DATA.info?.annonces||[];  
  const track = document.getElementById('carousel-track');
  const dots  = document.getElementById('carousel-dots');
  const couleurs = { blue:'blue', green:'green', orange:'orange', purple:'blue' };
  track.innerHTML = annonces.map((a,i)=>{
    // Si une image est renseignée → l'afficher, sinon fond coloré + emoji
    const banner = (a.image && a.image.trim())
      ? `<img src="${a.image||''}" alt="${a.titre||''}"
           style="width:100%;height:200px;object-fit:cover;display:block;"
           onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">`
        + `<div class="carousel-banner ${couleurs[a.couleur]||'blue'}" style="display:none">${a.emoji||'📋'}</div>`
      : `<div class="carousel-banner ${couleurs[a.couleur]||'blue'}">${a.emoji||'📋'}</div>`;
    return `<div class="carousel-slide">
      ${banner}
      <div class="carousel-overlay">
        <span class="carousel-badge ${a.type==='urgent'?'urg':a.type==='resultat'?'res':'info'}">${a.type||'INFO'}</span>
        <div class="carousel-title">${a.titre}</div>
        <div class="carousel-date">${a.date||''}</div>
      </div>
    </div>`;
  }).join('');
  dots.innerHTML = annonces.map((_,i)=>`<span class="c-dot ${i===0?'active':''}" onclick="goCarousel(${i})"></span>`).join('');
  updateAnnonce(0);
  if(carouselTimer) clearInterval(carouselTimer);
  if(annonces.length>1) carouselTimer=setInterval(()=>carouselNext(),5000);
}
function updateAnnonce(i) {
  const annonces=DATA.info?.annonces||[];
  if(!annonces.length) return;
  i = (i+annonces.length)%annonces.length;
  carouselIdx=i;
  document.getElementById('carousel-track').style.transform=`translateX(-${i*100}%)`;
  document.querySelectorAll('.c-dot').forEach((d,j)=>d.classList.toggle('active',j===i));
  const a=annonces[i];
  const el=document.getElementById('annonce-texte');
  el.parentElement.classList.add('fade');
  setTimeout(() => {
    // 1. On récupère le texte brut
    let texteFormate = a.texte || '';

    // 2. On remplace les sauts de ligne du formulaire par des <br>
    texteFormate = texteFormate.replace(/\n/g, '<br>');

    // 3. LA LIGNE MAGIQUE : On transforme les *texte* en <b>texte</b>
    texteFormate = texteFormate.replace(/\*(.*?)\*/g, '<b>$1</b>');

    // 4. On injecte le tout dans la page
    el.innerHTML = texteFormate;
    
    el.parentElement.classList.remove('fade');
  }, 200);
//  document.getElementById('annonce-nav-info').textContent=annonces.length>1?`${i+1} / ${annonces.length}`:'';
}
function carouselNext(){ updateAnnonce(carouselIdx+1); }
function carouselPrev(){ updateAnnonce(carouselIdx-1); }
function goCarousel(i){ updateAnnonce(i); }

// ══ DIRECTION ═════════════════════════════════════════════
function renderDirection() {
  const dir = DATA.direction||{};
  const renderCard = (nom, titre, photo, classe) => {
    const ini = nom ? nom.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase() : 'D';
    const ph  = photo ? `<img src="${photo}" class="dir-photo" alt="">` :
                        `<div class="dir-photo-placeholder">${ini}</div>`;
    return `<div class="dir-card ${classe}">
      ${ph}
      <div class="dir-titre">${titre}</div>
      <div class="dir-nom ${nom?'':'vide'}">${nom||'(À renseigner)'}</div>
    </div>`;
  };
  const html = renderCard(dir.chef_nom, dir.chef_titre||'Directeur Régional', dir.chef_photo, '')
             + renderCard(dir.sg_nom,   dir.sg_titre||'Secrétaire Général',  dir.sg_photo,  'sg');
  setText('direction-grid', ''); document.getElementById('direction-grid').innerHTML=html;
  const ga=document.getElementById('direction-grid-admin');
  if(ga) ga.innerHTML=html;
}

// ══ SECONDAIRES ═══════════════════════════════════════════
function renderSecondaires() {
  const prives  = (DATA.secondaires_prives||[]).filter(e=>e.chef_nom&&e.chef_nom.trim()!=='');
  const publics = (DATA.secondaires_publics||[]).filter(e=>e.chef_nom&&e.chef_nom.trim()!=='');

  const renderList = (arr, isPrive, listId) => {
    const el = document.getElementById(listId);
    if(!el) return;
    if(!arr.length){ el.innerHTML=`<div style="text-align:center;padding:32px;color:var(--muted);font-size:14px;">Aucun établissement enregistré</div>`; return; }
    el.innerHTML='';
    arr.forEach((e,idx)=>{
      const {bc,label}=badgeSecondaire(e,isPrive);
      const d=document.createElement('div');
      d.className='school-card'; d.dataset.search=(e.nom+(e.code||'')).toLowerCase(); d.style.cursor='pointer';
      d.innerHTML=`<div class="school-num">${idx+1}</div>
        <div class="school-info"><div class="sname">${e.nom}</div><div class="scode">${e.code||'—'}</div></div>
        <div class="school-badge" style="display:flex;align-items:center;gap:5px;">
          <span style="font-size:10px">🟢</span>
          <span class="badge ${bc}">${label}</span>
          <span style="color:#64748B;font-size:16px;margin-left:2px;">›</span>
        </div>`;
      d.addEventListener('click',()=>openSchoolModal(e,isPrive));
      el.appendChild(d);
    });
  };
  renderList(prives, true, 'sec-prives-list');
  renderList(publics, false, 'sec-publics-list');
}

// switchSecTab supprimé — Privés et Publics sont maintenant des pages dédiées

// ══ MODAL SECONDAIRE ══════════════════════════════════════
const DISCIPLINES = [
  {id:'francais',icon:'📖',label:'Français'},
  {id:'maths',icon:'➗',label:'Maths'},
  {id:'phychim',icon:'⚗️',label:'Phys-Chim'},
  {id:'svt',icon:'🌿',label:'SVT'},
  {id:'hg',icon:'🌍',label:'H.G'},
  {id:'anglais',icon:'🇬🇧',label:'Anglais'},
  {id:'allemand',icon:'🇩🇪',label:'Allemand'},
  {id:'espagnol',icon:'🇪🇸',label:'Espagnol'},
  {id:'edhc',icon:'🕊️',label:'EDHC'},
  {id:'eps',icon:'⚽',label:'EPS'},
  {id:'artplast',icon:'🎨',label:'Art Plast.'},
  {id:'musique',icon:'🎵',label:'Musique'},
];
function openSchoolModal(school, isPrive) {
  const {bc,label}=badgeSecondaire(school,isPrive);
  const badge=document.getElementById('modal-badge');
  badge.textContent=label; badge.className='mh-badge badge '+bc;
  document.getElementById('modal-nom').textContent=school.nom||'—';
  document.getElementById('modal-code').textContent=school.code?`Code : ${school.code}`:'';
  const cn=school.chef_nom||'Non renseigné';
  document.getElementById('modal-chef-nom').textContent=cn;
  document.getElementById('modal-chef-ini').textContent=cn.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase()||'—';
  document.getElementById('modal-chef-contact').textContent=school.chef_contact||'';
  const profs=school.profs||{};
  const total=Object.values(profs).reduce((s,v)=>s+(parseInt(v)||0),0);
  document.getElementById('modal-profs').innerHTML=DISCIPLINES.map(d=>`
    <div class="disc-prof-row">
      <div class="disc-icon">${d.icon}</div>
      <div class="disc-label">${d.label}</div>
      <div class="disc-count-static">${profs[d.id]||0}</div>
    </div>`).join('');
  document.getElementById('modal-total').textContent=total;
  document.getElementById('school-modal').classList.add('show');
  document.getElementById('app').style.overflow='hidden';
}
function closeSchoolModal() {
  document.getElementById('school-modal').classList.remove('show');
  document.getElementById('app').style.overflow='';
}

// ══ IEPP ══════════════════════════════════════════════════
// ══ IEPP : hub + pages individuelles ═════════════════════
function renderIEPP() {
  const hub = document.getElementById('iepp-hub-cards');
  if(!hub) return;
  const couleurs=['#1565C0','#10B981','#F59E0B','#7C3AED','#0891B2','#B45309'];
  hub.innerHTML='';

  (DATA.iepp||[]).forEach((iepp,idx)=>{
    const bg = couleurs[idx]||'#1565C0';
    const totalPrimPub=(iepp.primaires_publics||[]).length;
    const totalPrimPri=(iepp.primaires_prives||[]).length;
    const totalPresPub=(iepp.prescolaires_publics||[]).length;
    const totalPresPri=(iepp.prescolaires_prives||[]).length;
    const total=totalPrimPub+totalPrimPri+totalPresPub+totalPresPri;

    // Carte hub
    const card=document.createElement('div');
    card.style.cssText=`background:#edfaef;border-radius:16px;border:1px solid #7fc4b8;padding:16px;margin-bottom:12px;display:flex;align-items:center;gap:14px;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,.08);`;
    card.innerHTML=`
      <div style="width:50px;height:50px;border-radius:14px;background:rgba(255,255,255,.45);display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0;">${iepp.icone||'🏫'}</div>
      <div style="flex:1;">
        <div style="font-family:'Outfit',sans-serif;font-size:15px;font-weight:700;color:#000;">${iepp.nom}</div>
        <div style="font-size:11px;color:#3a6b63;margin-top:2px;">${total} école(s) · Insp: ${iepp.inspecteur_nom||'À renseigner'}</div>
        <div style="display:flex;gap:6px;margin-top:6px;">
          <span style="background:rgba(255,255,255,.5);color:#1565C0;font-size:10px;font-weight:700;padding:2px 8px;border-radius:20px;">📖 ${totalPrimPub+totalPrimPri} primaires</span>
          <span style="background:rgba(255,255,255,.5);color:#9D174D;font-size:10px;font-weight:700;padding:2px 8px;border-radius:20px;">🌸 ${totalPresPub+totalPresPri} préscolaires</span>
        </div>
      </div>
      <div style="color:#3a6b63;font-size:20px;">›</div>`;
    card.addEventListener('click', ()=>showIEPPPage(iepp.id));
    hub.appendChild(card);

    // Construire la page individuelle
    buildIEPPPage(iepp, bg);
  });
}

function buildIEPPPage(iepp, bg) {
  const pg = document.getElementById('page-'+iepp.id);
  if(!pg) return;
  const totalPrimPub =(iepp.primaires_publics||[]).length;
  const totalPrimPri =(iepp.primaires_prives||[]).length;
  const totalPresPub =(iepp.prescolaires_publics||[]).length;
  const totalPresPri =(iepp.prescolaires_prives||[]).length;
  const totalPrim    = totalPrimPub + totalPrimPri;
  const totalPres    = totalPresPub + totalPresPri;

  pg.innerHTML=`
    <!-- En-tête -->
    <div style="margin-bottom:16px;">
      <div style="font-family:'Outfit',sans-serif;font-size:17px;font-weight:900;color:${bg};">${iepp.nom}</div>
      <div style="font-size:11px;color:var(--muted);">${totalPrimPub+totalPrimPri+totalPresPub+totalPresPri} école(s) enregistrée(s)</div>
    </div>

    <!-- Encadrement -->
    <div class="sec-hdr"><h2 style="color:${bg};">👩‍🏫 Encadrement</h2><div class="line"></div></div>
    <div class="iepp-inspecteurs">
      ${renderInspCard(iepp.inspecteur_nom,iepp.inspecteur_contact,iepp.inspecteur_photo,'Inspecteur',bg)}
      ${renderInspCard(iepp.adjoint_nom,iepp.adjoint_contact,iepp.adjoint_photo,'Adjoint',bg)}
    </div>

    <!-- KPI -->
    <div class="kpi-grid" style="margin:14px 0;">
      <div class="kpi-card"><div class="kpi-ico b">📖</div><div><div class="kpi-v">${totalPrim}</div><div class="kpi-l">Primaires</div></div></div>
      <div class="kpi-card"><div class="kpi-ico p">🌸</div><div><div class="kpi-v">${totalPres}</div><div class="kpi-l">Préscolaires</div></div></div>
      <div class="kpi-card"><div class="kpi-ico g">🏛️</div><div><div class="kpi-v">${totalPrimPub+totalPresPub}</div><div class="kpi-l">Publics</div></div></div>
      <div class="kpi-card"><div class="kpi-ico a">🏫</div><div><div class="kpi-v">${totalPrimPri+totalPresPri}</div><div class="kpi-l">Privés</div></div></div>
    </div>

    <!-- Barre de recherche globale -->
    <div class="search-wrap" style="margin-bottom:14px;">
      <span class="search-ico">🔍</span>
      <input type="text" placeholder="Rechercher une école…"
             oninput="filterCatList('${iepp.id}', this.value)">
    </div>

    <!-- Onglets Primaires / Préscolaires -->
    <div class="iepp-tabs" id="tabs-${iepp.id}">
      <div class="iepp-tab active" id="tab-${iepp.id}-primaires"
           onclick="switchIEPPTab('${iepp.id}','primaires')">📖 Primaires (${totalPrim})</div>
      <div class="iepp-tab" id="tab-${iepp.id}-prescolaires"
           onclick="switchIEPPTab('${iepp.id}','prescolaires')">🌸 Préscolaires (${totalPres})</div>
    </div>

    <!-- ═══ PANE PRIMAIRES ═══ -->
    <div class="iepp-pane active" id="pane-${iepp.id}-primaires">

      <!-- Catégorie Publics -->
      <div class="cat-card open" id="cat-prim-pub-${iepp.id}">
        <div class="cat-hdr" onclick="toggleCat('cat-prim-pub-${iepp.id}')">
          <div class="cat-hdr-ico" style="background:#D1FAE5;">🏛️</div>
          <div class="cat-hdr-txt">
            <div class="cat-hdr-nom" style="color:#065F46;">Primaires Publics</div>
            <div class="cat-hdr-sub">${totalPrimPub} école(s)</div>
          </div>
          <span class="cat-hdr-badge" style="background:#D1FAE5;color:#065F46;">${totalPrimPub}</span>
          <span class="cat-hdr-arr">▾</span>
        </div>
        <div class="cat-body">
          <div class="school-list" id="list-prim-pub-${iepp.id}">
            ${renderEcoleCards(iepp.primaires_publics||[], 'primaires_publics', iepp.id, false)}
          </div>
        </div>
      </div>

      <!-- Catégorie Privés -->
      <div class="cat-card open" id="cat-prim-pri-${iepp.id}">
        <div class="cat-hdr" onclick="toggleCat('cat-prim-pri-${iepp.id}')">
          <div class="cat-hdr-ico" style="background:#FEF3C7;">🏫</div>
          <div class="cat-hdr-txt">
            <div class="cat-hdr-nom" style="color:#92400E;">Primaires Privés</div>
            <div class="cat-hdr-sub">${totalPrimPri} école(s)</div>
          </div>
          <span class="cat-hdr-badge" style="background:#FEF3C7;color:#92400E;">${totalPrimPri}</span>
          <span class="cat-hdr-arr">▾</span>
        </div>
        <div class="cat-body">
          <div class="school-list" id="list-prim-pri-${iepp.id}">
            ${renderEcoleCards(iepp.primaires_prives||[], 'primaires_prives', iepp.id, true)}
          </div>
        </div>
      </div>
    </div>

    <!-- ═══ PANE PRÉSCOLAIRES ═══ -->
    <div class="iepp-pane" id="pane-${iepp.id}-prescolaires">

      <!-- Catégorie Publics -->
      <div class="cat-card open" id="cat-presc-pub-${iepp.id}">
        <div class="cat-hdr" onclick="toggleCat('cat-presc-pub-${iepp.id}')">
          <div class="cat-hdr-ico" style="background:#FCE7F3;">🌸</div>
          <div class="cat-hdr-txt">
            <div class="cat-hdr-nom" style="color:#9D174D;">Préscolaires Publics</div>
            <div class="cat-hdr-sub">${totalPresPub} école(s)</div>
          </div>
          <span class="cat-hdr-badge" style="background:#FCE7F3;color:#9D174D;">${totalPresPub}</span>
          <span class="cat-hdr-arr">▾</span>
        </div>
        <div class="cat-body">
          <div class="school-list" id="list-presc-pub-${iepp.id}">
            ${renderEcoleCards(iepp.prescolaires_publics||[], 'prescolaires_publics', iepp.id, false)}
          </div>
        </div>
      </div>

      <!-- Catégorie Privés -->
      <div class="cat-card open" id="cat-presc-pri-${iepp.id}">
        <div class="cat-hdr" onclick="toggleCat('cat-presc-pri-${iepp.id}')">
          <div class="cat-hdr-ico" style="background:#FDF4FF;">🌸</div>
          <div class="cat-hdr-txt">
            <div class="cat-hdr-nom" style="color:#6B21A8;">Préscolaires Privés</div>
            <div class="cat-hdr-sub">${totalPresPri} école(s)</div>
          </div>
          <span class="cat-hdr-badge" style="background:#FDF4FF;color:#6B21A8;">${totalPresPri}</span>
          <span class="cat-hdr-arr">▾</span>
        </div>
        <div class="cat-body">
          <div class="school-list" id="list-presc-pri-${iepp.id}">
            ${renderEcoleCards(iepp.prescolaires_prives||[], 'prescolaires_prives', iepp.id, true)}
          </div>
        </div>
      </div>
    </div>`;

  // Listeners sur les cartes d'école
  pg.querySelectorAll('.school-card[data-ecole]').forEach(card=>{
    card.addEventListener('click',()=>{
      const type = card.dataset.type;
      const idx2 = parseInt(card.dataset.idx);
      const ieppObj = DATA.iepp.find(i=>i.id===iepp.id);
      if(!ieppObj) return;
      const arr = ieppObj[type]||[];
      if(arr[idx2]) openPrimModal(arr[idx2],
        type.includes('prescolaire')?'prescolaire':'primaire',
        type.includes('prive'));
    });
  });
}

// Ouvre/ferme une catégorie accordion
function toggleCat(id) {
  document.getElementById(id)?.classList.toggle('open');
}

// Filtre sur toutes les listes visibles d'une inspection
function filterCatList(ieppId, q) {
  const s = q.toLowerCase();
  ['list-prim-pub-','list-prim-pri-','list-presc-pub-','list-presc-pri-'].forEach(prefix=>{
    const el = document.getElementById(prefix + ieppId);
    if(!el) return;
    el.querySelectorAll('.school-card').forEach(card=>{
      const match = !s || (card.dataset.search||'').includes(s);
      card.style.display = match ? '' : 'none';
    });
  });
}

function renderEcoleCards(arr, type, ieppId, isPrive) {
  if(!arr.length) return `<div style="text-align:center;padding:18px;color:var(--muted);font-size:12px;">Aucune école enregistrée</div>`;
  const badgeCls  = isPrive ? 'prive' : (type.includes('prescolaire') ? 'prescolaire' : 'primaire');
  const badgeTxt  = isPrive ? 'Privé' : 'Public';
  return arr.map((e,i)=>`
    <div class="school-card" style="cursor:pointer;margin-bottom:6px;"
         data-ecole="1" data-type="${type}" data-ieppid="${ieppId}" data-idx="${i}"
         data-search="${(e.nom_ecole||e.nom||'').toLowerCase()}">
      <div class="school-num">${i+1}</div>
      <div class="school-info">
        <div class="sname">${e.nom_ecole||e.nom||'—'}</div>
        <div class="scode">${e.code_ecole||e.code||'—'}</div>
      </div>
      <div class="school-badge">
        <span class="badge ${badgeCls}">${badgeTxt}</span>
        <span style="color:#64748B;font-size:16px;margin-left:4px;">›</span>
      </div>
    </div>`).join('');
}

function showIEPPPage(ieppId) {
//  PROTECTED_PAGES.push(ieppId); // hérite de la protection
  showPage(ieppId);
}

function renderInspCard(nom, contact, photo, titre, bg) {
  const ini=(nom||'I').split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();
  const ph=photo?`<img src="${photo}" class="iepp-insp-photo" alt="">`
                :`<div class="iepp-insp-placeholder" style="background:${bg};">${ini}</div>`;
  return `<div class="iepp-insp-card">
    ${ph}
    <div class="iepp-insp-titre">${titre}</div>
    <div class="iepp-insp-nom">${nom||'(À renseigner)'}</div>
    ${contact?`<div class="iepp-insp-contact">${contact}</div>`:''}
  </div>`;
}

function switchIEPPTab(ieppId, tab) {
  ['primaires','prescolaires'].forEach(t=>{
    const pane=document.getElementById(`pane-${ieppId}-${t}`);
    const tabEl=document.getElementById(`tab-${ieppId}-${t}`);
    if(pane) pane.classList.toggle('active', t===tab);
    if(tabEl) tabEl.classList.toggle('active', t===tab);
  });
}

// ══ ADMIN : accordéons par service ════════════════════════════════ //

  function renderAdmin() {
  const el = document.getElementById('admin-services');
  if (!el) return;
  const services      = DATA.personnel_admin?.services || [];
  const formCourriers = (DATA.sheets?.form_courriers || '').trim();
  const formInfo      = (DATA.sheets?.form_info      || '').trim();
  el.innerHTML = '';
  services.forEach(svc => {
    const agents = svc.agents || [];
    const div = document.createElement('div');
    div.className = 'disc-card';
    div.id = 'svc-card-' + svc.id;

    // Bouton "Enregistrer un courrier" → service Courriers & Archives
    const btnCourriers = (svc.id === 'autre' && formCourriers)
      ? `<a href="${formCourriers}" target="_blank" rel="noopener"
           style="display:flex;align-items:center;justify-content:center;gap:10px;background:linear-gradient(135deg,#78350F,#F59E0B);color:#fff;text-decoration:none;border-radius:12px;padding:12px 16px;font-size:13px;font-weight:700;box-shadow:0 4px 12px rgba(120,53,15,.3);margin:12px 14px 4px;">
           <span style="font-size:18px;">📝</span>
           <span>Enregistrer un courrier</span>
           <span style="font-size:14px;opacity:.8;">↗</span>
         </a>`
      : '';

    // Bouton "Diffuser une Info" → service Communication
    const btnInfo = (svc.id === 'communication' && formInfo)
      ? `<a href="${formInfo}" target="_blank" rel="noopener"
           style="display:flex;align-items:center;justify-content:center;gap:10px;background:linear-gradient(135deg,#1565C0,#2196F3);color:#fff;text-decoration:none;border-radius:12px;padding:12px 16px;font-size:13px;font-weight:700;box-shadow:0 4px 12px rgba(21,101,192,.3);margin:12px 14px 4px;">
           <span style="font-size:18px;">📣</span>
           <span>Diffuser une Info</span>
           <span style="font-size:14px;opacity:.8;">↗</span>
         </a>`
      : '';

    div.innerHTML = `
      <div class="disc-hdr" onclick="toggleSvc('${svc.id}')">
        <div class="d-ico">${svc.icone||'📋'}</div>
        <div class="d-name">${svc.nom}</div>
        <span style="font-size:10px;background:rgba(255,255,255,.18);color:#fff;padding:2px 10px;border-radius:20px;font-weight:700;margin-right:6px;">${agents.length}</span>
        <div class="d-arr">▾</div>
      </div>
      <div class="disc-body">
        ${btnCourriers}${btnInfo}
        ${agents.length
          ? agents.map(a => renderAgentRow(a)).join('')
          : `<div style="text-align:center;padding:20px;color:var(--muted);">
               <div style="font-size:26px;margin-bottom:6px;">${svc.icone||'📋'}</div>
               <p style="font-size:12px;">Aucun agent — cliquez <strong>Actualiser</strong></p>
             </div>`}
      </div>`;
    el.appendChild(div);
  });
}

function renderAgentRow(a) {
  const ini = (a.nom || 'A').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  let avatarHtml = '';
  if (a.photo && a.photo.trim() !== '') {
    avatarHtml = `<img src="${a.photo}" data-fallback="${a.photoFallback || ''}" alt="${a.nom}" class="agent-photo" onerror="handleAgentPhotoError(this)">`;
    avatarHtml += `<div class="avatar-fallback" style="display:none;">${ini}</div>`;
  } else {
    avatarHtml = `<div class="avatar-fallback" style="display:flex;">${ini}</div>`;
  }

  return `<div class="person-row">
    <div class="avatar other" style="position:relative;overflow:hidden;${a.photo && a.photo.trim() !== '' ? 'padding:0;' : ''}">
      ${avatarHtml}
    </div>
    <div class="p-info">
      <div class="pname" style="white-space:normal;">${a.nom || '—'}</div>
      ${a.poste ? `<div class="prole" style="color:var(--sky);font-weight:600;">${a.poste}</div>` : ''}
      ${a.matricule ? `<div class="p-matricule">Mat. ${a.matricule}</div>` : ''}
      ${a.contact ? `<div class="prole">📞 ${a.contact}</div>` : ''}
    </div>
    ${statusBadge(a.statut || 'present')}
  </div>`;
  }

function toggleSvc(id) {
  document.getElementById('svc-card-' + id)?.classList.toggle('open');
}

// ══ CHARGEMENT PERSONNEL DEPUIS GOOGLE SHEET UNIQUE ═══════════════
function loadAdminFromSheet() {
  const sheetId = (DATA.sheets?.admin || '').trim();
  if (!sheetId) {
    alert('Renseignez DATA.sheets.admin dans data.js avec l\'ID de votre Google Sheet.');
    return;
  }

  const onglet = encodeURIComponent(DATA.sheets?.admin_onglet || 'Réponses au formulaire 1');
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?sheet=${onglet}&tqx=out:json`;

  const btn = document.querySelector('[onclick="loadAdminFromSheet()"]');
  if (btn) { btn.textContent = '⏳ Chargement…'; btn.disabled = true; }

  fetch(url)
    .then(r => r.text())
    .then(text => {
      const json = JSON.parse(text.replace(/^.*?({.*})\s*\).*$/s, '$1'));
      const table = json.table;

      // 🔍 Lire les en-têtes réels pour déboguer
      const headers = (table.cols || []).map(c => c.label || '');
      console.log('📋 En-têtes du Sheet Admin :', headers);

      // Lecture par positions : 0=Horodateur, 1=Services, 2=Nom, 3=Poste, 4=Matricule, 5=Contact, 6=Photo
      const lignes = (table.rows || []).map(row => {
        const get = (idx) => valCell(row, idx);
        return {
          horodateur: get(0),
          svcRaw:     get(1),
          nomAgent:   get(2),
          poste:      get(3),
          matricule:  get(4),
          contact:    get(5),
          photo:      get(6)
        };
      });

      // Nettoyer les services
      const services = DATA.personnel_admin?.services || [];
      services.forEach(s => s.agents = []);

      // Construire une table de correspondance à partir des noms de services définis
      const serviceMap = {};
      services.forEach(s => {
        const key = norm(s.nom);
        serviceMap[key] = s.id;
        // Alias pour "Courriers & Archives"
        if (s.id === 'autre') {
          serviceMap['courriers'] = s.id;
          serviceMap['archives'] = s.id;
          serviceMap['courriers et archives'] = s.id;
        }
      });
      // Ajouter manuellement d'autres alias si besoin
      serviceMap['secretariat general'] = 'secretariat';
      serviceMap['examens'] = 'examens';
      serviceMap['examen et concours'] = 'examens';
      serviceMap['ressources'] = 'rh';
      serviceMap['informatique'] = 'informatique';
      serviceMap['communication'] = 'communication';
      serviceMap['economat'] = 'economat';

      let distribues = 0, ignores = 0;

      lignes.forEach((l, idx) => {
        if (!l.nomAgent) { ignores++; return; }
        // Ignorer la ligne d'en-tête si elle remonte
        if (l.nomAgent === "Nom_Prenoms" || l.svcRaw === "Services") {
          console.log(`ℹ️ Ligne d'en-tête ignorée (ligne ${idx+2})`);
          return;
        }

        // Normaliser le service saisi
        const svcNorm = norm(l.svcRaw);
        console.log(`🔎 Ligne ${idx+2} : Service saisi = "${l.svcRaw}" (normalisé = "${svcNorm}")`);

        let svcId = null;
        // Recherche : correspondance exacte ou partielle
        if (svcNorm) {
          for (const [key, id] of Object.entries(serviceMap)) {
            if (svcNorm.includes(key) || key.includes(svcNorm)) {
              svcId = id;
              console.log(`✅ Correspondance trouvée : "${svcNorm}" → service "${key}" (id ${id})`);
              break;
            }
          }
        }
        // Fallback : si non trouvé, on met dans 'autre'
        if (!svcId) {
          console.warn(`⚠️ Aucune correspondance pour "${l.svcRaw}" → affecté à Courriers & Archives`);
          svcId = 'autre';
        }

        const svc = services.find(s => s.id === svcId) || services.find(s => s.id === 'autre');
        if (svc) {
          const photoUrl = l.photo ? driveToDirectImg(l.photo) : '';
          const photoFallbackUrl = l.photo ? driveFallbackImg(l.photo) : '';
          if (l.photo && !photoUrl) {
            console.warn(`⚠️ Photo non convertible pour "${l.nomAgent}" — valeur brute :`, l.photo);
          } else if (l.photo) {
            console.log(`🖼️ Photo "${l.nomAgent}" →`, photoUrl, '| secours:', photoFallbackUrl);
          }
          svc.agents.push({
            nom: l.nomAgent,
            poste: l.poste,
            matricule: l.matricule,
            contact: l.contact,
            photo: photoUrl,
            photoFallback: photoFallbackUrl,
            statut: 'present',
            service: l.svcRaw
          });
          distribues++;
        } else {
          ignores++;
        }
      });

      console.log(`✅ ${distribues} agent(s) distribué(s), ${ignores} ignoré(s)`);
      renderAdmin();
      const nbTotal = services.reduce((s, sv) => s + sv.agents.length, 0);
      const el = document.getElementById('cnt-admin');
      if (el) el.textContent = nbTotal || '—';
      if (btn) { btn.textContent = `✅ ${distribues} agent(s)`; btn.disabled = false; }
    })
    .catch(err => {
      console.error('Erreur chargement personnel:', err);
      if (btn) { btn.textContent = '❌ Erreur — voir console'; btn.disabled = false; }
    });
  }
             
// Lit la valeur d'une cellule par index de colonne (0 = A, 1 = B, ...)
function valCell(row, colIndex) {
  const cell = row.c ? row.c[colIndex] : null;
  if (!cell || cell.v === null || cell.v === undefined) return '';
  return String(cell.v).trim();
}
  
// ══ CHARGEMENT ÉCOLES IEPP — SHEET UNIQUE ════════════════════════
// Fonction utilitaire : normalise une chaîne (minuscules, sans accents, sans espaces superflus)
function norm(s) {
  return (s||'').toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g,'')  // retire les accents
    .trim();
}

function loadEcolesIEPP(callback) {
  const sheetId = (DATA.sheets?.ecoles_iepp||'').trim();
  if (!sheetId) {
    console.warn('IEPP: Renseignez DATA.sheets.ecoles_iepp dans data.js');
    if (callback) callback();
    return;
  }

  const onglet = encodeURIComponent(DATA.sheets?.ecoles_iepp_onglet || 'Ecoles actives');
  const url    = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?sheet=${onglet}&tqx=out:json`;
  const COL    = DATA.sheets?.ecoles_iepp_colonnes || {};

  const btn = document.getElementById('btn-actualiser-iepp');
  if (btn) { btn.textContent = '⏳ Chargement…'; btn.disabled = true; }

  fetch(url)
    .then(r => r.text())
    .then(text => {
      const json = JSON.parse(text.replace(/^.*?({.*})\s*\).*$/s, '$1'));

      // ── Parser les en-têtes réels du Sheet pour débogage ────
      const headersReels = (json.table?.cols||[]).map(c=>(c.label||'').trim());
      console.log('📋 En-têtes détectés dans le Sheet :', headersReels);

      const rows = rowsFromTable(json.table);
      console.log(`📊 ${rows.length} ligne(s) lue(s) dans "Ecoles actives"`);

      // ── Vider les tableaux de chaque IEPP ───────────────────
      (DATA.iepp||[]).forEach(i => {
        i.primaires_publics    = [];
        i.primaires_prives     = [];
        i.prescolaires_publics = [];
        i.prescolaires_prives  = [];
      });

      let distribues = 0, ignores = 0;

      rows.forEach((row, rowIdx) => {
        // Lire avec fallback : essayer le nom exact, puis chercher par similarité
        const nomEcole  = lireCol(row, COL.NOM_ECOLE,     headersReels);
        const codeEcole = lireCol(row, COL.CODE_ECOLE,    headersReels);
        const inspRaw   = lireCol(row, COL.INSPECTION,    headersReels);
        const cycleRaw  = lireCol(row, COL.CYCLE,         headersReels);
        const typeRaw   = lireCol(row, COL.TYPE,          headersReels);
        const nomDir    = lireCol(row, COL.NOM_DIRECTEUR,   headersReels);
        const nbClasses = lireCol(row, COL.NB_CLASSES,      headersReels);
        const nbEleves  = lireCol(row, COL.NB_ELEVES,       headersReels);
        const nbEns     = lireCol(row, COL.NB_ENSEIGNANTS,  headersReels);

        if (!nomEcole) { ignores++; return; }

        console.log(`\n→ Ligne ${rowIdx+2}: "${nomEcole}" | Insp:"${inspRaw}" | Cycle:"${cycleRaw}" | Type:"${typeRaw}"`);

        // ── Détecter l'IEPP ─────────────────────────────────────
        const inspN = norm(inspRaw);
        let ieppId = null;
        if      (inspN.includes('azaguie'))                     ieppId = 'iepp4';
        else if (inspN.includes('grand') || inspN.includes('morie') || inspN.includes('morié')) ieppId = 'iepp5';
        else if (inspN.includes('rubino'))                      ieppId = 'iepp6';
        else if (inspN.includes('1'))                           ieppId = 'iepp1';
        else if (inspN.includes('2'))                           ieppId = 'iepp2';
        else if (inspN.includes('3'))                           ieppId = 'iepp3';

        if (!ieppId) {
          console.warn(`  ⚠️ IEPP non reconnu → "${inspRaw}"`);
          ignores++; return;
        }

        // ── Détecter le cycle ───────────────────────────────────
        // "Primaire", "Élémentaire" → primaire
        // "Maternelle", "Préscolaire", "Preschool" → prescolaire
        const cycleN = norm(cycleRaw);
        let cycle = null;
        if (cycleN.includes('prim') || cycleN.includes('elem')) {
          cycle = 'primaire';
        } else if (cycleN.includes('mat') || cycleN.includes('presc')) {
          cycle = 'prescolaire';
        }

        if (!cycle) {
          console.warn(`  ⚠️ Cycle non reconnu → "${cycleRaw}"`);
          ignores++; return;
        }

        // ── Détecter public / privé ─────────────────────────────
        const typeN = norm(typeRaw);
        let estPrive = null;
        if      (typeN.includes('priv')) estPrive = true;
        else if (typeN.includes('pub'))  estPrive = false;

        if (estPrive === null) {
          console.warn(`  ⚠️ Type non reconnu → "${typeRaw}"`);
          ignores++; return;
        }

        // ── Construire l'objet école ────────────────────────────
        const ecole = {
          nom_ecole:      nomEcole,
          code_ecole:     codeEcole,
          nom_directeur:  nomDir,
          nb_classes:     nbClasses,
          nb_eleves:      nbEleves,
          nb_enseignants: nbEns,
          type:           estPrive ? 'prive' : 'public',
          cycle,
          iepp:           ieppId,
        };

        // ── Distribuer ──────────────────────────────────────────
        const ieppObj = DATA.iepp.find(i => i.id === ieppId);
        if (!ieppObj) { ignores++; return; }

        const cle = `${cycle}s_${estPrive ? 'prives' : 'publics'}`;
        if (!ieppObj[cle]) ieppObj[cle] = [];
        ieppObj[cle].push(ecole);
        distribues++;
        console.log(`  ✅ → ${ieppId} / ${cle}`);
      });

      console.log(`\n🎯 Résultat: ${distribues} distribuée(s), ${ignores} ignorée(s)`);

      renderAll();
      if (btn) { btn.textContent = `✅ ${distribues} école(s)`; btn.disabled = false; }
      if (callback) callback();
    })
    .catch(err => {
      console.error('Erreur chargement écoles IEPP:', err);
      if (btn) { btn.textContent = '❌ Erreur — voir console'; btn.disabled = false; }
      if (callback) callback();
    });
}

// Cherche une valeur dans la ligne par nom de colonne exact,
// puis par similarité normalisée si introuvable
function lireCol(row, nomCol, headersReels) {
  if (!nomCol) return '';
  // 1. Correspondance exacte
  if (row[nomCol] !== undefined) return (row[nomCol]||'').trim();
  // 2. Correspondance normalisée (ignore accents, casse, espaces)
  const cible = norm(nomCol);
  for (const h of headersReels) {
    if (norm(h) === cible) {
      return (row[h]||'').trim();
    }
  }
  // 3. Correspondance partielle (début du nom)
  for (const h of headersReels) {
    if (norm(h).startsWith(cible.slice(0,6)) || cible.startsWith(norm(h).slice(0,6))) {
      return (row[h]||'').trim();
    }
  }
  return '';
}

function rowsFromTable(table) {
  const headers=table.cols.map(c=>(c.label||'').trim());
  return (table.rows||[]).map(row=>{
    const obj={};
    headers.forEach((h,i)=>{
      const cell=row.c[i];
      obj[h]=cell&&cell.v!==null&&cell.v!==undefined?String(cell.v).trim():'';
    });
    return obj;
  });
}

function openPrimModal(ecole, type, isPrive) {
  const badge=document.getElementById('prim-modal-badge');
  badge.textContent=type==='prescolaire'?'Préscolaire':'Primaire';
  badge.className='mh-badge badge '+(type==='prescolaire'?'prescolaire':'primaire');
  document.getElementById('prim-modal-nom').textContent=ecole.nom_ecole||ecole.nom||'—';
  document.getElementById('prim-modal-code').textContent=ecole.code_ecole?`Code : ${ecole.code_ecole}`:(ecole.code?`Code : ${ecole.code}`:'');
  const dir=ecole.nom_directeur||ecole.nom_directrice||'Non renseigné';
  document.getElementById('prim-modal-dir-nom').textContent=dir;
  document.getElementById('prim-modal-dir-ini').textContent=dir.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase()||'D';
  document.getElementById('prim-modal-dir-contact').textContent=ecole.contact_directeur||'';
  document.getElementById('prim-modal-classes').textContent     = ecole.nb_classes     || ecole.nombre_classes  || '—';
  document.getElementById('prim-modal-eleves').textContent      = ecole.nb_eleves      || ecole.nombre_eleves   || '—';
  document.getElementById('prim-modal-enseignants').textContent = ecole.nb_enseignants || '—';
  document.getElementById('prim-modal').classList.add('show');
  document.getElementById('app').style.overflow='hidden';
}
function closePrimModal() {
  document.getElementById('prim-modal').classList.remove('show');
  document.getElementById('app').style.overflow='';
}

function statusBadge(statut) {
  const map={present:'obs-s',malade:'obs-m',retraite:'obs-r',absent:'obs-absent',formation:'obs-formation'};
  const labels={present:'Présent',malade:'Malade',retraite:'Retraité',absent:'Absent',formation:'En formation'};
  if(!statut||statut==='present') return `<span class="p-obs obs-s">Présent</span>`;
  return `<span class="p-obs ${map[statut]||'obs-other'}">${labels[statut]||statut}</span>`;
}

// ══ COURRIERS ═════════════════════════════════════════════

// Convertit une chaîne en identifiant simple utilisable dans un id HTML
function slugify(s) {
  return (s || '').toString().toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'mois';
}

// Parse une date au format dd/mm/yyyy en objet Date (pour le tri des mois)
function parseDMY(str) {
  if (!str) return null;
  const m = String(str).match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (!m) return null;
  return new Date(parseInt(m[3]), parseInt(m[2]) - 1, parseInt(m[1]));
}

// Noms des mois en français (pour déduire "Juin 2026" à partir de l'horodateur)
const MOIS_FR = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];

// Lit la colonne Horodateur (col A) d'une réponse de formulaire Google et la
// convertit en objet Date JS. Le gviz renvoie généralement "Date(y,m,d,h,mi,s)".
function parseHorodateurCell(row, colIndex) {
  const cell = row.c ? row.c[colIndex] : null;
  if (!cell || cell.v === null || cell.v === undefined) return null;
  const raw = cell.v;
  if (typeof raw === 'string' && raw.startsWith('Date(')) {
    const nums = raw.replace('Date(', '').replace(')', '').split(',').map(s => parseInt(s.trim(), 10));
    const [y, mo, d, h = 0, mi = 0, se = 0] = nums;
    return new Date(y, mo, d, h, mi, se);
  }
  if (cell.f) {
    const m = String(cell.f).match(/(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{2}))?/);
    if (m) {
      return new Date(parseInt(m[3]), parseInt(m[2]) - 1, parseInt(m[1]), parseInt(m[4] || 0), parseInt(m[5] || 0));
    }
  }
  return null;
}

// Formate un objet Date en "dd/mm/yyyy HH:MM"
function formatDateHeureFR(d) {
  if (!d) return '';
  const pad = n => String(n).padStart(2, '0');
  return `${pad(d.getDate())}/${pad(d.getMonth()+1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

// Déduit le libellé du mois ("Juin 2026") à partir d'un objet Date
function moisLabelFR(d) {
  if (!d) return '';
  return `${MOIS_FR[d.getMonth()]} ${d.getFullYear()}`;
}

function courrierRow(c, isDep) {
  const obsMap = { urgent:'urgent', traite:'traite', attente:'attente', info:'info' };
  const obsLbl = { urgent:'URGENT', traite:'TRAITÉ', attente:'EN ATTENTE', info:'INFO' };
  // Bouton télécharger PDF — uniquement pour les courriers arrivés
  const pdfBtn = (!isDep && c.pdf)
    ? `<a href="${c.pdf}" target="_blank" rel="noopener" download class="cour-pdf">
         <span>📥</span><span>Télécharger PDF</span>
       </a>`
    : '';
  const label = isDep ? 'DESTINATAIRE' : 'EXPÉDITEUR';
  return `<div class="cour-row${isDep?' dep':''}">
    <div class="cour-row-top">
      <span class="cour-num">N°${c.num||'—'}</span>
      <span class="cour-date">📅 ${c.date||''}</span>
    </div>
    <div class="cour-objet">${c.objet||'—'}</div>
    ${c.correspondant ? `<div class="cour-exp-line">
      <span class="cour-exp-lbl">${label} :</span>
      <span class="cour-exp">${c.correspondant}</span>
    </div>` : ''}
    ${c.obs?`<span class="cour-obs ${obsMap[c.obs]||'info'}">${obsLbl[c.obs]||c.obs}</span>`:''}
    ${pdfBtn}
  </div>`;
}

function renderMoisCard(mois, slug, g, openDefault) {
  const arr = g.arrives || [];
  const dep = g.departs || [];
  const arrHtml = arr.length
    ? arr.map(c => courrierRow(c, false)).join('')
    : `<div class="cour-empty"><span class="cour-empty-ico">📭</span><p>Aucun courrier arrivé</p></div>`;
  const depHtml = dep.length
    ? dep.map(c => courrierRow(c, true)).join('')
    : `<div class="cour-empty"><span class="cour-empty-ico">📭</span><p>Aucun courrier départ</p></div>`;
  return `<div class="mois-card${openDefault?' open':''}" id="mois-card-${slug}">
    <div class="mois-hdr" onclick="toggleMoisCard('${slug}')">
      <div class="mois-hdr-ico">📅</div>
      <div class="mois-hdr-nom">${mois}</div>
      <div class="mois-hdr-badges">
        <span class="mois-badge-arr">↓${arr.length} Arr.</span>
        <span class="mois-badge-dep">↑${dep.length} Dép.</span>
      </div>
      <span class="mois-arr-ico">▼</span>
    </div>
    <div class="mois-body">
      <div class="mois-tabs">
        <div class="mois-tab arr active" onclick="switchMoisTab(this,'${slug}','arr')">📥 Arrivés (${arr.length})</div>
        <div class="mois-tab dep" onclick="switchMoisTab(this,'${slug}','dep')">📤 Départs (${dep.length})</div>
      </div>
      <div class="mois-pane active" data-type="arr">${arrHtml}</div>
      <div class="mois-pane" data-type="dep">${depHtml}</div>
    </div>
  </div>`;
}

function toggleMoisCard(slug) {
  document.getElementById('mois-card-' + slug)?.classList.toggle('open');
}

function switchMoisTab(el, slug, type) {
  const card = document.getElementById('mois-card-' + slug);
  if (!card) return;
  card.querySelectorAll('.mois-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  card.querySelectorAll('.mois-pane').forEach(p => p.classList.toggle('active', p.getAttribute('data-type') === type));
}

function loadCourriers() {
  const sheetId = (DATA.sheets?.courriers || '').trim();
  if (!sheetId) {
    alert('Renseignez DATA.sheets.courriers dans data.js avec l\'ID de votre Google Sheet Courriers.');
    return;
  }

  const onglet = encodeURIComponent(DATA.sheets?.courriers_onglet || 'Réponses au formulaire 1');
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?sheet=${onglet}&tqx=out:json`;

  const btn = document.getElementById('btn-actualiser-courriers');
  if (btn) { btn.textContent = '⏳ Chargement…'; btn.disabled = true; }

  fetch(url)
    .then(r => r.text())
    .then(text => {
      const json = JSON.parse(text.replace(/^.*?({.*})\s*\).*$/s, '$1'));
      const rows = json.table?.rows || [];

      console.log(`📊 ${rows.length} ligne(s) lue(s) dans "Réponses au formulaire 1"`);

      // groupes par mois : { "Juin 2026": { arrives:[], departs:[], maxDate:Date|null } }
      const groups = {};

      rows.forEach((row, i) => {
        // A=Horodateur B=Type C=Numero D=Objet E=Expéditeur F=Observation G=Lien PDF
        const horodateur     = parseHorodateurCell(row, 0);
        const type           = valCell(row, 1);
        const num            = valCell(row, 2);
        const objet          = valCell(row, 3);
        const correspondant  = valCell(row, 4);
        const obs            = valCell(row, 5);
        const pdf            = valCell(row, 6);

        if (!objet && !num) return; // ligne vide
        // Ignorer une éventuelle ligne d'en-tête qui remonterait
        if (type === 'Type' || objet === 'Objet') return;

        const moisKey = moisLabelFR(horodateur);
        const g = groups[moisKey] || (groups[moisKey] = { arrives: [], departs: [], maxDate: null });

        if (horodateur && (!g.maxDate || horodateur > g.maxDate)) g.maxDate = horodateur;

        const typeN = norm(type);
        const entry = {
          mois: moisKey,
          num,
          date: formatDateHeureFR(horodateur),
          objet,
          correspondant,
          obs: norm(obs)
        };

        if (typeN.includes('arriv') || typeN === 'a') {
          entry.pdf = pdf; // PDF uniquement pour les arrivés
          g.arrives.push(entry);
        } else if (typeN.includes('dep') || typeN === 'd') {
          g.departs.push(entry);
        } else {
          console.warn(`⚠️ Type non reconnu ligne ${i+2} : "${type}"`);
        }
      });

      // Tri des mois du plus récent au plus ancien
      const moisList = Object.keys(groups)
        .map(m => ({ mois: m, ...groups[m] }))
        .sort((a, b) => (b.maxDate ? b.maxDate.getTime() : 0) - (a.maxDate ? a.maxDate.getTime() : 0));

      const totalArr = moisList.reduce((s, g) => s + g.arrives.length, 0);
      const totalDep = moisList.reduce((s, g) => s + g.departs.length, 0);

      console.log(`✅ Arrivés: ${totalArr} | Départs: ${totalDep} | Mois: ${moisList.length}`);

      // Rendu des cartes mois
      const container = document.getElementById('mois-cards-container');
      if (container) {
        container.innerHTML = moisList.length
          ? moisList.map((g, idx) => renderMoisCard(g.mois, slugify(g.mois) + '-' + idx, g, idx === 0)).join('')
          : `<div class="cour-empty"><span class="cour-empty-ico">📭</span><p>Aucun courrier enregistré</p></div>`;
      }

      // Mise à jour des compteurs KPI
      setText('cour-cnt-arrives', totalArr || '0');
      setText('cour-cnt-departs', totalDep || '0');
      setText('cour-cnt-total', (totalArr + totalDep) || '0');
      setText('kpi2-courriers', (totalArr + totalDep) || '—');
      setText('cnt-courriers-sidebar', (totalArr + totalDep) || '—');
      setText('cour-mois-count', `${moisList.length} mois`);

      if (btn) { btn.textContent = `✅ ${totalArr+totalDep} courrier(s)`; btn.disabled = false; }
    })
    .catch(err => {
      console.error('Erreur courriers:', err);
      if (btn) { btn.textContent = '❌ Erreur — voir console'; btn.disabled = false; }
    });
}




// ══ LIENS UTILES — accordéon footer ══════════════════════
function toggleLiensUtiles() {
  const body  = document.getElementById('liens-utiles-body');
  const arrow = document.getElementById('liens-utiles-arrow');
  if (!body) return;
  const open = body.style.display === 'flex';
  if (open) {
    body.style.display = 'none';
    arrow.textContent  = '+';
    arrow.style.transform = 'rotate(0deg)';
  } else {
    body.style.display = 'flex';
    arrow.textContent  = '−';
    arrow.style.transform = 'rotate(180deg)';
  }
}

// ══ CHARTS ════════════════════════════════════════════════
function renderCharts() {
  const secPrives  =(DATA.secondaires_prives||[]).filter(e=>e.chef_nom&&e.chef_nom.trim()!=='').length;
  const secPublics =(DATA.secondaires_publics||[]).filter(e=>e.chef_nom&&e.chef_nom.trim()!=='').length;
  const lycees  =(DATA.secondaires_publics||[]).filter(e=>badgeSecondaire(e,false).bc==='lycee').length;
  const colleges=(DATA.secondaires_publics||[]).filter(e=>badgeSecondaire(e,false).bc==='public').length;
  const cetf    =(DATA.secondaires_publics||[]).filter(e=>badgeSecondaire(e,false).bc==='cetf').length;

  // Primaires & Préscolaires depuis IEPP
  let primPub=0, primPri=0, presPub=0, presPri=0;
  (DATA.iepp||[]).forEach(i=>{
    primPub+=(i.primaires_publics||[]).length;
    primPri+=(i.primaires_prives||[]).length;
    presPub+=(i.prescolaires_publics||[]).length;
    presPri+=(i.prescolaires_prives||[]).length;
  });

  const total = secPrives+secPublics+primPub+primPri+presPub+presPri || 1;
  const bars=[
    {lbl:'Sec. Privés',      cnt:secPrives,  color:'linear-gradient(90deg,#F59E0B,#FBBF24)'},
    {lbl:'Sec. Publics',     cnt:secPublics, color:'linear-gradient(90deg,#10B981,#34D399)'},
    {lbl:'Lycées',           cnt:lycees,     color:'linear-gradient(90deg,#2196F3,#64B5F6)'},
    {lbl:'Collèges',         cnt:colleges,   color:'linear-gradient(90deg,#7C3AED,#A78BFA)'},
    {lbl:'CETF/CEG',         cnt:cetf,       color:'linear-gradient(90deg,#0D9488,#5EEAD4)'},
    {lbl:'Prim. Publics',    cnt:primPub,    color:'linear-gradient(90deg,#1565C0,#42A5F5)'},
    {lbl:'Prim. Privés',     cnt:primPri,    color:'linear-gradient(90deg,#9333EA,#C084FC)'},
    {lbl:'Présc. Publics',   cnt:presPub,    color:'linear-gradient(90deg,#059669,#6EE7B7)'},
    {lbl:'Présc. Privés',    cnt:presPri,    color:'linear-gradient(90deg,#DB2777,#F9A8D4)'},
  ];
  const el=document.getElementById('bar-list');
  if(!el) return;
  el.innerHTML=bars.map(b=>`
    <div class="bar-item">
      <div class="bar-lbl">${b.lbl}</div>
      <div class="bar-track"><div class="bar-fill" style="width:${Math.round(b.cnt/total*100)}%;background:${b.color};"></div></div>
      <div class="bar-cnt">${b.cnt}</div>
    </div>`).join('');
}

// ══ FOOTER ════════════════════════════════════════════════
function renderFooter() {
  const fb=document.getElementById('footer-fb-link');
  if(fb&&DATA.facebook) fb.href=DATA.facebook;
  const tg=document.getElementById('footer-tg-btn');
  if(tg){ tg.style.display=DATA.telegram?'flex':'none'; }
}

// ══ GALERIE ════════════════════════════════════════════════
function renderGalerie() {
  const el=document.getElementById('gallery-grid');
  if(!el) return;
  const g=DATA.galerie||[];
  el.innerHTML=g.length?g.map((p,i)=>`
    <div class="gallery-item" onclick="openGallery('${p.url}','${p.legende||''}')">
      <img src="${p.url}" alt="${p.legende||''}" loading="lazy">
    </div>`).join(''):`<div style="grid-column:1/-1;text-align:center;padding:20px;color:var(--muted);font-size:12px;">Aucune photo enregistrée</div>`;
}
function openGallery(url,leg){
  document.getElementById('gallery-fs-img').src=url;
  document.getElementById('gallery-fs-leg').textContent=leg;
  document.getElementById('gallery-fullscreen').classList.add('show');
}
function closeGallery(){ document.getElementById('gallery-fullscreen').classList.remove('show'); }

// ══ RECHERCHE ═════════════════════════════════════════════
function filterList(listId, q) {
  const cards=document.getElementById(listId)?.querySelectorAll('.school-card');
  if(!cards) return;
  const s=q.toLowerCase();
  cards.forEach(c=>c.style.display=(!s||c.dataset.search?.includes(s))?'':'none');
}

// ══ TELEGRAM ══════════════════════════════════════════════
function openTgPwd(){
  document.getElementById('tg-pwd-input').value='';
  document.getElementById('tg-pwd-error').classList.remove('show');
  document.getElementById('tg-pwd-overlay').classList.add('show');
  setTimeout(()=>document.getElementById('tg-pwd-input').focus(),300);
}
function closeTgPwd(){ document.getElementById('tg-pwd-overlay').classList.remove('show'); }
function checkTgPwd(){
  const val=document.getElementById('tg-pwd-input').value;
  const mdp=DATA.mot_de_passe_telegram||'';
  if(!mdp||val===mdp){
    closeTgPwd();
    window.open(DATA.telegram,'_blank','noopener');
  } else {
    document.getElementById('tg-pwd-error').classList.add('show');
    const box=document.getElementById('tg-pwd-box');
    box.style.animation='none';box.offsetHeight;box.style.animation='shake .4s ease';
    document.getElementById('tg-pwd-input').value='';
    document.getElementById('tg-pwd-input').focus();
  }
}
function toggleTgPwdEye(){
  const inp=document.getElementById('tg-pwd-input');
  const eye=document.getElementById('tg-pwd-eye');
  if(inp.type==='password'){inp.type='text';eye.textContent='🙈';}
  else{inp.type='password';eye.textContent='👁️';}
}


// ══ GOOGLE SHEETS — Chargement automatique ═══════════
const COL_SEC = {
  code:         "Code de l'établissement",
  nom:          "Nom de l'établissement",
  chef_nom:     "Nom du Chef d'établissement",
  chef_contact: "Contact du Chef d'établissement",
  francais:     "Nombre de professeurs de Français",
  maths:        "Nombre de professeurs de Mathématiques",
  phychim:      "Nombre de professeurs de Physique-Chimie ",
  svt:          "Nombre de professeurs de SVT",
  hg:           "Nombre de professeurs d'HG",
  anglais:      "Nombre de professeurs d'Anglais",
  allemand:     "Nombre de professeurs d'Allemand",
  espagnol:     "Nombre de professeurs d'Espagnol",
  edhc:         "Nombre de professeurs d'EDHC",
  eps:          "Nombre de professeurs d'EPS",
  artplast:     "Nombre de professeurs Art Plastique",
  musique:      "Nombre de professeurs de Musique",
};

function _sheetUrl(id, sheetName) {
  return `https://docs.google.com/spreadsheets/d/${id}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(sheetName)}`;
}
function _parseSheet(raw) {
  const json = raw.replace(/^[\s\S]*?setResponse\(/, '').replace(/\);?\s*$/, '');
  return JSON.parse(json);
}
function _rowsFromTable(table) {
  const headers = table.cols.map(c => c.label.trim());
  return table.rows.map(row => {
    const obj = {};
    headers.forEach((h, i) => {
      const cell = row.c[i];
      obj[h] = cell && cell.v !== null && cell.v !== undefined ? String(cell.v).trim() : '';
    });
    return obj;
  });
}
function _buildSecEntry(row, id, numero, extra) {
  const profs = {};
  ['francais','maths','phychim','svt','hg','anglais','allemand','espagnol','edhc','eps','artplast','musique'].forEach(k => {
    profs[k] = parseInt(row[COL_SEC[k]]) || 0;
  });
  return Object.assign({
    id, numero,
    code:         row[COL_SEC.code]         || '',
    nom:          row[COL_SEC.nom]          || '',
    chef_nom:     row[COL_SEC.chef_nom]     || '',
    chef_contact: row[COL_SEC.chef_contact] || '',
    profs,
  }, extra || {});
}

async function loadFromSheets() {
  const sheets = DATA.sheets || {};
  if(!sheets.secondaires_prives && !sheets.secondaires_publics) return;

  const promises = [];
  if(sheets.secondaires_prives) {
    promises.push(
      fetch(_sheetUrl(sheets.secondaires_prives, 'Réponses au formulaire 1'))
        .then(r => r.text())
        .then(raw => ({ type:'prives', raw }))
        .catch(() => null)
    );
  }
  if(sheets.secondaires_publics) {
    promises.push(
      fetch(_sheetUrl(sheets.secondaires_publics, 'Réponses au formulaire 1'))
        .then(r => r.text())
        .then(raw => ({ type:'publics', raw }))
        .catch(() => null)
    );
  }

  const results = await Promise.all(promises);
  let updated = false;

  results.forEach(res => {
    if(!res || !res.raw) return;
    try {
      const table = _parseSheet(res.raw).table;
      const rows  = _rowsFromTable(table).filter(r => r[COL_SEC.nom]);
      if(res.type === 'prives') {
        DATA.secondaires_prives = rows.map((r, i) => _buildSecEntry(r, i+1, i+1, {}));
        console.log('✅ Privés chargés:', DATA.secondaires_prives.length);
      } else {
        DATA.secondaires_publics = rows.map((r, i) => _buildSecEntry(r, 50+i, i+1, {
          sous_type: 'Collège Moderne', badge_class: 'public'
        }));
        console.log('✅ Publics chargés:', DATA.secondaires_publics.length);
      }
      updated = true;
    } catch(e) {
      console.error('Sheets parse error:', e);
    }
  });

  if(updated) {
    // Re-render uniquement les sections concernées
    if(typeof renderSecondaires === 'function') renderSecondaires();
    if(typeof renderAll === 'function') renderAll();
  }
}

// ══ INIT ══════════════════════════════════════════════════
// ══ COURRIERS DEPUIS GOOGLE SHEET (Réponses au formulaire) ═══════════
// Colonnes de l'onglet "Réponses au formulaire 1" :
// A=Horodateur (date+heure)  B=Type  C=Numéro  D=Objet  E=Expéditeur  F=Observation  G=Lien PDF
// Lecture par position — indépendante des en-têtes
// Type : "Arrivé" / "Départ" (ou variantes)
// Le mois affiché ("Juin 2026", etc.) est déduit automatiquement du mois de l'Horodateur.



// Lire une cellule par index de colonne
function valCell(row, colIndex) {
  const cell = row.c ? row.c[colIndex] : null;
  if (!cell || cell.v === null || cell.v === undefined) return '';
  return String(cell.v).trim();
}

// Lire une cellule date (gviz renvoie Date(2026,5,12) ou valeur formatée)
function cellDate(row, colIndex) {
  const cell = row.c ? row.c[colIndex] : null;
  if (!cell || cell.v === null || cell.v === undefined) return '';
  if (cell.f) return cell.f;
  if (typeof cell.v === 'string' && cell.v.startsWith('Date(')) {
    const p = cell.v.replace('Date(','').replace(')','').split(',');
    const y = p[0], m = String(parseInt(p[1])+1).padStart(2,'0'), d = String(p[2]).padStart(2,'0');
    return `${d}/${m}/${y}`;
  }
  return String(cell.v).trim();
}

document.addEventListener('DOMContentLoaded', () => {
  renderAll();
  loadFromSheets();
  if ((DATA.sheets?.ecoles_iepp || '').trim()) loadEcolesIEPP();
  if ((DATA.sheets?.admin       || '').trim()) loadAdminFromSheet();
  if ((DATA.sheets?.courriers   || '').trim()) loadCourriers();

  // Info depuis Sheet
  // 1. Chargement du Carrousel d'info (Premier Sheet)
  if ((DATA.sheets?.info || '').trim()) {
    const bandeau = document.getElementById('bandeau-info-sheet');
    if (bandeau) bandeau.style.display = 'flex';
    loadInfoFromSheet();
  }

  // 2. Chargement INDÉPENDANT du Bandeau défilant (Deuxième Sheet)
  if ((DATA.sheets?.bandeau || '').trim()) {
    loadBandeauFromSheet();
  }

  // 3. Chargement INDÉPENDANT des Actualités (Nouveau Sheet référencé dans data.js)
  if ((DATA.sheets?.actualites || '').trim()) {
    chargerActualites();
  }

  // Bouton S'enregistrer Admin
  const fa = (DATA.sheets?.form_admin || '').trim();
  if (fa) {
    const wrap = document.getElementById('btn-form-admin-wrap');
    const btn  = document.getElementById('btn-form-admin');
    if (wrap) wrap.style.display = 'block';
    if (btn)  btn.href = fa;
  }

  // Bouton Enregistrer un courrier
  const fc = (DATA.sheets?.form_courriers || '').trim();
  if (fc) {
    const wrap = document.getElementById('btn-form-courriers-wrap');
    const btn  = document.getElementById('btn-form-courriers');
    if (wrap) wrap.style.display = 'block';
    if (btn)  btn.href = fc;
  }

  const startPage = location.hash.replace('#','') || 'info';
  history.replaceState({ page: startPage }, '', '#' + startPage);
  showPage(startPage, false);
});