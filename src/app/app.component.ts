import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Map, Printer, Home } from 'lucide-angular';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { RouteBuilderComponent } from './components/route-builder/route-builder.component';
import { RouteTableComponent } from './components/route-table/route-table.component';
import { StrippenkaartComponent } from './components/strippenkaart/strippenkaart.component';
import { HelicopterRouteComponent } from './components/helicopter-route/helicopter-route.component';
import { OgenRouteComponent } from './components/ogen-route/ogen-route.component';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        CommonModule,
        LucideAngularModule,
        LandingPageComponent,
        RouteBuilderComponent,
        RouteTableComponent,
        StrippenkaartComponent,
        HelicopterRouteComponent,
        OgenRouteComponent
    ],
    templateUrl: './app.component.html',
})
export class AppComponent {
    view: 'landing' | 'builder' = 'landing';
    routeType: string = 'tulip';
    steps: any[] = [];
    heliScale: number = 100;
    ogenTheme: string = 'smiley';

    // Icons
    readonly Map = Map;
    readonly Printer = Printer;
    readonly Home = Home;

    handleStart(type: string) {
        this.routeType = type;
        this.view = 'builder';
        this.steps = [];
    }

    setView(view: 'landing' | 'builder') {
        this.view = view;
    }

    handlePrint() {
        window.print();
    }
}
