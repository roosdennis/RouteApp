import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-tulip-diagram',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './tulip-diagram.component.html',
})
export class TulipDiagramComponent implements OnChanges {
    @Input() type: string = 'cross';
    @Input() action: string = 'straight';
    @Input() size: number = 100;
    @Input() showArrow: boolean = true;

    roads: string[] = [];
    arrowPath: string = '';
    arrowHeadPoints: string = '';

    // Constants
    readonly cx = 50;
    readonly cy = 50;
    readonly roadWidth = 20;
    readonly roadColor = "white";
    readonly roadBorder = "black";
    readonly arrowColor = "black";
    readonly startX = 50;
    readonly startY = 85;
    readonly elbowX = 50;
    readonly elbowY = 50;

    endX = 0;
    endY = 0;

    ngOnChanges(changes: SimpleChanges) {
        this.calculateRoads();
        this.calculateArrow();
    }

    private createRoadPath(angleDeg: number): string {
        const rad = (angleDeg * Math.PI) / 180;
        const length = 60;
        const x = this.cx + length * Math.cos(rad);
        const y = this.cy + length * Math.sin(rad);

        const perp = rad + Math.PI / 2;
        const dx = (this.roadWidth / 2) * Math.cos(perp);
        const dy = (this.roadWidth / 2) * Math.sin(perp);

        return `M ${this.cx - dx} ${this.cy - dy} L ${x - dx} ${y - dy} L ${x + dx} ${y + dy} L ${this.cx + dx} ${this.cy + dy} Z`;
    }

    private calculateRoads() {
        this.roads = [this.createRoadPath(90)]; // Incoming from bottom

        switch (this.type) {
            case 'cross':
                this.roads.push(this.createRoadPath(270)); // Up
                this.roads.push(this.createRoadPath(180)); // Left
                this.roads.push(this.createRoadPath(0));   // Right
                break;
            case 't_split':
                this.roads.push(this.createRoadPath(180)); // Left
                this.roads.push(this.createRoadPath(0));   // Right
                break;
            case 't_split_left':
                this.roads.push(this.createRoadPath(270)); // Up
                this.roads.push(this.createRoadPath(180)); // Left
                break;
            case 't_split_right':
                this.roads.push(this.createRoadPath(270)); // Up
                this.roads.push(this.createRoadPath(0));   // Right
                break;
            case 'y_split':
                this.roads.push(this.createRoadPath(225)); // Up-Left
                this.roads.push(this.createRoadPath(315)); // Up-Right
                break;
            case 'straight':
                this.roads.push(this.createRoadPath(270)); // Up
                break;
            default:
                this.roads.push(this.createRoadPath(270));
                this.roads.push(this.createRoadPath(180));
                this.roads.push(this.createRoadPath(0));
        }
    }

    private calculateArrow() {
        let rad = -Math.PI / 2; // Default Up

        switch (this.action) {
            case 'straight': rad = -Math.PI / 2; break;
            case 'left': rad = Math.PI; break;
            case 'right': rad = 0; break;
            case 'slight_left': rad = -Math.PI * 0.75; break;
            case 'slight_right': rad = -Math.PI * 0.25; break;
            case 'sharp_left': rad = Math.PI * 0.75; break;
            case 'sharp_right': rad = Math.PI * 0.25; break;
            case 'uturn': rad = Math.PI / 2; break;
        }

        const arrowLen = 35;
        this.endX = this.elbowX + arrowLen * Math.cos(rad);
        this.endY = this.elbowY + arrowLen * Math.sin(rad);

        this.arrowPath = `M ${this.startX} ${this.startY} L ${this.elbowX} ${this.elbowY} L ${this.endX} ${this.endY}`;

        // Arrowhead
        const arrowHeadLen = 8;
        const arrowAngle1 = rad + Math.PI * 0.85;
        const arrowAngle2 = rad - Math.PI * 0.85;

        const ahX1 = this.endX + arrowHeadLen * Math.cos(arrowAngle1);
        const ahY1 = this.endY + arrowHeadLen * Math.sin(arrowAngle1);
        const ahX2 = this.endX + arrowHeadLen * Math.cos(arrowAngle2);
        const ahY2 = this.endY + arrowHeadLen * Math.sin(arrowAngle2);

        this.arrowHeadPoints = `${this.endX},${this.endY} ${ahX1},${ahY1} ${ahX2},${ahY2}`;
    }
}
