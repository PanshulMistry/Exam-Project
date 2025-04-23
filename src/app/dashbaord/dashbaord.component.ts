import { Component, OnInit } from '@angular/core';
import { AdminUserProxy, AuthService } from '../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-dashbaord',
  standalone: false,
  templateUrl: './dashbaord.component.html',
  styleUrl: './dashbaord.component.css'
})
export class DashbaordComponent implements OnInit{
  filteredTeams: AdminUserProxy[] = [];  // Fetched user list
  totalItems: number = 0;                // Total number of users (for pagination)
  currentPage: number = 0;               // Current page index
  pageSize: number = 10;                 // Number of users per page
  sortBy: string = 'id';                 // Default sorting field
  sortDir: string = 'asc';               // Default sorting direction

  Math = Math; // To use Math functions in the template if needed

  constructor(private adminUserService: AuthService,private router: Router) {}

  ngOnInit(): void {
    this.fetchAllUsers();
  }

  // Fetch all users with pagination and sorting
  fetchAllUsers(): void {
    this.adminUserService.getAllUsers(this.currentPage, this.pageSize, this.sortBy, this.sortDir).subscribe({
      next: (data) => {
        this.filteredTeams = data.content || [];
        this.totalItems = data.totalElements || 0;
      },
      error: (err) => {
        console.error('Error fetching users:', err);
      }
    });
  }

  // Triggered when pagination changes
  onPageChange(page: number): void {
    this.currentPage = page;
    this.fetchAllUsers();
  }

  // Handle sort change
  onSortChange(sortBy: string, sortDir: string): void {
    this.sortBy = sortBy;
    this.sortDir = sortDir;
    this.fetchAllUsers();
  }

  // Placeholder for viewing employee details
  viewEmployees(email: string): void {
    this.router.navigate(['/profile', email]);
  }
  
  // Delete user by email
  deleteTeam(email: string, index: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.adminUserService.deleteUser(email).subscribe({
        next: () => {
          console.log('User deleted successfully');
          this.filteredTeams.splice(index, 1);  // Remove user from current list
          this.totalItems--;
        },
        error: (err) => {
          console.error('Error deleting user:', err);
        }
      });
    }
  }
}
