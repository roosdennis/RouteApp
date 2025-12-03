import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-helicopter-route',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './helicopter-route.component.html',
})
export class HelicopterRouteComponent implements OnChanges {
    @Input() steps: any[] = [];
    @Input() scale: number = 100;

    coords: any[] = [];
    viewBox: string = '0 0 100 100';
    minX = 0;
    maxX = 0;
    minY = 0;
    maxY = 0;

    ngOnChanges(changes: SimpleChanges) {
        this.calculateRoute();
    }

    private calculateRoute() {
        if (!this.steps || this.steps.length === 0) return;

        const pxPerCm = 25;

        this.coords = this.steps.map(step => {
            const angleRad = (step.degrees - 90) * (Math.PI / 180);
            const lengthPx = step.distance * pxPerCm;
            const x = lengthPx * Math.cos(angleRad);
            const y = lengthPx * Math.sin(angleRad);
            return { x, y, angleRad, id: step.id };
        });

        this.minX = 0; this.maxX = 0; this.minY = 0; this.maxY = 0;
        this.coords.forEach(c => {
            this.minX = Math.min(this.minX, c.x);
            this.maxX = Math.max(this.maxX, c.x);
            this.minY = Math.min(this.minY, c.y);
            this.maxY = Math.max(this.maxY, c.y);
        });

        const padding = 60;
        this.minX -= padding;
        this.maxX += padding;
        this.minY -= padding;
        this.maxY += padding;

        const width = this.maxX - this.minX;
        const height = this.maxY - this.minY;
        this.viewBox = `${this.minX} ${this.minY} ${width} ${height}`;
    }

    getArrowPoints(x: number, y: number, angleRad: number): string {
        const arrowLen = 10;
        const arrowLeftAngle = angleRad + (135 * Math.PI / 180);
        const arrowRightAngle = angleRad - (135 * Math.PI / 180);

        const xLeft = x + arrowLen * Math.cos(arrowLeftAngle);
        const yLeft = y + arrowLen * Math.sin(arrowLeftAngle);
        const xRight = x + arrowLen * Math.cos(arrowRightAngle);
        const yRight = y + arrowLen * Math.sin(arrowRightAngle);

        return `${xLeft},${yLeft} ${x},${y} ${xRight},${yRight}`;
    }

    getTextPos(x: number, y: number, angleRad: number): { x: number, y: number } {
        const textDist = 20;
        return {
            x: x + textDist * Math.cos(angleRad),
            y: y + textDist * Math.sin(angleRad)
        };
    }
}
