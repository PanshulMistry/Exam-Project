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
  filteredUsers: AdminUserProxy[] = [];  // Fetched user list
  totalItems: number = 0;                // Total number of users (for pagination)
  currentPage: number = 0;               // Current page index
  pageSize: number = 10;                 // Number of users per page
  sortBy: string = 'id';                 // Default sorting field
  sortDir: string = 'asc';               // Default sorting direction
  adminEmail: string | null = ''
  Math = Math; // To use Math functions in the template if needed

  constructor(private adminUserService: AuthService,private router: Router) {}

  ngOnInit(): void {
    this.adminEmail = localStorage.getItem("adminEmail")
    this.fetchAllUsers();
  }

  // Fetch all users with pagination and sorting
  fetchAllUsers(): void {
    this.adminUserService.getAllUsers(this.currentPage, this.pageSize, this.sortBy, this.sortDir).subscribe({
      next: (data) => {
        this.filteredUsers = data.content || [];
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
  viewUserDetails(email: string): void {
    this.router.navigate(['/profile', email]);
  }

  editUserDetails(email: string): void {
    this.router.navigate(['/editUser', email]);
  }

  viewAdminDetails() {
    this.router.navigate(['/profile', this.adminEmail]);
  }
  
  // Delete user by email
  deleteUser(email: string, index: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.adminUserService.deleteUser(email).subscribe({
        next: () => {
          console.log('User deleted successfully');
          this.filteredUsers.splice(index, 1);  // Remove user from current list
          this.totalItems--;
        },
        error: (err) => {
          console.error('Error deleting user:', err);
        }
      });
    }
  }

  // Returns an array of page numbers to display in pagination
  getPaginationRange(): number[] {
    const totalPages = Math.ceil(this.totalItems / this.pageSize);
    const maxPagesToShow = 5;
    let startPage: number, endPage: number;
    
    if (totalPages <= maxPagesToShow) {
      // If total pages are less than max to display, show all pages
      startPage = 1;
      endPage = totalPages;
    } else {
      // Calculate start and end pages to show
      const maxPagesBeforeCurrentPage = Math.floor(maxPagesToShow / 2);
      const maxPagesAfterCurrentPage = Math.ceil(maxPagesToShow / 2) - 1;
      
      if (this.currentPage <= maxPagesBeforeCurrentPage) {
        // Close to start
        startPage = 1;
        endPage = maxPagesToShow;
      } else if (this.currentPage + maxPagesAfterCurrentPage >= totalPages) {
        // Close to end
        startPage = totalPages - maxPagesToShow + 1;
        endPage = totalPages;
      } else {
        // In the middle
        startPage = this.currentPage - maxPagesBeforeCurrentPage + 1;
        endPage = this.currentPage + maxPagesAfterCurrentPage + 1;
      }
    }
    
    // Create an array of page numbers
    return Array.from(Array((endPage + 1) - startPage).keys()).map(i => startPage + i);
  }
}