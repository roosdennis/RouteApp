import { Component, EventEmitter, Output } from '@angular/core';
import { LucideAngularModule, Upload } from 'lucide-angular';

@Component({
    selector: 'app-file-upload',
    standalone: true,
    imports: [LucideAngularModule],
    templateUrl: './file-upload.component.html',
})
export class FileUploadComponent {
    @Output() upload = new EventEmitter<File>();

    readonly Upload = Upload;

    onDrop(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();

        const files = event.dataTransfer?.files;
        if (files && files.length > 0) {
            this.upload.emit(files[0]);
        }
    }

    onDragOver(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();
    }

    onFileSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            this.upload.emit(input.files[0]);
        }
    }

    triggerFileInput() {
        const fileInput = document.getElementById('fileInput') as HTMLInputElement;
        fileInput?.click();
    }
}
