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
  allUsers: AdminUserProxy[] = [];       // Full list of users
  filteredUsers: AdminUserProxy[] = [];  // Users after search filter
  totalItems: number = 0;
  currentPage: number = 0;
  pageSize: number = 10;
  sortBy: string = 'id';
  sortDir: string = 'asc';
  adminEmail: string | null = '';
  searchText: string = '';
  Math = Math;

  constructor(private adminUserService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.adminEmail = localStorage.getItem("adminEmail");
    this.fetchAllUsers();
  }

  // Method to fetch all users or perform a search if searchText is provided
  fetchAllUsers(): void {
    if (this.searchText.trim() === '') {
      // If there's no search text, fetch all users
      this.adminUserService.getAllUsers(this.currentPage, this.pageSize, this.sortBy, this.sortDir).subscribe({
        next: (data) => {
          this.allUsers = data.content || [];
          this.totalItems = data.totalElements || 0;
          this.filteredUsers = this.allUsers; // No search filter
        },
        error: (err) => {
          console.error('Error fetching users:', err);
        }
      });
    } else {
      // If there's search text, call search API
      this.adminUserService.searchUsers(this.searchText, this.currentPage, this.pageSize).subscribe({
        next: (data) => {
          this.filteredUsers = data.content || [];
          this.totalItems = data.totalElements || 0;
        },
        error: (err) => {
          console.error('Error searching users:', err);
        }
      });
    }
  }

  // Search filter function
  applySearchFilter(): void {
    this.fetchAllUsers(); // Call fetchAllUsers to apply search filter
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.fetchAllUsers(); // Fetch users when page changes
  }

  onSortChange(sortBy: string, sortDir: string): void {
    this.sortBy = sortBy;
    this.sortDir = sortDir;
    this.fetchAllUsers(); // Fetch users when sorting changes
  }

  viewUserDetails(email: string): void {
    this.router.navigate(['/profile', email]);
  }

  editUserDetails(email: string): void {
    this.router.navigate(['/editUser', email]);
  }

  viewAdminDetails() {
    this.router.navigate(['/profile', this.adminEmail]);
  }

  logout() {
    localStorage.removeItem('jwt');
    localStorage.removeItem('role');
    localStorage.removeItem('adminEmail');
    this.router.navigate(['/login']);
  }

  deleteUser(email: string, index: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.adminUserService.deleteUser(email).subscribe({
        next: () => {
          this.fetchAllUsers();
        },
        error: (err) => {
          console.error('Error deleting user:', err);
        }
      });
    }
  }

  getPaginationRange(): number[] {
    const totalPages = Math.ceil(this.totalItems / this.pageSize);
    const maxPagesToShow = 5;
    let startPage: number, endPage: number;

    if (totalPages <= maxPagesToShow) {
      startPage = 1;
      endPage = totalPages;
    } else {
      const maxPagesBeforeCurrentPage = Math.floor(maxPagesToShow / 2);
      const maxPagesAfterCurrentPage = Math.ceil(maxPagesToShow / 2) - 1;

      if (this.currentPage <= maxPagesBeforeCurrentPage) {
        startPage = 1;
        endPage = maxPagesToShow;
      } else if (this.currentPage + maxPagesAfterCurrentPage >= totalPages) {
        startPage = totalPages - maxPagesToShow + 1;
        endPage = totalPages;
      } else {
        startPage = this.currentPage - maxPagesBeforeCurrentPage + 1;
        endPage = this.currentPage + maxPagesAfterCurrentPage + 1;
      }
    }

    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  }
}