import { Component, input, InputSignal } from '@angular/core';

import { PrefixPipe } from '@pipe/prefix/prefix.pipe';

@Component({
    selector: 'category-button',
    imports: [
        PrefixPipe,
        PrefixPipe
    ],
    templateUrl: './category-button.component.html',
    styleUrl: './category-button.component.css'
})
export class CategoryButtonComponent {

    category: InputSignal<string> = input.required<string>();

}
