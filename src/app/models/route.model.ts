export type RouteType = 'tulip' | 'strip' | 'helicopter' | 'ogen';

export interface RouteStep {
    id: string;
    instruction: string;
    distance: number; // in meters
}

export interface TulipStep extends RouteStep {
    type: 'tulip';
    image?: string; // For custom drawings if needed
    // Specific properties for Bolletje Pijltje can be added here
}

export interface StripStep extends RouteStep {
    type: 'strip';
    // Specific properties for Stripkaart can be added here
}

export interface HelicopterStep extends RouteStep {
    type: 'helicopter';
    degrees: number; // Direction in degrees
}

export interface OgenStep extends RouteStep {
    type: 'ogen';
    // Specific properties for Smiley/Ogen can be added here
}

export type AnyRouteStep = TulipStep | StripStep | HelicopterStep | OgenStep;
