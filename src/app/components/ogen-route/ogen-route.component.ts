import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OgenFaceComponent } from '../ogen-face/ogen-face.component';

@Component({
    selector: 'app-ogen-route',
    standalone: true,
    imports: [CommonModule, OgenFaceComponent],
    templateUrl: './ogen-route.component.html',
})
export class OgenRouteComponent {
    @Input() steps: any[] = [];
    @Input() theme: string = 'smiley';
}
