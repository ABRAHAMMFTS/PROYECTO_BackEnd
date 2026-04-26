// Abrir signup
document.getElementById("showformSignup").addEventListener("click", function () {
    const container = document.getElementById("signup-container");
    const form = document.getElementById("signupFormContainer");

    container.classList.add("show");
    form.style.display = "flex";
});

// Cerrar signup
document.getElementById("signupCutButton").addEventListener("click", function () {
    const container = document.getElementById("signup-container");
    const form = document.getElementById("signupFormContainer");

    container.classList.remove("show");
    form.style.display = "none";
});

//Abrir Login
document.getElementById("showformLogin").addEventListener("click", function () {
    const container = document.getElementById("login-container");
    const form = document.getElementById("loginFormContainer");

    container.classList.add("show");
    form.style.display = "flex";
});

// Cerrar login
document.getElementById("loginCutButton").addEventListener("click", function () {
    const container = document.getElementById("login-container");
    const form = document.getElementById("loginFormContainer");

    container.classList.remove("show");
    form.style.display = "none";
});

/* redireccionar */
// Desde signup → abrir login
document.getElementById("showformLoginLink").addEventListener("click", function (e) {
    e.preventDefault();
    document.getElementById("signup-container").classList.remove("show");
    document.getElementById("signupFormContainer").style.display = "none";

    document.getElementById("login-container").classList.add("show");
    document.getElementById("loginFormContainer").style.display = "flex";
});

// Desde login → abrir signup
document.getElementById("showformSignupLink").addEventListener("click", function (e) {
    e.preventDefault();
    document.getElementById("login-container").classList.remove("show");
    document.getElementById("loginFormContainer").style.display = "none";

    document.getElementById("signup-container").classList.add("show");
    document.getElementById("signupFormContainer").style.display = "flex";
});

/* Color de fuente */
document.querySelectorAll("select").forEach(function(select) {
    select.addEventListener("change", function() {
        if (this.value !== "") {
            this.classList.add("selected");
        } else {
            this.classList.remove("selected");
        }
    });
});

/* Ojito contraseña */
document.querySelectorAll(".toggle-eye").forEach(function(eye) {
    eye.addEventListener("click", function() {
        const input = document.getElementById(this.dataset.target);
        if (input.type === "password") {
            input.type = "text";
            this.style.opacity = "1";
        } else {
            input.type = "password";
            this.style.opacity = "0.5";
        }
    });
});

/* navegación entre pestañas */
document.querySelectorAll("nav a").forEach(function(link) {
    link.addEventListener("click", function(e) {
        e.preventDefault();
        const targetId = this.getAttribute("href").replace("#", "");

        document.querySelectorAll("section").forEach(s => s.classList.remove("active"));
        document.getElementById(targetId).classList.add("active");
    });
});

// Links de stats hacia secciones
document.querySelectorAll(".stat-card a").forEach(function(link) {
    link.addEventListener("click", function(e) {
        e.preventDefault();
        const targetId = this.getAttribute("href").replace("#", "");

        // cambiar sección activa
        document.querySelectorAll("section").forEach(s => s.classList.remove("active"));
        document.getElementById(targetId).classList.add("active");

        // actualizar línea activa en el nav
        navLinks.forEach(l => l.classList.remove("active"));
        const navLink = document.querySelector(`nav a[href="#${targetId}"]`);
        if (navLink) navLink.classList.add("active");
    });
});

/* hover activo linea en navegación */
const navLinks = document.querySelectorAll("nav ul li a");

navLinks.forEach(function(link) {
    link.addEventListener("click", function() {
        navLinks.forEach(l => l.classList.remove("active"));
        this.classList.add("active");
    });
});

document.querySelector("nav ul li a").classList.add("active");

/* carrusel */
const slides = document.querySelectorAll(".carousel-slide");
const dots = document.querySelectorAll(".dot");
let current = 0;

function goToSlide(index) {
    slides[current].classList.remove("active");
    dots[current].classList.remove("active");
    current = index;
    slides[current].classList.add("active");
    dots[current].classList.add("active");
}

// avance 4 segundos
setInterval(() => {
    goToSlide((current + 1) % slides.length);
}, 4000);

// click en los puntos
dots.forEach((dot, i) => {
    dot.addEventListener("click", () => goToSlide(i));
});

