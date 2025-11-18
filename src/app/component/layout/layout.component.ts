import { Component } from '@angular/core';

import { FooterSemantic } from '@component/footer/footer.component';
import { HeaderSemantic } from '@component/header/header.component';

@Component({
    imports: [FooterSemantic, HeaderSemantic],
    selector: 'layout-semantic',
    templateUrl: './layout.component.html'
})
export class LayoutComponent {}