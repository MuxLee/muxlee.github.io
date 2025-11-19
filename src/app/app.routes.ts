import { Routes } from '@angular/router';
import { MainComponent } from '@page/main/main.component';
import { PostComponent } from '@page/post/post.component';

export const routes: Routes = [
    {
        path: '',
        component: MainComponent
    },
    {
        path: 'post',
        loadComponent: () => PostComponent
    }
];