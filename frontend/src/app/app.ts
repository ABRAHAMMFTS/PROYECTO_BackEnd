import { Component, signal, OnInit, OnDestroy, inject, Inject, PLATFORM_ID, ChangeDetectorRef, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeUrlPipe } from './pipes/safe-url.pipe';

import { FormsModule } from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';
import { ApiService, Evento } from './services/api.service';

interface PerfilUsuario {
  username: string;
  edad: number;
  municipio: string;
  genero: string;
  instagram_url: string;
  tiktok_url: string;
  nombre_equipo: string;
  id_rol: number;
  id_usuario?: string;
}

@Component({

  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, SafeUrlPipe],

  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class App implements OnInit, OnDestroy {
  private apiService = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  // Estado reactivo de navegación
  activeSection = signal('Inicio');
  showLogin = signal(false);
  showSignup = signal(false);
  showModal = signal(false);
  selectedEvento = signal<Evento | null>(null);
  isAuthenticated = signal(false);
  savedEventIds = signal<string[]>([]);

  // Carrusel de imágenes hero
  slides = signal([
    'assets/photos/paralimpicos_yamil.jpg',
    'assets/photos/niños_aerobicos.jpg',
    'assets/photos/patinadores_montemaria.jpg'
  ]);
  currentSlide = signal(0);
  private carouselInterval: any;

  // Eventos e Instalaciones
  eventosCercanos = signal<Evento[]>([]);
  eventosProximos = signal<Evento[]>([]);
  instalaciones = signal<any[]>([]);

  // Buscador y filtros
  buscadorTexto = '';
  filtrosAbiertos = signal(false);
  filtrosSeleccionados = signal<string[]>([]);

  // Perfil
  activeTab = signal('Reservas');
  perfilUsuario = signal<PerfilUsuario>({
    username: 'cargando...',
    edad: 0,
    municipio: '...',
    genero: '...',
    instagram_url: '',
    tiktok_url: '',
    nombre_equipo: '',
    id_rol: 0
  });

  adminPanelUrl = 'http://localhost:5173'; // Cambiar por la URL de Vercel cuando se despliegue el panel



  // Datos de formularios
  signupData = {
    nomUsu: '',
    edad: 18,
    sexo: '',
    municipio: '',
    telefono: '',
    correo: '',
    contrasenha: ''
  };

  loginData = {
    correo: '',
    contrasenha: ''
  };


  // Estadísticas animadas
  statEventos = signal(0);
  statEspacios = signal(0);
  statMunicipios = signal(0);

  // Imágenes de deportes
  imagenesDeporte: { [key: string]: string } = {
    'Fútbol':      'assets/img/futbolevento.png',
    'Baloncesto':  'assets/img/baloncestoevento.png',
    'Natación':    'assets/img/natacionevento.png',
    'Tenis':       'assets/img/tenisevento.png',
    'Boxeo':       'assets/img/boxeoevento.png',
    'Halterofilia':'assets/img/halterofiliaevento.png',
    'Running':     'assets/img/runningevento.png',
    'Calistenia':  'assets/img/calisteniaevento.png',
    'Ciclismo':    'assets/img/ciclismoevento.png',
    'Softbol':     'assets/img/softbolevento.png',
    'Voleibol':    'assets/img/voleibolevento.png',
  };

  ngOnInit() {
    this.iniciarCarrusel();
    if (isPlatformBrowser(this.platformId)) {
      this.cargarSesionDesdeStorage();
      this.cargarTodo();
      this.animarStats();
    }
  }

  ngOnDestroy() {
    if (this.carouselInterval) clearInterval(this.carouselInterval);
  }

  // Carga global de datos
  private cargarSesionDesdeStorage() {
    const idUsuario = localStorage.getItem('id_usuario');
    const nomUsu = localStorage.getItem('nomUsu');
    const idRol = Number(localStorage.getItem('id_rol') || 0);
    this.isAuthenticated.set(Boolean(idUsuario));
    this.savedEventIds.set(JSON.parse(localStorage.getItem('eventos_guardados') || '[]'));

    if (idUsuario) {
      this.perfilUsuario.update((perfil) => ({
        ...perfil,
        username: nomUsu || perfil.username,
        id_usuario: idUsuario,
        id_rol: idRol,
      }));
    }
  }

  private cargarTodo() {
    this.cargarEventos();
    this.cargarInstalaciones();
    this.cargarPerfil();
  }

  // Navegación
  changeSection(section: string) {
    this.activeSection.set(section);
  }

  // Carrusel hero
  changeSlide(direction: number) {
    const total = this.slides().length;
    this.currentSlide.set((this.currentSlide() + direction + total) % total);
  }

  goToSlide(index: number) {
    this.currentSlide.set(index);
  }

  private iniciarCarrusel() {
    this.carouselInterval = setInterval(() => this.changeSlide(1), 4000);
  }

  // Modales
  toggleLogin() { this.showLogin.set(!this.showLogin()); if (this.showSignup()) this.showSignup.set(false); }
  toggleSignup() { this.showSignup.set(!this.showSignup()); if (this.showLogin()) this.showLogin.set(false); }
  toggleFiltros() { this.filtrosAbiertos.set(!this.filtrosAbiertos()); }
  abrirFiltros() { this.filtrosAbiertos.set(true); }
  cerrarOverlay() {
    this.showLogin.set(false);
    this.showSignup.set(false);
    this.filtrosAbiertos.set(false);
  }

  cerrarSesion() {
    localStorage.removeItem('id_usuario');
    localStorage.removeItem('id_rol');
    localStorage.removeItem('nomUsu');
    localStorage.removeItem('token');
    localStorage.removeItem('eventos_guardados');
    this.isAuthenticated.set(false);
    this.savedEventIds.set([]);
    this.perfilUsuario.set({
      username: 'Invitado',
      edad: 0,
      municipio: '...',
      genero: '...',
      instagram_url: '',
      tiktok_url: '',
      nombre_equipo: '',
      id_rol: 0
    });
    this.changeSection('Inicio');
  }
  crearCuenta(event: Event) {
    event.preventDefault();
    this.apiService.createResource('usuarios', this.signupData).subscribe({
      next: () => {
        alert('Cuenta creada exitosamente. Iniciando sesión...');
        this.showSignup.set(false);
        this.loginData = {
          correo: this.signupData.correo,
          contrasenha: this.signupData.contrasenha
        };
        this.iniciarSesionSinEvento();
      },
      error: (err) => {
        alert('Error al crear cuenta: ' + (err.error?.detail || 'Inténtalo de nuevo'));
      }
    });
  }

  iniciarSesion(event: Event) {
    event.preventDefault();
    this.iniciarSesionSinEvento();
  }

  private iniciarSesionSinEvento() {
    this.apiService.login(this.loginData).subscribe({
      next: (res) => {
        alert('Bienvenido de nuevo, ' + res.nomUsu);
        this.showLogin.set(false);
        // Guardar ID, nombre y rol en el perfil
        this.perfilUsuario.update(p => ({ 
          ...p, 
          username: res.nomUsu, 
          id_usuario: res.id_usuario,
          id_rol: res.id_rol 
        }));
        localStorage.setItem('token', res.access_token);
        localStorage.setItem('id_usuario', res.id_usuario);
        localStorage.setItem('id_rol', res.id_rol.toString());
        localStorage.setItem('nomUsu', res.nomUsu);
        this.isAuthenticated.set(true);

        this.changeSection('Perfil');
      },
      error: (err) => {
        alert('Error al iniciar sesión: ' + (err.error?.detail || 'Credenciales inválidas'));
      }
    });
  }

  reservarCupo(id_evento: string | number | null) {
    if (id_evento === null) {
      alert('No se pudo identificar el evento seleccionado');
      return;
    }

    const id_usuario = localStorage.getItem('id_usuario');
    if (!id_usuario) {
      alert('Debes iniciar sesión para reservar un cupo');
      this.showLogin.set(true);
      return;
    }

    this.apiService.inscribirEnEvento(String(id_evento), id_usuario).subscribe({
      next: () => {
        alert('¡Cupo reservado con éxito!');
        this.cerrarModal();
      },
      error: (err) => {
        alert('Error al reservar cupo: ' + (err.error?.detail || 'Inténtalo de nuevo'));
      }
    });
  }

  guardarEvento(id_evento: string | number | null) {
    if (id_evento === null) {
      alert('No se pudo identificar el evento seleccionado');
      return;
    }

    if (!this.isAuthenticated()) {
      alert('Debes iniciar sesión para guardar eventos');
      this.showLogin.set(true);
      return;
    }

    const id = String(id_evento);
    const guardados = this.savedEventIds();
    if (guardados.includes(id)) {
      alert('Este evento ya está guardado');
      return;
    }

    const nuevosGuardados = [...guardados, id];
    this.savedEventIds.set(nuevosGuardados);
    localStorage.setItem('eventos_guardados', JSON.stringify(nuevosGuardados));
    alert('Evento guardado en favoritos');
  }

  eventoGuardado(id_evento: string | number | null | undefined): boolean {
    if (id_evento === null || id_evento === undefined) return false;
    return this.savedEventIds().includes(String(id_evento));
  }

  imagenEvento(evento: Evento | null | undefined): string {
    if (!evento) return 'assets/img/logo_color.png';
    return this.imagenesDeporte[evento.deporte] || 'assets/img/logo_color.png';
  }



  // Cargar eventos
  private cargarEventos() {
    this.apiService.getEventos().subscribe({
      next: (data: Evento[]) => {
        this.eventosCercanos.set(data.filter(ev => ev.municipio === 'Cartagena'));
        const hoy = new Date(); hoy.setHours(0,0,0,0);
        this.eventosProximos.set(data.filter(ev => new Date(ev.fecha) >= hoy).sort((a,b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime()));
        this.cdr.detectChanges();
      },
      error: () => this.cargarEventosFallback()
    });
  }

  private cargarEventosFallback() {
    const fallbackData: Evento[] = [
      { id: 'E1', nombre: 'Torneo Barrial', descripcion: 'Liga local de fútbol en fase eliminatoria.', deporte: 'Fútbol', fecha: '2026-05-10', hora: '16:00', municipio: 'Cartagena' },
      { id: 'E2', nombre: 'Basketball Cup', descripcion: 'Campeonato juvenil categoría 14-18 años.', deporte: 'Baloncesto', fecha: '2026-05-12', hora: '18:00', municipio: 'Cartagena' },
      { id: 'E3', nombre: 'Nado Libre', descripcion: 'Competencia en piscina olímpica.', deporte: 'Natación', fecha: '2026-05-15', hora: '10:00', municipio: 'Cartagena' },
      { id: 'E4', nombre: 'Torneo Softbol', descripcion: 'Gran final universitaria UTB vs UDC.', deporte: 'Softbol', fecha: '2026-05-16', hora: '16:00', municipio: 'Cartagena' },
      { id: 'E5', nombre: 'Copa Voleibol', descripcion: 'Selecciones Sub-20 en competencia regional.', deporte: 'Voleibol', fecha: '2026-05-17', hora: '08:00', municipio: 'Cartagena' },
      { id: 'E6', nombre: 'Boxeo Amateur', descripcion: 'Velada deportiva de peso pluma.', deporte: 'Boxeo', fecha: '2026-05-19', hora: '18:00', municipio: 'Cartagena' },
      { id: 'E7', nombre: 'Copa Tenis', descripcion: 'Torneo abierto nivel aficionado con llaves mixtas.', deporte: 'Tenis', fecha: '2026-05-21', hora: '09:00', municipio: 'Cartagena' },
      { id: 'E8', nombre: 'Ruta Ciclismo', descripcion: 'Recorrido competitivo por la zona norte de Bolívar.', deporte: 'Ciclismo', fecha: '2026-05-24', hora: '07:00', municipio: 'Turbaco' },
      { id: 'E9', nombre: 'Reto Calistenia', descripcion: 'Competencia urbana de fuerza, resistencia y freestyle.', deporte: 'Calistenia', fecha: '2026-05-27', hora: '17:00', municipio: 'Cartagena' },
      { id: 'E10', nombre: 'Open Halterofilia', descripcion: 'Pruebas de levantamiento olímpico por categorías.', deporte: 'Halterofilia', fecha: '2026-05-30', hora: '15:00', municipio: 'Cartagena' }
    ];
    this.eventosCercanos.set(fallbackData.filter(ev => ev.municipio === 'Cartagena'));
    const hoy = new Date(); hoy.setHours(0,0,0,0);
    this.eventosProximos.set(fallbackData.filter(ev => new Date(ev.fecha) >= hoy).sort((a,b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime()));
    this.cdr.detectChanges();
  }

  // Cargar Instalaciones
  private cargarInstalaciones() {
    this.apiService.getInstalaciones().subscribe({
      next: (data) => {
        this.instalaciones.set(data);
        this.cdr.detectChanges();
      },
      error: () => {
        this.instalaciones.set([
          { id_instalacion: 'I1', nombre: 'Estadio Municipal de Cartagena', id_zona: 'ZNTE01' },
          { id_instalacion: 'I2', nombre: 'Polideportivo Central', id_zona: 'ZCTO02' },
          { id_instalacion: 'I3', nombre: 'Complejo Acuático Bolívar', id_zona: 'ZSUR01' }
        ]);
      }
    });
  }

  // Cargar Perfil
  private cargarPerfil() {
    this.apiService.getUsuarios().subscribe({
      next: (users) => {
        if (users && users.length > 0) {
          const idUsuario = localStorage.getItem('id_usuario');
          const user = (users as any[]).find((item) => item.id_usuario === idUsuario) || (!this.isAuthenticated() ? users[0] : null);
          if (!user) return;

          this.perfilUsuario.set({
            username: user.nomUsu || 'usuario',
            edad: user.edad || 0,
            municipio: user.municipio || 'Cartagena',
            genero: user.sexo === 'F' || user.sexo === 'femenino' ? '♀' : '♂',
            instagram_url: '',
            tiktok_url: '',
            nombre_equipo: '',
            id_rol: user.id_rol || 0,
            id_usuario: user.id_usuario
          });
          this.cdr.detectChanges();
        }
      },
      error: () => {
        this.perfilUsuario.set({
          username: 'usuario_demo',
          edad: 22,
          municipio: 'Cartagena',
          genero: '♂',
          instagram_url: '',
          tiktok_url: '',
          nombre_equipo: 'Equipo Bolívar',
          id_rol: 2
        });
      }
    });
  }

  // Resto de métodos (scroll, filtros, etc.)
  abrirModal(evento: Evento) { this.selectedEvento.set(evento); this.showModal.set(true); }
  cerrarModal() { this.showModal.set(false); this.selectedEvento.set(null); }
  scrollCarrusel(elementId: string, direction: number) {
    const el = document.getElementById(elementId);
    if (el) el.scrollBy({ left: direction * 200, behavior: 'smooth' });
  }

  actualizarTags(event: any) {
    const cb = event.target as HTMLInputElement;
    const tag = cb.dataset['tag'] || '';
    if (cb.checked) { if (!this.filtrosSeleccionados().includes(tag)) this.filtrosSeleccionados.set([...this.filtrosSeleccionados(), tag]); }
    else { this.filtrosSeleccionados.set(this.filtrosSeleccionados().filter(t => t !== tag)); }
  }
  quitarTag(tag: string) { this.filtrosSeleccionados.set(this.filtrosSeleccionados().filter(t => t !== tag)); }
  limpiar() { this.filtrosSeleccionados.set([]); }
  buscar() { this.filtrosAbiertos.set(false); }
  changeTab(tab: string) { this.activeTab.set(tab); }

  get eventosGuardados() {
    const ids = this.savedEventIds();
    return this.eventosProximos().concat(this.eventosCercanos()).filter((evento, index, arr) =>
      ids.includes(String(evento.id)) && arr.findIndex((item) => String(item.id) === String(evento.id)) === index
    );
  }

  private animarStats() {
    const targets = { eventos: 24, espacios: 57, municipios: 45 };
    const steps = 60; const duration = 2500; let step = 0;
    const interval = setInterval(() => {
      step++; const p = step / steps;
      this.statEventos.set(Math.round(targets.eventos * p));
      this.statEspacios.set(Math.round(targets.espacios * p));
      this.statMunicipios.set(Math.round(targets.municipios * p));
      if (step >= steps) clearInterval(interval);
    }, duration / steps);
  }

  get eventosCercanosFiltrados() {
    const eventos = this.eventosCercanos();
    const filtros = this.filtrosSeleccionados();
    if (!filtros.length) return eventos;
    return eventos.filter(ev => filtros.some(f => ev.deporte === f || ev.municipio === f));
  }

  zonas = [{ id: 1, nombre: 'Norte - Centro y Getsemaní', tag: 'ZNTE01' }, { id: 2, nombre: 'Norte - Residencial', tag: 'ZNTE02' }, { id: 3, nombre: 'Nueva Zona Norte', tag: 'ZNTE03' }, { id: 4, nombre: 'Península Turística', tag: 'ZCTO01' }, { id: 5, nombre: 'Residencial Central-Sur', tag: 'ZCTO02' }, { id: 6, nombre: 'Suroriente y Suroccidente', tag: 'ZSUR01' }, { id: 7, nombre: 'Extremo Sur (Industrial)', tag: 'ZSUR02' }];
  municipios = [{ id: 1, nombre: 'Cartagena' }, { id: 2, nombre: 'Carmen de Bolívar' }, { id: 3, nombre: 'San Juan Nepomuceno' }, { id: 4, nombre: 'Arjona' }, { id: 5, nombre: 'Turbaco' }, { id: 6, nombre: 'Mompox' }, { id: 7, nombre: 'Magangué' }];
  deportes = [{ id: 1, nombre: 'Fútbol' }, { id: 2, nombre: 'Baloncesto' }, { id: 3, nombre: 'Natación' }, { id: 4, nombre: 'Tenis' }, { id: 5, nombre: 'Boxeo' }, { id: 6, nombre: 'Halterofilia' }, { id: 7, nombre: 'Atletismo' }, { id: 8, nombre: 'Calistenia' }, { id: 9, nombre: 'Ciclismo' }, { id: 10, nombre: 'Softbol' }, { id: 11, nombre: 'Voleibol' }];
  tiposInstalacion = [{ id: 1, nombre: 'Público' }, { id: 2, nombre: 'Privado' }];
}
