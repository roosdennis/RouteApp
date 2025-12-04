import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, Map, Printer, Home, LogIn, User } from 'lucide-angular';
import { AuthService } from './services/auth.service';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        LucideAngularModule
    ],
    templateUrl: './app.component.html',
})
export class AppComponent {
    // Icons
    readonly Map = Map;
    readonly Printer = Printer;
    readonly Home = Home;
    readonly LogIn = LogIn;
    readonly User = User;

    constructor(public authService: AuthService) { }

    handlePrint() {
        window.print();
    }
}