// Al cargar la página, activar Inicio por defecto
document.getElementById("Inicio").classList.add("active");
document.querySelector('nav a[href="#Inicio"]').classList.add("active");

// animacion numeros en inicio
const statsSection = document.querySelector(".stats");

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            document.querySelectorAll(".stat-card h2").forEach(el => {
                el.style.animationPlayState = "running";
            });
            observer.disconnect();
        }
    });
}, { threshold: 0.3 });

observer.observe(statsSection);

/* mi perfil */
document.querySelectorAll('.tab').forEach(tab => {
tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById('tab-content').textContent = `Aquí irá el contenido de ${tab.textContent}...`;
});
});

function renderPerfil(data) {
document.querySelectorAll('[data-field]').forEach(el => {
    const field = el.dataset.field;
    if (data[field] !== undefined) el.textContent = data[field];
});

if (!data.instagram_url && !data.tiktok_url) {
    document.getElementById('social-container').innerHTML = '<span class="null-badge">Sin redes sociales</span>';
} else {
    if (!data.instagram_url) document.querySelector('[data-field="instagram_url"]')?.remove();
    if (!data.tiktok_url) document.querySelector('[data-field="tiktok_url"]')?.remove();
}

if (!data.nombre_equipo) {
    document.getElementById('equipo-container').innerHTML = '<span class="null-badge">Sin equipo</span>';
    }
}

/* const eventos = [
    { emoji:"⚽", bg:"#e8f5e9", nombre:"Torneo Barrial", desc:"Liga local de fútbol en fase eliminatoria. Participan 16 equipos del municipio. El partido de hoy enfrenta a Barrio Norte vs Barrio Sur en las instalaciones del estadio municipal.", tags:["Deporte","Fútbol"], meta:["📍 Cartagena","⏰ 3:00 PM"] },
    { emoji:"🏀", bg:"#e3f2fd", nombre:"Basketball Cup", desc:"Campeonato interbarrios categoría juvenil (14-18 años). Inscripciones abiertas. Se juegan 3 partidos hoy en el polideportivo central.", tags:["Deporte","Basketball"], meta:["📍 Cartagena","⏰ 4:30 PM"] },
    { emoji:"🏊", bg:"#fce4ec", nombre:"Nado Libre", desc:"Competencia de natación en piscina olímpica. Modalidades: 50m, 100m y 200m libre. Categorías infantil, juvenil y adulto.", tags:["Acuático"], meta:["📍 Cartagena","⏰ 8:00 AM"] },
    { emoji:"🎾", bg:"#fff8e1", nombre:"Tenis Abierto", desc:"Torneo dobles mixtos nivel aficionado. Premios para los 3 primeros puestos. Requiere inscripción previa con tu equipo.", tags:["Deporte","Tenis"], meta:["📍 Cartagena","⏰ 9:00 AM"] },
    { emoji:"🏋️", bg:"#f3e5f5", nombre:"CrossFit Games", desc:"Competencia funcional abierta a todos los niveles. Rutinas de 20 minutos con jueces certificados. Inscripción individual o por equipo.", tags:["Fitness"], meta:["📅 3 mayo","📍 Cartagena"] },
    { emoji:"🚴", bg:"#e8eaf6", nombre:"Ciclovía 10K", desc:"Recorrido de 10km por las principales vías de la ciudad. Categorías infantil, recreativa y competitiva. Salida desde la Plaza Principal.", tags:["Ciclismo"], meta:["📅 5 mayo","⏰ 7:00 AM"] },
    { emoji:"🏃", bg:"#e0f2f1", nombre:"Media Maratón", desc:"21km por el malecón histórico de la ciudad. Evento avalado por Atletismo Colombia. Cupos limitados a 500 participantes.", tags:["Running"], meta:["📅 10 mayo","⏰ 6:00 AM"] },
    { emoji:"🥊", bg:"#fff3e0", nombre:"Box Amateur", desc:"Velada de boxeo en categorías peso ligero y mediano. 8 peleas programadas. Entrada gratuita para espectadores.", tags:["Combate"], meta:["📅 15 mayo","⏰ 7:00 PM"] },
    { emoji:"📰", bg:"#e8f5e9", nombre:"Liga Nacional", desc:"Resumen completo de la jornada 14 del campeonato nacional. Goles, tarjetas, estadísticas y próxima fecha.", tags:["Noticia","Fútbol"], meta:["Hace 2h"] },
    { emoji:"🏆", bg:"#e3f2fd", nombre:"Nuevo Campeón", desc:"Cartagena FC se coronó campeón del torneo regional tras vencer 2-0 en la final. El equipo logra su primer título en 10 años.", tags:["Noticia"], meta:["Hace 5h"] },
    { emoji:"🌟", bg:"#fce4ec", nombre:"Promesas 2026", desc:"Especial sobre los jóvenes deportistas colombianos que destacan este año en fútbol, atletismo y natación a nivel nacional e internacional.", tags:["Noticia"], meta:["Ayer"] },
  ]; */

