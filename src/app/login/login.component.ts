import { Component, NgZone } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
declare var hcaptcha: any;

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  showPassword: boolean = false;
  hcaptchaToken: string | null = null;
  hcaptchaWidgetId: any = null;

  constructor(
    private router: Router,
    private authService: AuthService,
    private zone: NgZone
  ) {}

  ngOnInit() {
    (window as any).onCaptchaVerified = (token: string) => {
      this.zone.run(() => {
        this.hcaptchaToken = token;
        console.log('✅ Captcha token set:', token);
      });
    };
  }

  ngAfterViewInit() {
    this.loadCaptcha();
  }

  loadCaptcha() {
    const interval = setInterval(() => {
      if (typeof hcaptcha !== 'undefined') {
        this.hcaptchaWidgetId = hcaptcha.render('hcaptcha-container', {
          sitekey: '220ee742-09dc-487c-8cd0-695677f6b966',
          callback: 'onCaptchaVerified'
        });
        clearInterval(interval);
      }
    }, 100); // Retry until hcaptcha is loaded
  }

  resetCaptcha() {
    if (this.hcaptchaWidgetId !== null && typeof hcaptcha !== 'undefined') {
      hcaptcha.reset(this.hcaptchaWidgetId);
      this.hcaptchaToken = null;
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  saveLogin(loginForm: NgForm) {
    const { email, password } = loginForm.value;

    if (!this.hcaptchaToken) {
      alert('Please complete the captcha before logging in.');
      return;
    }

    if (loginForm.valid) {
      this.authService.login(email, password).subscribe(
        (response) => {
          console.log('Login Response:', response);

          if (response && response.token) {
            localStorage.setItem('jwt', response.token);
            localStorage.setItem('role', response.role);
            localStorage.setItem('adminEmail', response.email);

            if (response.role === 'ADMIN') {
              this.router.navigate(['/dashboard']);
            }
          } else {
            alert("Invalid login response.");
            hcaptcha.reset();
            this.hcaptchaToken = null; // reset if login response is invalid
          }
        },
        (error) => {
          alert("Login failed. Please try again.");
          hcaptcha.reset();
          this.hcaptchaToken = null; // reset on login error
        }
      );
    }
  }
}
