import { Component, computed, input, signal } from '@angular/core';

@Component({
    selector: 'spinner',
    styleUrl: './spinner.component.css',
    templateUrl: './spinner.component.html'
})
export class SpinnerComponent {

    public color = input('#9d9d9d');
    public width = input('8');

}