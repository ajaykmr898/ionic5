import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import {MustNotBeLoggedGuard} from "./common/must-not-be-logged-guard.service";
import {MustBeLoggedGuard} from "./common/must-be-logged-guard.service";

const routes: Routes = [
  { path: 'login', loadChildren: () => import('./auth/login/login.module').then(m => m.LoginPageModule), canActivate: [MustNotBeLoggedGuard]},
  { path: 'home',  loadChildren: () => import('./home/home.module').then(m => m.HomePageModule),  canActivate: [MustBeLoggedGuard]},
  { path: 'calendar', loadChildren: () => import('./calendar/calendar.module').then(m => m.CalendarPageModule), canActivate: [MustBeLoggedGuard]},
  { path: '**', redirectTo: 'login', pathMatch: 'full' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
