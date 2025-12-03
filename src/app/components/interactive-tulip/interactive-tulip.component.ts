import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TulipDiagramComponent } from '../tulip-diagram/tulip-diagram.component';

interface Zone {
    action: string;
    path: string;
}

@Component({
    selector: 'app-interactive-tulip',
    standalone: true,
    imports: [CommonModule, TulipDiagramComponent],
    templateUrl: './interactive-tulip.component.html',
})
export class InteractiveTulipComponent implements OnChanges {
    @Input() type: string = 'cross';
    @Input() size: number = 300;
    @Output() actionSelect = new EventEmitter<string>();

    hoverAction: string | null = null;
    zones: Zone[] = [];

    // Common zones
    private readonly topZone: Zone = { action: 'straight', path: 'M 30 0 L 70 0 L 70 40 L 30 40 Z' };
    private readonly leftZone: Zone = { action: 'left', path: 'M 0 30 L 40 30 L 40 70 L 0 70 Z' };
    private readonly rightZone: Zone = { action: 'right', path: 'M 60 30 L 100 30 L 100 70 L 60 70 Z' };
    private readonly topLeftZone: Zone = { action: 'slight_left', path: 'M 0 0 L 50 0 L 50 50 L 0 50 Z' };
    private readonly topRightZone: Zone = { action: 'slight_right', path: 'M 50 0 L 100 0 L 100 50 L 50 50 Z' };

    ngOnChanges(changes: SimpleChanges) {
        if (changes['type']) {
            this.calculateZones();
        }
    }

    private calculateZones() {
        this.zones = [];
        switch (this.type) {
            case 'cross':
                this.zones.push(this.topZone, this.leftZone, this.rightZone);
                break;
            case 't_split':
                this.zones.push(this.leftZone, this.rightZone);
                break;
            case 't_split_left':
                this.zones.push(this.topZone, this.leftZone);
                break;
            case 't_split_right':
                this.zones.push(this.topZone, this.rightZone);
                break;
            case 'y_split':
                this.zones.push(this.topLeftZone, this.topRightZone);
                break;
            case 'straight':
                this.zones.push(this.topZone);
                break;
            default:
                this.zones.push(this.topZone, this.leftZone, this.rightZone);
        }
    }

    setHoverAction(action: string | null) {
        this.hoverAction = action;
    }

    selectAction(action: string) {
        this.actionSelect.emit(action);
    }
}
