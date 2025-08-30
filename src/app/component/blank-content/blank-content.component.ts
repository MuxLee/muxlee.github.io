import { Component, Input } from '@angular/core';

@Component({
    selector: 'blank-content',
    imports: [],
    templateUrl: './blank-content.component.html',
    styleUrl: './blank-content.component.css'
})
export class BlankContentComponent {

    @Input() title?: string;
    @Input() content?: string;

}
