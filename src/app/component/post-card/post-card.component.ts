import { Component, HostListener, OnInit, computed, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Post } from '@model/post';
import { CategoryButtonComponent } from '@component/category-button/category-button.component';
import { LimitPipe } from '@pipe/limit/limit.pipe';
import { SuffixPipe } from '@pipe/suffix/suffix.pipe';
import { TrimPipe } from '@pipe/trim/trim.pipe';
import IdentityResolver from '@resolver/identity.resolver';

type DockDirection = 'flex-col' | 'flex-col-reverse' | 'flex-row' | 'flex-row-reverse';
type ThumbnailDock = 'bottom' | 'left' | 'right' | 'top';

@Component({
    imports: [
        CategoryButtonComponent,
        LimitPipe,
        RouterLink,
        SuffixPipe,
        TrimPipe
    ],
    selector: 'post-card',
    styleUrl: './post-card.component.css',
    templateUrl: './post-card.component.html'
})
export class PostCardComponent implements OnInit {

    public post = input.required<Post>();
    protected dockDirection = computed(() => PostCardComponent.dockDirection.get(this.thumbnailDock())!);
    protected postIdentity = computed(() => this.identityResolver.getIdentity(this.post()));
    protected summationSuffix = signal<string | undefined>(undefined);
    protected summationLimit = signal<number>(Number.MAX_SAFE_INTEGER);
    protected thumbnailDock = signal<ThumbnailDock>('left');
    private identityResolver = inject(IdentityResolver);
    private static dockDirection: Map<ThumbnailDock, DockDirection>;

    static {
        PostCardComponent.dockDirection = new Map<ThumbnailDock, DockDirection>();

        PostCardComponent.dockDirection.set('bottom', 'flex-col-reverse');
        PostCardComponent.dockDirection.set('left', 'flex-row');
        PostCardComponent.dockDirection.set('right', 'flex-row-reverse');
        PostCardComponent.dockDirection.set('top', 'flex-col');
    }

    public ngOnInit(): void {
        const event = new Event('resize');

        window.dispatchEvent(event);
    }

    @HostListener('window:resize')
    protected onWindowRezie() {
        if (window.innerWidth > 1280) {
            this.summationSuffix.set(undefined);
            this.summationLimit.set(Number.MAX_SAFE_INTEGER);
            this.thumbnailDock.set('left');
        }
        else if (window.innerWidth <= 600) {
            this.summationSuffix.set('...');
            this.summationLimit.set(100);
            this.thumbnailDock.set('top');
        }
        else {
            this.summationSuffix.set(undefined);
            this.summationLimit.set(Number.MAX_SAFE_INTEGER);
            this.thumbnailDock.set('top');
        }
    }

}

export type {
    ThumbnailDock
};