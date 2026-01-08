import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
  OnInit,
} from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SubscriptionService } from '../../services/subscription.service';
import { toSignal } from '@angular/core/rxjs-interop';

type Plan = 'BASIC' | 'STANDARD' | 'PREMIUM';

@Component({
  selector: 'app-manage-subscription',
  templateUrl: './manage-subscription.component.html',
  styleUrls: ['./manage-subscription.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class ManageSubscriptionComponent implements OnInit {
  authService = inject(AuthService);
  private userService = inject(UserService);
  private subscriptionService = inject(SubscriptionService);
  private router = inject(Router);

  // State for the selected plan and payment form
  selectedPlan = signal<Plan | null>(null);
  successMessage = signal('');

  // State for card details
  cardNumber = signal('');
  expiryDate = signal('');
  cvc = signal('');


  // Create a reactive signal for the current user
  userSignal = toSignal(this.authService.currentUser$);

  // A computed signal to easily check if the user is already subscribed
  isSubscribed = computed(() => {
    const user = this.userSignal()?.user;
    return user?.subscriptionStatus === 'ACTIVE';
  });

  plans = [
    {
      name: 'BASIC' as Plan,
      price: 149,
      features: ['SD (480p)', '1 Screen', 'With Ads', 'Mobile Only'],
    },
    {
      name: 'STANDARD' as Plan,
      price: 499,
      features: [
        'Full HD (1080p)',
        '2 Screens',
        'No Ads',
        'Downloads Available',
      ],
    },
    {
      name: 'PREMIUM' as Plan,
      price: 649,
      features: [
        '4K + HDR (2160p)',
        '4 Screens',
        'No Ads',
        'Downloads Available',
        'Spatial Audio',
      ],
    },
  ];

  ngOnInit() {
    this.refreshUser();
  }

  refreshUser() {
    this.userService.getMe().subscribe({
        next: (user) => {
             // Cast UserDTO to User for AuthService
             const appUser: any = { ...user };
             this.authService.updateUser(appUser);
        },
        error: (err) => console.error('Failed to fetch user details', err)
    });
  }

  // Calculate days remaining until expiry
  getDaysRemaining(): number {
    const user = this.authService.currentUser()?.user;
    if (!user || !user.subscriptionExpiry) return 0;

    const today = new Date();
    const endDate = new Date(user.subscriptionExpiry);
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  }

  // Format date for display
  formatDate(dateString?: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  selectPlan(plan: Plan) {
    this.selectedPlan.set(plan);
  }

  // Processes the payment and creates subscription records
  processPayment() {
    const plan = this.selectedPlan();
    
    if (
      !plan ||
      !this.cardNumber() ||
      !this.expiryDate() ||
      !this.cvc()
    ) {
      alert('Please fill in all payment details.');
      return;
    }

    // Backend call
    this.subscriptionService.subscribe(plan).subscribe({
        next: (updatedUser) => {
             // Cast UserDTO to User for AuthService
             const appUser: any = { ...updatedUser };
            this.authService.updateUser(appUser);
            this.successMessage.set(`Successfully subscribed to the ${plan} plan!`);
            this.selectedPlan.set(null); // Hide payment form
            this.refreshUser(); // Ensure UI updates
        },
        error: (err) => {
            console.error('Subscription failed', err);
            alert('Subscription failed. Please try again.');
        }
    });
  }
}
