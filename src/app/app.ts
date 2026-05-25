import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { StoreService } from './core/services/store.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  readonly store = inject(StoreService);
  private readonly router = inject(Router);

  authMode: 'login' | 'register' = 'login';

  auth = {
    usernameOrEmail: '',
    password: ''
  };

  registerForm = {
    username: '',
    email: '',
    fullName: '',
    password: '',
    asAdmin: false
  };

  switchRole(role: 'user' | 'admin'): void {
    this.store.setRole(role);
    void this.router.navigate([role === 'admin' ? '/admin' : '/browse']);
  }

  async login(): Promise<void> {
    const ok = await this.store.login(this.auth.usernameOrEmail, this.auth.password);
    if (!ok) {
      return;
    }
    this.auth.password = '';
    const next = this.store.role() === 'admin' ? '/admin' : '/browse';
    void this.router.navigate([next]);
  }

  async register(): Promise<void> {
    const ok = await this.store.register(
      {
        username: this.registerForm.username,
        email: this.registerForm.email,
        fullName: this.registerForm.fullName,
        password: this.registerForm.password
      },
      this.registerForm.asAdmin
    );

    if (!ok) {
      return;
    }

    const loginOk = await this.store.login(this.registerForm.email, this.registerForm.password);
    if (!loginOk) {
      return;
    }

    this.registerForm.password = '';
    this.authMode = 'login';
    const next = this.store.role() === 'admin' ? '/admin' : '/browse';
    void this.router.navigate([next]);
  }

  switchAuthMode(mode: 'login' | 'register'): void {
    this.authMode = mode;
  }

  logout(): void {
    this.store.logout();
    void this.router.navigate(['/browse']);
  }

  goUserCategory(category: 'All' | 'Concert' | 'Theater' | 'Sports' | 'Festival'): void {
    this.store.setCategory(category);
    const queryParams = category === 'All' ? {} : { cat: category };
    void this.router.navigate(['/browse'], { queryParams });
  }

  showUserNav(): boolean {
    return this.store.role() === 'user';
  }
}
