import { Component, EventEmitter, Output } from '@angular/core';
import { LucideAngularModule, Map, ArrowRight, Compass, Smile } from 'lucide-angular';

@Component({
    selector: 'app-landing-page',
    standalone: true,
    imports: [LucideAngularModule],
    templateUrl: './landing-page.component.html',
})
export class LandingPageComponent {
    @Output() routeSelect = new EventEmitter<string>();

    readonly Map = Map;
    readonly ArrowRight = ArrowRight;
    readonly Compass = Compass;
    readonly Smile = Smile;
    readonly currentYear = new Date().getFullYear();

    onStart(type: string) {
        this.routeSelect.emit(type);
    }
}
