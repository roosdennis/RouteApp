import { AnyRouteStep } from './route.model';

export interface Hike {
    id: number;
    title: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
    routes?: Route[];
    _count?: {
        routes: number;
    };
}

export interface Route {
    id: number;
    name: string;
    type: 'tulip' | 'strip' | 'helicopter' | 'ogen';
    order: number;
    data: AnyRouteStep[];
    hikeId: number;
}
