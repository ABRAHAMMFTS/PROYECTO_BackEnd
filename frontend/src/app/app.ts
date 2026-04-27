import { Component, signal, OnInit, OnDestroy, inject, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';
import { ApiService, Evento } from './services/api.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App implements OnInit, OnDestroy {
  private apiService = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  // Señales para estado reactivo
  activeSection = signal('Inicio');
  showLogin = signal(false);
  showSignup = signal(false);
  showModal = signal(false);
  selectedEvento = signal<Evento | null>(null);

  // Carrusel
  slides = signal([
    'assets/photos/paralimpicos_yamil.jpg',
    'assets/photos/ninos_aerobicos.jpg',
    'assets/photos/patinadores_montemaria.jpg'
  ]);
  currentSlide = signal(0);
  private carouselInterval: any;

  // Eventos
  eventosCercanos = signal<Evento[]>([]);
  eventosProximos = signal<Evento[]>([]);

  // Buscador y filtros
  buscadorTexto = signal('');
  filtrosAbiertos = signal(false);
  filtrosSeleccionados = signal<string[]>([]);

  // Perfil
  activeTab = signal('Perfil');

  // Estadísticas
  stats = signal({ eventos: 12, espacios: 24, municipios: 8 });

  // Imágenes de deportes
  imagenesDeporte: { [key: string]: string } = {
    Fútbol: 'assets/img/futbolevento.png',
    Baloncesto: 'assets/img/baloncestoevento.png',
    Natación: 'assets/img/natacionevento.png',
    Tenis: 'assets/img/tenisevento.png',
    Boxeo: 'assets/img/boxeoevento.png',
    Halterofilia: 'assets/img/halterofiliaevento.png',
    Running: 'assets/img/runningevento.png',
    Calistenia: 'assets/img/calisteniaevento.png',
    Ciclismo: 'assets/img/ciclismoevento.png',
    Softbol: 'assets/img/softbolevento.png',
    Voleibol: 'assets/img/voleibolevento.png',
  };

  ngOnInit() {
    this.iniciarCarrusel();
    if (isPlatformBrowser(this.platformId)) {
      // Carga eventos solo en el navegador para evitar llamadas SSR durante compilación
      this.cargarEventos();
    }
    this.animarStats();
  }

  ngOnDestroy() {
    if (this.carouselInterval) {
      clearInterval(this.carouselInterval);
    }
  }

  // Navegación entre secciones
  changeSection(section: string) {
    this.activeSection.set(section);
  }

  // Carrusel
  changeSlide(direction: number) {
    const totalSlides = this.slides().length;
    const newSlide = (this.currentSlide() + direction + totalSlides) % totalSlides;
    this.currentSlide.set(newSlide);
  }

  goToSlide(index: number) {
    this.currentSlide.set(index);
  }

  private iniciarCarrusel() {
    this.carouselInterval = setInterval(() => {
      this.changeSlide(1);
    }, 4000);
  }

  // Modales
  toggleLogin() {
    this.showLogin.set(!this.showLogin());
    if (this.showSignup()) {
      this.showSignup.set(false);
    }
  }

  toggleSignup() {
    this.showSignup.set(!this.showSignup());
    if (this.showLogin()) {
      this.showLogin.set(false);
    }
  }

  // Eventos
  private cargarEventos() {
    this.apiService.getEventos().subscribe({
      next: (data: Evento[]) => {
        const cercanos = data.filter(ev => ev.municipio === 'Cartagena');
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);

        const proximos = data
          .filter(ev => new Date(ev.fecha) >= hoy)
          .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());

        // Usar setTimeout para evitar ExpressionChangedAfterItHasBeenCheckedError
        setTimeout(() => {
          this.eventosCercanos.set(cercanos);
          this.eventosProximos.set(proximos);
          this.cdr.detectChanges();
        });
      },
      error: (error) => {
        console.error('Error cargando eventos:', error);
        // Fallback con datos de ejemplo
        setTimeout(() => {
          this.eventosCercanos.set([
            {
              id: 1,
              nombre: 'Torneo Barrial',
              descripcion: 'Liga local de fútbol con partidos en el estadio municipal.',
              deporte: 'Fútbol',
              fecha: '2026-05-10',
              hora: '16:00',
              municipio: 'Cartagena'
            },
            {
              id: 2,
              nombre: 'Nado Libre',
              descripcion: 'Competencia de natación en piscina olímpica para todas las edades.',
              deporte: 'Natación',
              fecha: '2026-05-15',
              hora: '10:00',
              municipio: 'Cartagena'
            }
          ]);
          this.cdr.detectChanges();
        });
      }
    });
  }

  abrirModal(evento: Evento) {
    this.selectedEvento.set(evento);
    this.showModal.set(true);
  }

  cerrarModal() {
    this.showModal.set(false);
    this.selectedEvento.set(null);
  }

  // Buscador y filtros
  toggleFiltros() {
    this.filtrosAbiertos.set(!this.filtrosAbiertos());
  }

  actualizarFiltros(tag: string, checked: boolean) {
    const filtros = this.filtrosSeleccionados();
    if (checked) {
      if (!filtros.includes(tag)) {
        this.filtrosSeleccionados.set([...filtros, tag]);
      }
    } else {
      this.filtrosSeleccionados.set(filtros.filter(f => f !== tag));
    }
  }

  quitarFiltro(tag: string) {
    this.actualizarFiltros(tag, false);
  }

  limpiarFiltros() {
    this.filtrosSeleccionados.set([]);
  }

  buscar() {
    // Lógica de búsqueda - por ahora solo cierra los filtros
    this.filtrosAbiertos.set(false);
  }

  // Filtros avanzados
  zonas = [
    { id: 1, nombre: 'Norte - Centro y Getsemaní', tag: 'ZNTE01' },
    { id: 2, nombre: 'Norte - Residencial', tag: 'ZNTE02' },
    { id: 3, nombre: 'Nueva Zona Norte', tag: 'ZNTE03' },
    { id: 4, nombre: 'Península Turística', tag: 'ZCTO01' },
    { id: 5, nombre: 'Residencial Central-Sur', tag: 'ZCTO02' },
    { id: 6, nombre: 'Suroriente y Suroccidente', tag: 'ZSUR01' },
    { id: 7, nombre: 'Extremo Sur (Industrial)', tag: 'ZSUR02' }
  ];

  municipios = [
    { id: 1, nombre: 'Cartagena' },
    { id: 2, nombre: 'Carmen de Bolívar' },
    { id: 3, nombre: 'San Juan Nepomuceno' },
    { id: 4, nombre: 'Arjona' },
    { id: 5, nombre: 'Turbaco' },
    { id: 6, nombre: 'Mompox' },
    { id: 7, nombre: 'Magangué' }
  ];

  deportes = [
    { id: 1, nombre: 'Fútbol' },
    { id: 2, nombre: 'Baloncesto' },
    { id: 3, nombre: 'Natación' },
    { id: 4, nombre: 'Tenis' },
    { id: 5, nombre: 'Boxeo' },
    { id: 6, nombre: 'Halterofilia' },
    { id: 7, nombre: 'Atletismo' },
    { id: 8, nombre: 'Calistenia' },
    { id: 9, nombre: 'Ciclismo' },
    { id: 10, nombre: 'Softbol' },
    { id: 11, nombre: 'Voleibol' }
  ];

  tiposInstalacion = [
    { id: 1, nombre: 'Estadio' },
    { id: 2, nombre: 'Polideportivo' },
    { id: 3, nombre: 'Piscina' },
    { id: 4, nombre: 'Cancha' },
    { id: 5, nombre: 'Gimnasio' }
  ];

  // Perfil de usuario
  perfilUsuario = signal({
    username: 'nombre_usuario',
    edad: 25,
    municipio: 'Cartagena',
    instagram_url: '',
    tiktok_url: '',
    nombre_equipo: ''
  });

  // Métodos adicionales
  abrirFiltros() {
    this.filtrosAbiertos.set(true);
  }

  actualizarTags(event: any) {
    const checkbox = event.target;
    const tag = checkbox.dataset.tag;
    if (checkbox.checked) {
      if (!this.filtrosSeleccionados().includes(tag)) {
        this.filtrosSeleccionados.set([...this.filtrosSeleccionados(), tag]);
      }
    } else {
      this.filtrosSeleccionados.set(this.filtrosSeleccionados().filter(t => t !== tag));
    }
  }

  quitarTag(tag: string) {
    this.filtrosSeleccionados.set(this.filtrosSeleccionados().filter(t => t !== tag));
  }

  limpiar() {
    this.filtrosSeleccionados.set([]);
  }

  cerrarOverlay() {
    this.showModal.set(false);
    this.selectedEvento.set(null);
  }

  crearCuenta(event: Event) {
    event.preventDefault();
    // Lógica para crear cuenta
    console.log('Crear cuenta');
  }

  iniciarSesion(event: Event) {
    event.preventDefault();
    // Lógica para iniciar sesión
    console.log('Iniciar sesión');
  }

  // Perfil
  changeTab(tab: string) {
    this.activeTab.set(tab);
  }

  // Animación de estadísticas
  private animarStats() {
    if (isPlatformBrowser(this.platformId)) {
      // Usar Intersection Observer para animar cuando sea visible
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Animar números aquí si es necesario
            observer.disconnect();
          }
        });
      }, { threshold: 0.3 });

      // Observar la sección de stats después de que se renderice
      setTimeout(() => {
        const statsSection = document.querySelector('.stats');
        if (statsSection) {
          observer.observe(statsSection);
        }
      }, 1000);
    }
  }

  // Scroll del carrusel
  scrollCarrusel(elementId: string, direction: number) {
    const container = document.getElementById(elementId) as HTMLElement;
    if (container) {
      container.scrollBy({ left: direction * 200, behavior: 'smooth' });
    }
  }

  // Getter para eventos filtrados
  get eventosCercanosFiltrados() {
    const eventos = this.eventosCercanos();
    const filtros = this.filtrosSeleccionados();

    if (filtros.length === 0) {
      return eventos;
    }

    return eventos.filter(evento => {
      // Filtrar por deporte
      if (filtros.some(f => f.startsWith('DEP_'))) {
        const deporteFiltro = filtros.find(f => f.startsWith('DEP_'));
        if (deporteFiltro && evento.deporte !== deporteFiltro.replace('DEP_', '')) {
          return false;
        }
      }

      // Filtrar por zona
      if (filtros.some(f => f.startsWith('ZONA_'))) {
        const zonaFiltro = filtros.find(f => f.startsWith('ZONA_'));
        if (zonaFiltro && evento.municipio !== zonaFiltro.replace('ZONA_', '')) {
          return false;
        }
      }

      return true;
    });
  }
}
