import { Routes } from '@angular/router';
import { Loginpage } from './loginpage/loginpage';
import { Home } from './home/home';
import { Profile } from './profile/profile';
import { Memeadd } from './memeadd/memeadd';
import { Postsearch } from './postsearch/postsearch';

export const routes: Routes = [
    {
        path: 'login',
        component: Loginpage
    },
    {
        path:'',
        component: Home
    },
    {
        path:'user',
        component: Profile
    },
    {
        path:'meme',
        component: Memeadd
    },
    {
        path:'search',
        component: Postsearch
    }
];
