import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashbaordComponent } from './dashbaord/dashbaord.component';
import { ProfileComponent } from './profile/profile.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { AuthGuard } from './auth.guard';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

const routes: Routes = [{ path: "", component: LoginComponent },{ path: "dashboard", component: DashbaordComponent, canActivate: [AuthGuard]  }
  ,{ path: 'profile/:email', component: ProfileComponent, canActivate: [AuthGuard]  }, {path: 'editUser/:email', component: EditUserComponent , canActivate: [AuthGuard] }
,{ path: "forgotPassword", component: ForgotPasswordComponent },  { path: "Zp4Lq6dYtXv0RAfMnJw82EoKCyHgBb9TuVNsx3QZLiPmWkUDG7rFahceoMTlXq1SvnbJy", component: ResetPasswordComponent},{ path: '**', redirectTo: '/' }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
