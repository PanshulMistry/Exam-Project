import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  showPassword: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  saveLogin(loginForm: NgForm) {
    const { email, password } = loginForm.value;

    if (loginForm.valid) {
      this.authService.login(email, password).subscribe(
        (response) => {
          console.log('Login Response:', response);

          if (response && response.token) {
            localStorage.setItem('jwt', response.token);
            localStorage.setItem('role', response.role);

            if (response.role === 'ADMIN') {
              this.router.navigate(['/dashboard']);
            }
          //   } else if (response.role === 'EMPLOYEE'){
          //     this.router.navigate(['/empHome']);
          //   }
          } else {
            alert("Invalid login response.");
          }
        },
        (error) => {
          alert("Login failed. Please try again.");
        }
      );
    }
  }
}
