import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Hike, Route } from '../models/hike.model';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class HikeService {
    private apiUrl = `${environment.apiUrl}/hikes`;

    constructor(private http: HttpClient) { }

    getHikes(): Observable<Hike[]> {
        return this.http.get<Hike[]>(this.apiUrl);
    }

    getHike(id: number): Observable<Hike> {
        return this.http.get<Hike>(`${this.apiUrl}/${id}`);
    }

    createHike(hike: { title: string, description?: string }): Observable<Hike> {
        return this.http.post<Hike>(this.apiUrl, hike);
    }

    updateHike(id: number, hike: { title: string, description?: string }): Observable<Hike> {
        return this.http.put<Hike>(`${this.apiUrl}/${id}`, hike);
    }

    deleteHike(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    addRoute(hikeId: number, route: Omit<Route, 'id' | 'hikeId'>): Observable<Route> {
        return this.http.post<Route>(`${this.apiUrl}/${hikeId}/routes`, route);
    }

    updateRoute(hikeId: number, routeId: number, route: Omit<Route, 'id' | 'hikeId'>): Observable<Route> {
        return this.http.put<Route>(`${this.apiUrl}/${hikeId}/routes/${routeId}`, route);
    }

    deleteRoute(hikeId: number, routeId: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${hikeId}/routes/${routeId}`);
    }
}
