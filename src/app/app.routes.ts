import { Routes } from '@angular/router';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { LoginComponent } from './components/login/login.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { HikeListComponent } from './components/hike-list/hike-list.component';
import { HikeEditorComponent } from './components/hike-editor/hike-editor.component';
import { authGuard } from './guards/auth.guard'; // I might need to create this

export const routes: Routes = [
    { path: '', component: LandingPageComponent },
    { path: 'login', component: LoginComponent },
    { path: 'admin', component: AdminDashboardComponent, canActivate: [authGuard] },
    { path: 'hikes', component: HikeListComponent, canActivate: [authGuard] },
    { path: 'hikes/:id', component: HikeEditorComponent, canActivate: [authGuard] },
    { path: '**', redirectTo: '' }
];
