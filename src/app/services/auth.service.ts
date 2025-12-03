import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

interface LoginResponse {
    id: number;
    username: string;
    role: string;
    accessToken: string;
}

interface User {
    id: number;
    username: string;
    role: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = 'http://localhost:3000/api/auth';
    private currentUserSubject = new BehaviorSubject<User | null>(null);

    currentUser$ = this.currentUserSubject.asObservable();
    isLoggedIn = signal<boolean>(false);

    constructor(private http: HttpClient) {
        this.loadUserFromStorage();
    }

    private loadUserFromStorage() {
        const user = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        if (user && token) {
            this.currentUserSubject.next(JSON.parse(user));
            this.isLoggedIn.set(true);
        }
    }

    login(username: string, password: string): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { username, password })
            .pipe(
                tap(response => {
                    if (response.accessToken) {
                        localStorage.setItem('token', response.accessToken);
                        const user = { id: response.id, username: response.username, role: response.role };
                        localStorage.setItem('user', JSON.stringify(user));
                        this.currentUserSubject.next(user);
                        this.isLoggedIn.set(true);
                    }
                })
            );
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.currentUserSubject.next(null);
        this.isLoggedIn.set(false);
    }

    getToken(): string | null {
        return localStorage.getItem('token');
    }

    isAdmin(): boolean {
        return this.currentUserSubject.value?.role === 'admin';
    }

    getUsers(): Observable<User[]> {
        console.log('AuthService: getUsers called');
        return this.http.get<User[]>('http://localhost:3000/api/users').pipe(
            tap({
                next: () => console.log('AuthService: getUsers success'),
                error: (err) => console.error('AuthService: getUsers error', err)
            })
        );
    }

    deleteUser(id: number): Observable<any> {
        return this.http.delete(`http://localhost:3000/api/users/${id}`);
    }
}
