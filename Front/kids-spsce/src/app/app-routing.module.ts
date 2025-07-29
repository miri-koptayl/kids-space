import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

  const routes: Routes = [
    { path: 'auth', loadChildren: () => import('./auth/auth/auth.module').then(m => m.AuthModule) },
    { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
    { path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule) },
  ];
  
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
