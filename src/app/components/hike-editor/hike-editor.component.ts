import { Component, OnInit } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HikeService } from '../../services/hike.service';
import { Hike, Route } from '../../models/hike.model';
import { RouteBuilderComponent } from '../route-builder/route-builder.component';
import { LucideAngularModule, Save, ArrowLeft, Plus, Trash2, Edit2 } from 'lucide-angular';

@Component({
  selector: 'app-hike-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, RouteBuilderComponent, LucideAngularModule],
  template: `
    <div class="container mx-auto p-6">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <div class="flex items-center gap-4">
          <a routerLink="/hikes" class="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <lucide-icon [img]="ArrowLeft" class="w-6 h-6 text-gray-600"></lucide-icon>
          </a>
          <div>
            <h1 class="text-2xl font-bold text-gray-800" *ngIf="!isEditingTitle" (click)="isEditingTitle = true">
              {{ hike.title || 'Nieuwe Hike' }}
              <lucide-icon [img]="Edit2" class="w-4 h-4 inline ml-2 text-gray-400 cursor-pointer"></lucide-icon>
            </h1>
            <input *ngIf="isEditingTitle" [(ngModel)]="hike.title" (blur)="saveHikeDetails()" (keyup.enter)="saveHikeDetails()" 
                   class="text-2xl font-bold text-gray-800 border-b-2 border-green-500 focus:outline-none bg-transparent" autoFocus>
          </div>
        </div>
        <button (click)="saveHike()" class="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <lucide-icon [img]="Save" class="w-5 h-5"></lucide-icon>
          Opslaan
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Route List (Sidebar) -->
        <div class="lg:col-span-1 space-y-6">
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 class="text-lg font-semibold text-gray-800 mb-4">Routes</h2>
            
            <div class="space-y-3 mb-6">
              <div *ngFor="let route of hike.routes; let i = index" 
                   (click)="selectRoute(route)"
                   [class.border-green-500]="selectedRoute === route"
                   class="p-4 border rounded-lg cursor-pointer hover:border-green-300 transition-colors bg-gray-50 group relative">
                <div class="flex justify-between items-center">
                  <span class="font-medium text-gray-700">
                    {{ i + 1 }}. {{ route.name }}
                  </span>
                  <span class="text-xs px-2 py-1 bg-gray-200 rounded-full text-gray-600 uppercase">{{ route.type }}</span>
                </div>
                <button (click)="deleteRoute(route, $event)" class="absolute top-2 right-2 p-1 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  <lucide-icon [img]="Trash2" class="w-4 h-4"></lucide-icon>
                </button>
              </div>
            </div>

            <button (click)="startNewRoute()" class="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-green-500 hover:text-green-600 transition-colors flex items-center justify-center gap-2">
              <lucide-icon [img]="Plus" class="w-5 h-5"></lucide-icon>
              Route Toevoegen
            </button>
          </div>
        </div>

        <!-- Editor Area -->
        <div class="lg:col-span-2">
          <div *ngIf="selectedRoute" class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div class="mb-6 flex gap-4">
              <div class="flex-1">
                <label class="block text-sm font-medium text-gray-700 mb-1">Route Naam</label>
                <input [(ngModel)]="selectedRoute.name" class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent">
              </div>
              <div class="w-48">
                <label class="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select [(ngModel)]="selectedRoute.type" class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent">
                  <option value="tulip">Bolletje Pijltje</option>
                  <option value="strip">Strippenkaart</option>
                  <option value="helicopter">Helikopter</option>
                  <option value="ogen">Ogen/Smiley</option>
                </select>
              </div>
            </div>

            <app-route-builder 
              [steps]="selectedRoute.data" 
              (stepsChange)="selectedRoute.data = $event"
              [routeType]="selectedRoute.type">
            </app-route-builder>
          </div>

          <div *ngIf="!selectedRoute" class="h-full flex flex-col items-center justify-center text-gray-400 min-h-[400px] bg-gray-50 rounded-xl border border-gray-200">
            <lucide-icon [img]="Edit2" class="w-12 h-12 mb-4 opacity-50"></lucide-icon>
            <p>Selecteer een route of maak een nieuwe aan</p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class HikeEditorComponent implements OnInit {
  hike: Hike = {
    id: 0,
    title: 'Nieuwe Hike',
    description: '',
    createdAt: '',
    updatedAt: '',
    routes: []
  };

  selectedRoute: Route | null = null;
  isEditingTitle = false;
  isNewHike = true;

  // Icons
  readonly Save = Save;
  readonly ArrowLeft = ArrowLeft;
  readonly Plus = Plus;
  readonly Trash2 = Trash2;
  readonly Edit2 = Edit2;

  constructor(
    private hikeService: HikeService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isNewHike = false;
      this.loadHike(parseInt(id));
    }
  }

  loadHike(id: number) {
    this.hikeService.getHike(id).subscribe({
      next: (hike) => {
        this.hike = hike;
        if (!this.hike.routes) this.hike.routes = [];
      },
      error: (err) => console.error('Error loading hike:', err)
    });
  }

  saveHikeDetails() {
    this.isEditingTitle = false;
    if (!this.isNewHike) {
      this.hikeService.updateHike(this.hike.id, { title: this.hike.title, description: this.hike.description }).subscribe();
    }
  }

  startNewRoute() {
    const newRoute: Route = {
      id: 0, // Temp ID
      name: `Route ${this.hike.routes!.length + 1}`,
      type: 'tulip',
      order: this.hike.routes!.length,
      data: [],
      hikeId: this.hike.id
    };

    if (!this.hike.routes) this.hike.routes = [];
    this.hike.routes.push(newRoute);
    this.selectedRoute = newRoute;
  }

  selectRoute(route: Route) {
    this.selectedRoute = route;
  }

  deleteRoute(route: Route, event: Event) {
    event.stopPropagation();
    if (confirm('Weet je zeker dat je deze route wilt verwijderen?')) {
      if (route.id !== 0) {
        this.hikeService.deleteRoute(this.hike.id, route.id).subscribe();
      }
      this.hike.routes = this.hike.routes!.filter(r => r !== route);
      if (this.selectedRoute === route) this.selectedRoute = null;
    }
  }

  saveHike() {
    if (this.isNewHike) {
      this.hikeService.createHike({ title: this.hike.title, description: this.hike.description }).subscribe({
        next: (hike) => {
          this.hike.id = hike.id;
          this.isNewHike = false;
          this.saveRoutes().subscribe({
            next: () => {
              this.router.navigate(['/hikes', hike.id]);
            },
            error: (err) => console.error('Error saving routes:', err)
          });
        },
        error: (err) => console.error('Error creating hike:', err)
      });
    } else {
      this.hikeService.updateHike(this.hike.id, { title: this.hike.title, description: this.hike.description }).subscribe({
        next: () => {
          this.saveRoutes().subscribe({
            next: () => console.log('Routes updated'),
            error: (err) => console.error('Error updating routes:', err)
          });
        },
        error: (err) => console.error('Error updating hike:', err)
      });
    }
  }

  saveRoutes(): Observable<any[]> {
    const observables: Observable<any>[] = [];

    this.hike.routes?.forEach(route => {
      const routeData = {
        name: route.name,
        type: route.type,
        order: route.order,
        data: route.data
      };

      if (route.id === 0) {
        observables.push(this.hikeService.addRoute(this.hike.id, routeData).pipe(
          tap((savedRoute) => route.id = savedRoute.id)
        ));
      } else {
        observables.push(this.hikeService.updateRoute(this.hike.id, route.id, routeData));
      }
    });

    return observables.length > 0 ? forkJoin(observables) : of([]);
  }
}
