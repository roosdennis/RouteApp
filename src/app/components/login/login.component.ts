import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LucideAngularModule, LogIn, Map, User, Lock } from 'lucide-angular';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule, LucideAngularModule],
    templateUrl: './login.component.html',
})
export class LoginComponent {
    @Output() loginSuccess = new EventEmitter<void>();

    username = '';
    password = '';
    error = '';
    isLoading = false;

    readonly LogIn = LogIn;
    readonly Map = Map;
    readonly User = User;
    readonly Lock = Lock;

    constructor(
        private authService: AuthService,
        private router: Router,
        private route: ActivatedRoute
    ) { }

    onSubmit() {
        if (!this.username || !this.password) return;

        this.isLoading = true;
        this.error = '';

        this.authService.login(this.username, this.password).subscribe({
            next: () => {
                this.isLoading = false;
                this.loginSuccess.emit();
                // Navigate to return url or home
                const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
                this.router.navigateByUrl(returnUrl);
            },
            error: (err) => {
                this.isLoading = false;
                this.error = 'Ongeldige gebruikersnaam of wachtwoord';
                console.error(err);
            }
        });
    }

    onRegister() {
        alert('Registratie functionaliteit komt binnenkort!');
    }
}
