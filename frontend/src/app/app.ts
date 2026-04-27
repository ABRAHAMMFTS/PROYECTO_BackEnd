import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, Evento } from './services/api.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App {
  // Inyecta el servicio que hace las llamadas HTTP al backend
  private readonly api = inject(ApiService);

  // Texto que se puede mostrar en el título principal de la app
  public readonly title = signal('SportPoint');
  public readonly activeSection = signal('Inicio');
  public readonly showLogin = signal(false);
  public readonly showSignup = signal(false);
  public readonly filtrosAbierto = signal(false);
  public readonly buscadorTexto = signal('');
  public readonly currentSlide = signal(0);
  // Lista de imágenes para el carrusel inicial
  public readonly slides = signal<string[]>([
    'assets/photos/paralimpicos_yamil.jpg',
    'assets/photos/ninos_aerobicos.jpg',
    'assets/photos/patinadores_montemaria.jpg'
  ]);
  // Lista de eventos que se mostrará en la vista de eventos
  public readonly eventos = signal<Evento[]>([]);
  // Estadísticas de muestra para el panel de inicio
  public readonly stats = signal({ eventos: 12, espacios: 24, municipios: 8 });
  public readonly modalOpen = signal(false);
  // Evento seleccionado para mostrar en el modal
  public readonly selectedEvento = signal<Evento | null>(null);

  constructor() {
    // Cargar eventos desde el backend cuando se crea el componente
    this.loadEventos();
  }

  // Método que obtiene eventos desde la API y actualiza la lista de eventos.
  // Si la llamada falla, se rellena con datos de ejemplo para que la página siga funcionando.
  private loadEventos(): void {
    this.api.getEventos().subscribe({
      next: (data) => this.eventos.set(data),
      error: () => {
        this.eventos.set([
          {
            id: 1,
            nombre: 'Torneo Barrial',
            descripcion: 'Liga local de f�tbol con partidos en el estadio municipal.',
            imagen: 'assets/photos/paralimpicos_yamil.jpg',
            tags: ['F�tbol'],
            meta: ['Cartagena', '3:00 PM']
          },
          {
            id: 2,
            nombre: 'Nado Libre',
            descripcion: 'Competencia de nataci�n en piscina ol�mpica para todas las edades.',
            imagen: 'assets/photos/ni�os_aerobicos.jpg',
            tags: ['Nataci�n'],
            meta: ['Cartagena', '8:00 AM']
          }
        ]);
      }
    });
  }

  // Cambia la sección visible de la página (Inicio, Eventos, Espacios, Perfil)
  public changeSection(section: string): void {
    this.activeSection.set(section);
  }

  // Alterna la visibilidad del modal de inicio de sesión
  public toggleLogin(): void {
    this.showLogin.update((current) => !current);
  }

  // Alterna la visibilidad del modal de registro
  public toggleSignup(): void {
    this.showSignup.update((current) => !current);
  }

  // Alterna el panel de filtros en la sección de espacios
  public toggleFiltros(): void {
    this.filtrosAbierto.update((current) => !current);
  }

  // Cambia la imagen activa del carrusel sumando el desplazamiento.
  public changeSlide(offset: number): void {
    const next = this.currentSlide() + offset;
    const length = this.slides().length;
    this.currentSlide.set((next + length) % length);
  }

  // Selecciona un evento para mostrar su detalle en un modal
  public selectEvento(evento: Evento): void {
    this.selectedEvento.set(evento);
    this.modalOpen.set(true);
  }

  // Cierra el modal de detalles del evento
  public closeModal(): void {
    this.modalOpen.set(false);
    this.selectedEvento.set(null);
  }

  // Lógica de búsqueda básica, aquí se puede conectar con filtros reales
  public buscar(): void {
    console.log('Buscar instalación:', this.buscadorTexto());
  }
}
