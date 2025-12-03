import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-ogen-face',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './ogen-face.component.html',
})
export class OgenFaceComponent {
    @Input() direction: string = 'straight';
    @Input() theme: string = 'smiley';
    @Input() size: number = 100;

    get pupilX(): number {
        const offset = 6;
        switch (this.direction) {
            case 'left': return -offset;
            case 'right': return offset;
            default: return 0;
        }
    }
}
