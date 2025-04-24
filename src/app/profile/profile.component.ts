import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { AdminUserProxy, AuthService } from '../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit{
  user: AdminUserProxy | null = null;
  userInitials: string = '';
  showNavbar: boolean = true;
  constructor(private route: ActivatedRoute, private authService: AuthService,private router:Router) {}

  ngOnInit(): void {
    const emailFromRoute = this.route.snapshot.paramMap.get('email');
    const adminEmail = localStorage.getItem('adminEmail');

    // If the email from the route is adminEmail, hide the navbar
    this.showNavbar = emailFromRoute === adminEmail;
    const email = this.route.snapshot.paramMap.get('email');
    if (email) {
      this.authService.getUserDetails(email).subscribe({
        next: (userData) => {
          this.user = userData;
          // Set the initials when user data is fetched
          if (this.user) {
            this.userInitials = this.getInitials(this.user.name);
          }
        },
        error: (err) => {
          console.error('Error fetching user details:', err);
        }
      });
    }
  }

  logout() {
    localStorage.removeItem('jwt');
    localStorage.removeItem('role');
    localStorage.removeItem('adminEmail');
  
    this.router.navigate(['/login']); // Navigate to the login page
  }

  // Function to extract the initials from the user's full name
  getInitials(name: string): string {
    const nameParts = name.split(' ');
    const initials = nameParts.map(part => part.charAt(0).toUpperCase()).join('');
    return initials;
  }
}
