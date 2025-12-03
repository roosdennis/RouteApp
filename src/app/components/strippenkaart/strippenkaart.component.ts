import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-strippenkaart',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './strippenkaart.component.html',
})
export class StrippenkaartComponent {
    @Input() steps: any[] = [];

    // Configuration
    readonly stepHeight = 80;
    readonly lineWidth = 4;
    readonly stripLength = 30;
    readonly stripWidth = 3;
    readonly dotRadius = 8;
    readonly centerX = 150;

    get totalHeight(): number {
        return (this.steps?.length || 0) * this.stepHeight + 150;
    }

    getStrips(step: any): { left: number, right: number } {
        if (step.type === 'strip_entry') {
            return { left: step.left || 0, right: step.right || 0 };
        }

        let left = 0;
        let right = 0;
        const { type, action } = step;

        if (type === 'cross') {
            if (action === 'straight') { left = 1; right = 1; }
            else if (action === 'left') { right = 2; }
            else if (action === 'right') { left = 2; }
        }
        else if (type === 't_split') {
            if (action === 'left') { right = 1; }
            else if (action === 'right') { left = 1; }
        }
        else if (type === 't_split_left') {
            if (action === 'straight') { left = 1; }
            else if (action === 'left') { right = 1; }
        }
        else if (type === 't_split_right') {
            if (action === 'straight') { right = 1; }
            else if (action === 'right') { left = 1; }
        }
        else if (type === 'y_split') {
            if (action === 'slight_left' || action === 'left') { right = 1; }
            else if (action === 'slight_right' || action === 'right') { left = 1; }
        }

        return { left, right };
    }

    getFanLines(cx: number, cy: number, count: number, side: number): { x1: number, y1: number, x2: number, y2: number }[] {
        const lines: { x1: number, y1: number, x2: number, y2: number }[] = [];
        const angles: number[] = [];

        if (count === 1) angles.push(0);
        else if (count === 2) angles.push(25, -25);
        else if (count === 3) angles.push(35, 0, -35);
        else if (count === 4) angles.push(45, 15, -15, -45);

        angles.forEach(angle => {
            const rad = (angle * Math.PI) / 180;
            const x2 = cx + side * this.stripLength * Math.cos(rad);
            const y2 = cy - this.stripLength * Math.sin(rad);
            lines.push({ x1: cx, y1: cy, x2, y2 });
        });

        return lines;
    }

    getStepY(idx: number): number {
        return this.totalHeight - 50 - ((idx + 1) * this.stepHeight);
    }
}
