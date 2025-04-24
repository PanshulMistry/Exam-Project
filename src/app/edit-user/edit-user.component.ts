import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminUserProxy, AuthService } from '../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit-user',
  standalone: false,
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.css'
})
export class EditUserComponent implements OnInit{
  userForm!: FormGroup;
  submitted = false;
  submitting = false;
  loading = true;
  errorMessage = '';
  selectedImage: File | null = null; // renamed to match service parameter
  imagePreview: string | null = null;
  userId!: string;
  user: AdminUserProxy | null = null;
  userInitials = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private http: HttpClient,
 // inject toastr
  ) {}

  ngOnInit(): void {
    const email = this.route.snapshot.paramMap.get('email') || '';
    this.initializeForm();
    this.loadUserDetails(email);
  }

  initializeForm(): void {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      contactNumber: ['', Validators.required],
      gender: ['', Validators.required],
      dob: ['', Validators.required],
      pinCode: ['', Validators.required],
      address: ['', Validators.required]
    });
  }

  get f() {
    return this.userForm.controls;
  }

  loadUserDetails(email: string): void {
    if (email) {
      this.authService.getUserDetails(email).subscribe({
        next: (userData) => {
          this.user = userData;
          console.log("user:",this.user)
          this.userForm.patchValue(userData);
          this.userInitials = this.getInitials(userData.name);

          if (userData.profileImage) {
            this.imagePreview = 'data:image/png;base64,' + userData.profileImage;
          }

          this.loading = false;
        },
        error: (err) => {
          console.error('Error fetching user details:', err);
          this.errorMessage = 'Failed to load user details.';
          this.loading = false;
        }
      });
    }
  }

  onImageSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput?.files && fileInput.files.length > 0) {
      this.selectedImage = fileInput.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(this.selectedImage);
    }
  }

  removeImage(): void {
    this.selectedImage = null;
    this.imagePreview = null;
  }

  formHasChanges(): boolean {
    if (!this.user) return true;
    const formValues = this.userForm.value;
    return Object.keys(formValues).some(key => formValues[key] !== (this.user as any)[key]);
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.userForm.invalid || this.submitting) {
      return;
    }

    this.submitting = true;

    const formValues = this.userForm.value;

    const adminUserProxy: any = {
      name: formValues.name,
      username: formValues.username,
      email: formValues.email,
      contactNumber: formValues.contactNumber,
      gender: formValues.gender,
      dob: formValues.dob,
      pinCode: formValues.pinCode,
      address: formValues.address,
    };

    console.log("adminuserproxy:",adminUserProxy)
    console.log("selectedimage:",this.selectedImage)
    this.authService.updateUserDetails(adminUserProxy, this.selectedImage!).subscribe({
      next: () => {
        alert('User updated successfully!');
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        alert('User updated successfully!');
        this.submitting = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  }
}
