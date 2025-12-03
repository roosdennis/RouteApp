import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Map, Printer, Home, LogIn, User } from 'lucide-angular';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { RouteBuilderComponent } from './components/route-builder/route-builder.component';
import { RouteTableComponent } from './components/route-table/route-table.component';
import { StrippenkaartComponent } from './components/strippenkaart/strippenkaart.component';
import { HelicopterRouteComponent } from './components/helicopter-route/helicopter-route.component';
import { OgenRouteComponent } from './components/ogen-route/ogen-route.component';

import { LoginComponent } from './components/login/login.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { AuthService } from './services/auth.service';
import { RouteType, AnyRouteStep } from './models/route.model';

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
        OgenRouteComponent,
        LoginComponent,
        AdminDashboardComponent
    ],
    templateUrl: './app.component.html',
})
export class AppComponent {
    view: 'landing' | 'builder' | 'login' | 'admin' = 'landing';
    routeType: RouteType = 'tulip';
    steps: AnyRouteStep[] = [];
    heliScale: number = 100;
    ogenTheme: string = 'smiley';

    // Icons
    readonly Map = Map;
    readonly Printer = Printer;
    readonly Home = Home;
    readonly LogIn = LogIn;
    readonly User = User; // Need to import User icon

    constructor(public authService: AuthService) { }

    handleStart(type: string) {
        this.routeType = type as RouteType;
        this.view = 'builder';
        this.steps = [];
    }

    setView(view: 'landing' | 'builder' | 'login' | 'admin') {
        this.view = view;
    }

    handlePrint() {
        window.print();
    }
}
