import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TulipDiagramComponent } from '../tulip-diagram/tulip-diagram.component';

@Component({
    selector: 'app-route-table',
    standalone: true,
    imports: [CommonModule, TulipDiagramComponent],
    templateUrl: './route-table.component.html',
})
export class RouteTableComponent {
    @Input() steps: any[] = [];
}
