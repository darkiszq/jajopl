import { Routes } from '@angular/router';
import { Loginpage } from './loginpage/loginpage';
import { Home } from './home/home';

export const routes: Routes = [
    {
        path: 'login',
        component: Loginpage
    },
    {
        path:'',
        component: Home
    }
];