function abrirModal(i) {
    const e = eventos[i];
    document.getElementById('modal-img').style.background = e.bg;
    document.getElementById('modal-img').textContent = e.emoji;
    document.getElementById('modal-titulo').textContent = e.nombre;
    document.getElementById('modal-meta').innerHTML = e.meta.map(m=>`<span>${m}</span>`).join('');
    document.getElementById('modal-desc').textContent = e.desc;
    document.getElementById('modal-tags').innerHTML = e.tags.map(t=>`<span class="tag">${t}</span>`).join('');
    document.getElementById('overlay').classList.add('open');
  }
  
  function cerrarModal(ev) {
    if(ev.target === document.getElementById('overlay')) cerrarOverlay();
  }
  
  function cerrarOverlay() {
    document.getElementById('overlay').classList.remove('open');
  }
  
  function scroll(btn, dir) {
    const wrap = btn.parentElement;
    const carrusel = wrap.querySelector('.carrusel');
    carrusel.scrollBy({ left: dir * 200, behavior: 'smooth' });
  }

  /* buscador instalaciones */

  let abierto = false;

function toggleFiltros() {
  abierto = !abierto;
  document.getElementById('filtros-panel').classList.toggle('open', abierto);
  document.getElementById('chevron').style.transform = abierto ? 'rotate(180deg)' : 'rotate(0deg)';
}

function abrirFiltros() {
  if (!abierto) toggleFiltros();
}

document.addEventListener('click', function(e) {
  const wrap = document.querySelector('.buscador-wrap');
  if (!wrap.contains(e.target)) {
    abierto = false;
    document.getElementById('filtros-panel').classList.remove('open');
    document.getElementById('chevron').style.transform = 'rotate(0deg)';
  }
});

function actualizarTags(cb) {
  const contenedor = document.getElementById('tags-activos');
  const id = 'tag-' + cb.dataset.tag;
  let tag = document.getElementById(id);
  if (cb.checked) {
    if (!tag) {
      tag = document.createElement('span');
      tag.className = 'tag-activo';
      tag.id = id;
      tag.style.display = 'inline-flex';
      tag.innerHTML = cb.dataset.tag + '<button onclick="quitarTag(\'' + cb.dataset.tag + '\')">✕</button>';
      contenedor.appendChild(tag);
    }
    tag.style.display = 'inline-flex';
  } else if (tag) {
    tag.remove();
  }
}

function quitarTag(nombre) {
  document.getElementById('tag-' + nombre)?.remove();
  document.querySelectorAll('input[data-tag="' + nombre + '"]').forEach(cb => cb.checked = false);
}

function limpiar() {
  document.querySelectorAll('.filtros-panel input[type="checkbox"]').forEach(cb => { cb.checked = false; });
  document.getElementById('tags-activos').innerHTML = '';
}

function buscar() {
  const seleccionados = [...document.querySelectorAll('.filtros-panel input:checked')].map(cb => cb.dataset.tag);
  toggleFiltros();
}

