import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { authGuard } from './guard/auth.guard';
import { LoginComponent } from './login/login.component';


const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },  // Default redirect to login'
  {path:'login',component:LoginComponent},
  {
    path:'dashboard',
    component:DashboardComponent,
    canActivate:[authGuard]
  },
  // { path: 'dashboard', component:DashboardComponent } ,
  // { path: '**', redirectTo: '/login' }, 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
