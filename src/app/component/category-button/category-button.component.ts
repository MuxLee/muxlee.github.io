import { Component, input, InputSignal } from '@angular/core';

import { PrefixPipe } from '@pipe/prefix/prefix.pipe';

@Component({
    imports: [PrefixPipe],
    selector: 'category-button',
    styleUrl: './category-button.component.css',
    templateUrl: './category-button.component.html'
})
export class CategoryButtonComponent {

    category: InputSignal<string> = input.required<string>();

}