/* simulación de la api eventos - cerca */
function getEventos() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 1,
            nombre: "Torneo Barrial",
            descripcion: "Liga local de fútbol",
            deporte: "Fútbol",
            fecha: "2026-05-10",
            hora: "16:00",
            municipio: "Cartagena"
          },
          {
            id: 2,
            nombre: "Basketball Cup",
            descripcion: "Campeonato juvenil",
            deporte: "Baloncesto",
            fecha: "2026-05-12",
            hora: "18:00",
            municipio: "Cartagena"
          },
          {
            id: 3,
            nombre: "Nado Libre",
            descripcion: "Competencia en piscina",
            deporte: "Natación",
            fecha: "2026-05-15",
            hora: "10:00",
            municipio: "Cartagena"
          },
          {
            id: 4,
            nombre: "Torneo Universitario",
            descripcion: "UTB vs UDC",
            deporte: "Softbol",
            fecha: "2026-04-28",
            hora: "16:00",
            municipio: "Cartagena"
          },
          {
            id: 5,
            nombre: "Femenina Bolivarense",
            descripcion: "Selecciones Sub-20",
            deporte: "Voleibol",
            fecha: "2026-05-1",
            hora: "08:00",
            municipio: "Cartagena"
          },
          {
            id: 6,
            nombre: "Amateur Peso Pluma",
            descripcion: "Johnny Velasquéz vs Alfonso Ballesteros",
            deporte: "Boxeo",
            fecha: "2026-05-04",
            hora: "18:00",
            municipio: "Cartagena"
          },
          {
            id: 7,
            nombre: "Carrera 10K",
            descripcion: "Running urbano",
            deporte: "Running",
            fecha: "2026-05-20",
            hora: "06:00",
            municipio: "Turbaco"
          },
          {
            id: 8,
            nombre: "Copa Tenis",
            descripcion: "Torneo abierto",
            deporte: "Tenis",
            fecha: "2026-05-18",
            hora: "09:00",
            municipio: "Cartagena"
          },
          {
            id: 9,
            nombre: "Ciclismo Ruta",
            descripcion: "Competencia regional",
            deporte: "Ciclismo",
            fecha: "2026-05-25",
            hora: "07:00",
            municipio: "Turbaco"
          },
          {
            id: 10,
            nombre: "Calistenia Park",
            descripcion: "Exhibición urbana",
            deporte: "Calistenia",
            fecha: "2026-05-22",
            hora: "17:00",
            municipio: "Cartagena"
          },
          {
            id: 11,
            nombre: "Halterofilia Open",
            descripcion: "Competencia de fuerza",
            deporte: "Halterofilia",
            fecha: "2026-05-28",
            hora: "15:00",
            municipio: "Cartagena"
          },
          {
            id: 12,
            nombre: "Boxeo Amateur",
            descripcion: "Velada deportiva",
            deporte: "Boxeo",
            fecha: "2026-05-30",
            hora: "19:00",
            municipio: "Magangue"
          }
        ]);
      }, 500); // simula delay de servidor
    });
  }

  /* simulación de la api eventos - cerca */

  const imagenesDeporte = {
    Fútbol: "../assets/img/futbolevento.png",
    Baloncesto: "../assets/img/baloncestoevento.png",
    Natación: "../assets/img/natacionevento.png",
    Tenis: "../assets/img/tenisevento.png",
    Boxeo: "../assets/img/boxeoevento.png",
    Halterofilia: "../assets/img/halterofiliaevento.png",
    Running: "../assets/img/runningevento.png",
    Calistenia: "../assets/img/calisteniaevento.png",
    Ciclismo: "../assets/img/ciclismoevento.png",
    Softbol: "../assets/img/softbolevento.png",
    Voleibol: "../assets/img/voleibolevento.png",

  };

  function renderEventos(eventos, contenedorId, tipo) {
    const carrusel = document.getElementById(contenedorId);
    carrusel.innerHTML = "";
  
    eventos.forEach(ev => {
      const deporteKey = ev.deporte;
  
      const card = document.createElement("div");
      card.classList.add("evento-card", tipo);
  
      card.innerHTML = `
        <div class="card-img">
          <img src="${imagenesDeporte[deporteKey]}">
        </div>
  
        <div class="card-body">
          <div class="card-nombre">${ev.nombre}</div>
          <div class="card-desc">${ev.descripcion}</div>
  
          <div class="card-tags">
            <span class="tag">${ev.deporte}</span>
            <span class="tag">${ev.fecha}</span>
            <span class="tag">${ev.hora}</span>
          </div>
        </div>
  
        <div class="card-footer">
        <svg class="icon-location" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
        </svg>
        <span>${ev.municipio}</span>
        </div>
      `;
  
      carrusel.appendChild(card);
    });
  }

  getEventos().then(data => {

    const cercanos = data.filter(ev => ev.municipio === "Cartagena");
  
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
  
    const proximos = data
      .filter(ev => new Date(ev.fecha) >= hoy)
      .sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
  
    renderEventos(cercanos, "c1", "cerca");
    renderEventos(proximos, "c2", "proximo");
  });

