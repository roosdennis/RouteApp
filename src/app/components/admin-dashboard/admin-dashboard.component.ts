import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { LucideAngularModule, Trash2, User } from 'lucide-angular';

@Component({
    selector: 'app-admin-dashboard',
    standalone: true,
    imports: [CommonModule, LucideAngularModule],
    templateUrl: './admin-dashboard.component.html',
})
export class AdminDashboardComponent implements OnInit {
    users: any[] = [];
    isLoading = false;
    error = '';
    showUsers = false;

    readonly Trash2 = Trash2;
    readonly User = User;

    constructor(private authService: AuthService, private cdr: ChangeDetectorRef) { }

    ngOnInit() {
    }

    toggleUsers() {
        this.showUsers = !this.showUsers;
        if (this.showUsers && this.users.length === 0) {
            this.loadUsers();
        }
    }

    loadUsers() {
        this.isLoading = true;
        this.authService.getUsers().subscribe({
            next: (data) => {
                this.users = data;
                this.isLoading = false;
                this.cdr.detectChanges();
            },
            error: (err) => {
                this.error = 'Kon gebruikers niet laden.';
                this.isLoading = false;
                console.error(err);
                this.cdr.detectChanges();
            }
        });
    }

    deleteUser(id: number) {
        if (!confirm('Weet je zeker dat je deze gebruiker wilt verwijderen?')) return;

        this.authService.deleteUser(id).subscribe({
            next: () => {
                this.users = this.users.filter(u => u.id !== id);
            },
            error: (err) => {
                alert('Kon gebruiker niet verwijderen.');
                console.error(err);
            }
        });
    }
}
