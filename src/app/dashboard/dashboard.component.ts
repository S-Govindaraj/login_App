import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  @Input() message: string = 'Do you want to logout?';
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  http = inject(HttpClient);
  userSubmit = false;
  mainContent = false;
  notclickUsers = false;
  users: any[] = []; 
  total: number = 0;
  page: number = 1;
  pages: number = 1;
  limit: number = 10;
  
  onUsersSubmit(page: number = 1) {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.userSubmit = true;
  
    this.http.get(`http://localhost:3000/api/getAllUsers?page=${page}&limit=${this.limit}`, { headers })
      .subscribe({
        next: (res: any) => {
          console.log(JSON.stringify(res.data));
          this.users = res.data;
          this.total = res.total;
          this.page = res.page;
          this.pages = res.pages;
          this.mainContent = true;
        },
        error: (err) => {
          console.error('API Error:', err);
          if (err.status === 401) {
            console.error('Unauthorized: Token may have expired.');
            alert('Unauthorized: Token may have expired.')
            this.router
            .navigate(['/login'])
          } else if (err.status === 500) {
            console.error('Server error. Please try again later.');
          } else {
            console.error('Something went wrong. Please try again.');
          }
        },
      });
  }
  
  showModal = false;

  constructor(private router: Router) {}
  private dataCache: Map<number, any[]> = new Map<number, any[]>();
  openLogoutConfirmation() {
    this.showModal = true;
  }

  onPageChange(page: number): void {
    
    if (page > 0 && page <= this.pages) {
      this.onUsersSubmit(page);
      this.notclickUsers = true;
    }
  }
 
  onConfirm() {
    debugger
    this.confirm.emit();
    sessionStorage.clear();
    this.router.navigate(['/login']);
    this.showModal = false;
  }

  onCancel() {
    this.cancel.emit();
    this.showModal = false;
  }
}
