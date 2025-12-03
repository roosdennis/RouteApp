import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Plus, Trash2, ArrowLeft, ArrowRight, ArrowUp } from 'lucide-angular';
import { TulipDiagramComponent } from '../tulip-diagram/tulip-diagram.component';
import { InteractiveTulipComponent } from '../interactive-tulip/interactive-tulip.component';
import { StrippenkaartComponent } from '../strippenkaart/strippenkaart.component';
import { HelicopterRouteComponent } from '../helicopter-route/helicopter-route.component';
import { OgenFaceComponent } from '../ogen-face/ogen-face.component';
import { OgenRouteComponent } from '../ogen-route/ogen-route.component';

@Component({
    selector: 'app-route-builder',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        LucideAngularModule,
        TulipDiagramComponent,
        InteractiveTulipComponent,
        StrippenkaartComponent,
        HelicopterRouteComponent,
        OgenFaceComponent,
        OgenRouteComponent
    ],
    templateUrl: './route-builder.component.html',
})
export class RouteBuilderComponent {
    @Input() steps: any[] = [];
    @Output() stepsChange = new EventEmitter<any[]>();

    @Input() routeType: string = 'tulip';

    @Input() heliScale: number = 100;
    @Output() heliScaleChange = new EventEmitter<number>();

    @Input() ogenTheme: string = 'smiley';
    @Output() ogenThemeChange = new EventEmitter<string>();

    // Icons
    readonly Plus = Plus;
    readonly Trash2 = Trash2;
    readonly ArrowLeft = ArrowLeft;
    readonly ArrowRight = ArrowRight;
    readonly ArrowUp = ArrowUp;

    // State
    phase: 'SELECT_TYPE' | 'SELECT_ACTION' | 'CONFIRM' = 'SELECT_TYPE';

    newStep = {
        type: 'cross',
        action: 'straight',
        text: ''
    };

    stripInput = {
        left: 0,
        right: 0
    };

    heliInput = {
        degrees: 0,
        distance: 0
    };

    ogenInput: string = 'straight';

    intersectionTypes = [
        { id: 'cross', label: '4-Sprong' },
        { id: 't_split', label: 'T-Splitsing' },
        { id: 't_split_left', label: 'Zijweg Links' },
        { id: 't_split_right', label: 'Zijweg Rechts' },
        { id: 'y_split', label: 'Y-Splitsing' },
    ];

    ogenThemes = [
        { id: 'smiley', label: 'Smiley' },
        { id: 'minecraft', label: 'Minecraft' },
        { id: 'sinterklaas', label: 'Sinterklaas' },
        { id: 'poes', label: 'Poes' },
        { id: 'monster', label: 'Monster' },
    ];

    handleAddStep() {
        let newSteps = [...this.steps];

        if (this.routeType === 'strip') {
            newSteps.push({
                id: Date.now(),
                type: 'strip_entry',
                left: this.stripInput.left,
                right: this.stripInput.right
            });
            this.stripInput = { left: 0, right: 0 };
        } else if (this.routeType === 'helicopter') {
            newSteps.push({
                id: Date.now(),
                type: 'helicopter_entry',
                degrees: Number(this.heliInput.degrees),
                distance: Number(this.heliInput.distance)
            });
            this.heliInput = { degrees: 0, distance: 0 };
        } else if (this.routeType === 'ogen') {
            newSteps.push({
                id: Date.now(),
                type: 'ogen_entry',
                direction: this.ogenInput
            });
            this.ogenInput = 'straight';
        } else {
            newSteps.push({ ...this.newStep, id: Date.now() });
            this.phase = 'SELECT_TYPE';
            this.newStep = { type: 'cross', action: 'straight', text: '' };
        }

        this.stepsChange.emit(newSteps);
    }

    handleRemoveStep(id: number) {
        const newSteps = this.steps.filter(step => step.id !== id);
        this.stepsChange.emit(newSteps);
    }

    getActionLabel(action: string): string {
        const labels: Record<string, string> = {
            straight: 'Rechtdoor',
            left: 'Linksaf',
            right: 'Rechtsaf',
            slight_left: 'Flauw Links',
            slight_right: 'Flauw Rechts',
            sharp_left: 'Scherp Links',
            sharp_right: 'Scherp Rechts',
            uturn: 'Keren'
        };
        return labels[action] || action;
    }

    getIntersectionLabel(typeId: string): string {
        return this.intersectionTypes.find(t => t.id === typeId)?.label || typeId;
    }

    setPhase(phase: 'SELECT_TYPE' | 'SELECT_ACTION' | 'CONFIRM') {
        this.phase = phase;
    }

    setNewStepType(type: string) {
        this.newStep = { ...this.newStep, type };
    }

    setNewStepAction(action: string) {
        this.newStep = { ...this.newStep, action };
    }

    updateHeliScale(val: number) {
        this.heliScaleChange.emit(val);
    }

    updateOgenTheme(val: string) {
        this.ogenThemeChange.emit(val);
    }
}
