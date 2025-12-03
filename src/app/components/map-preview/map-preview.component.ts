import { Component, Input, OnChanges, AfterViewInit, OnDestroy, SimpleChanges, ElementRef, ViewChild } from '@angular/core';
import * as L from 'leaflet';
import { Point, Instruction } from '../../utils/geo';

// Fix for default marker icon
const iconRetinaUrl = 'assets/marker-icon-2x.png';
const iconUrl = 'assets/marker-icon.png';
const shadowUrl = 'assets/marker-shadow.png';

// We need to ensure assets are available or use base64/CDN.
// For now, let's use CDN for icons to avoid asset copying issues if they aren't in assets yet.
const DefaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

@Component({
    selector: 'app-map-preview',
    standalone: true,
    templateUrl: './map-preview.component.html',
    styles: [`
    :host {
      display: block;
    }
  `]
})
export class MapPreviewComponent implements OnChanges, AfterViewInit, OnDestroy {
    @Input() track: Point[] = [];
    @Input() instructions: Instruction[] = [];

    @ViewChild('mapContainer') mapContainer!: ElementRef;

    private map: L.Map | undefined;
    private polyline: L.Polyline | undefined;
    private markers: L.Marker[] = [];

    ngAfterViewInit() {
        this.initMap();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (this.map && (changes['track'] || changes['instructions'])) {
            this.updateMap();
        }
    }

    ngOnDestroy() {
        if (this.map) {
            this.map.remove();
        }
    }

    private initMap() {
        if (!this.track || this.track.length === 0) return;

        const center = [this.track[0].lat, this.track[0].lon] as L.LatLngExpression;

        this.map = L.map(this.mapContainer.nativeElement).setView(center, 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map);

        this.updateMap();
    }

    private updateMap() {
        if (!this.map) return;

        // Clear existing layers
        if (this.polyline) {
            this.polyline.remove();
        }
        this.markers.forEach(m => m.remove());
        this.markers = [];

        if (!this.track || this.track.length === 0) return;

        // Add Polyline
        const positions = this.track.map(p => [p.lat, p.lon] as L.LatLngExpression);
        this.polyline = L.polyline(positions, { color: 'blue', weight: 4 }).addTo(this.map);

        // Fit bounds
        this.map.fitBounds(this.polyline.getBounds());

        // Add Markers
        if (this.instructions) {
            this.instructions.forEach(inst => {
                const marker = L.marker([inst.point.lat, inst.point.lon])
                    .bindPopup(`${inst.text} (${Math.round(inst.angle)}°)`)
                    .addTo(this.map!);
                this.markers.push(marker);
            });
        }
    }
}
