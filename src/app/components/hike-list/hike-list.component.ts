import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HikeService } from '../../services/hike.service';
import { Hike } from '../../models/hike.model';
import { LucideAngularModule, Plus, Map, Calendar } from 'lucide-angular';

@Component({
  selector: 'app-hike-list',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  template: `
    <div class="container mx-auto p-6">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-gray-800">Mijn Hikes</h1>
        <a routerLink="/hikes/new" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <lucide-icon [img]="Plus" class="w-5 h-5"></lucide-icon>
          Nieuwe Hike
        </a>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div *ngFor="let hike of hikes" class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div class="flex justify-between items-start mb-4">
            <h2 class="text-xl font-semibold text-gray-800">{{ hike.title }}</h2>
            <lucide-icon [img]="Map" class="w-6 h-6 text-green-600"></lucide-icon>
          </div>
          
          <p class="text-gray-600 mb-4 line-clamp-2">{{ hike.description || 'Geen beschrijving' }}</p>
          
          <div class="flex items-center gap-4 text-sm text-gray-500 mb-6">
            <div class="flex items-center gap-1">
              <lucide-icon [img]="Calendar" class="w-4 h-4"></lucide-icon>
              <span>{{ hike.updatedAt | date:'shortDate' }}</span>
            </div>
            <div>
              {{ hike._count?.routes || 0 }} routes
            </div>
          </div>

          <div class="flex gap-2">
            <a [routerLink]="['/hikes', hike.id]" class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-center py-2 rounded-lg transition-colors">
              Bewerken
            </a>
          </div>
        </div>

        <!-- Empty State -->
        <div *ngIf="hikes.length === 0" class="col-span-full text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
          <lucide-icon [img]="Map" class="w-12 h-12 text-gray-400 mx-auto mb-4"></lucide-icon>
          <h3 class="text-lg font-medium text-gray-900 mb-2">Nog geen hikes</h3>
          <p class="text-gray-500 mb-6">Maak je eerste hike aan om te beginnen met routes plannen.</p>
          <a routerLink="/hikes/new" class="text-green-600 hover:text-green-700 font-medium">
            Start een nieuwe hike &rarr;
          </a>
        </div>
      </div>
    </div>
  `
})
export class HikeListComponent implements OnInit {
  hikes: Hike[] = [];
  readonly Plus = Plus;
  readonly Map = Map;
  readonly Calendar = Calendar;

  constructor(
    private hikeService: HikeService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.loadHikes();
  }

  loadHikes() {
    this.hikeService.getHikes().subscribe({
      next: (hikes) => {
        this.hikes = hikes;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error loading hikes:', err)
    });
  }
}
