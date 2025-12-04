import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LucideAngularModule, Map, ArrowRight, Compass, Smile } from 'lucide-angular';

@Component({
    selector: 'app-landing-page',
    standalone: true,
    imports: [LucideAngularModule],
    templateUrl: './landing-page.component.html',
})
export class LandingPageComponent {
    readonly Map = Map;
    readonly ArrowRight = ArrowRight;
    readonly Compass = Compass;
    readonly Smile = Smile;
    readonly currentYear = new Date().getFullYear();

    constructor(private router: Router) { }

    onStart(type: string) {
        // Navigate to new hike editor, maybe we can pass the type later
        this.router.navigate(['/hikes/new']);
    }
}
