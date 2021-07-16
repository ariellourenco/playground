import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MsalBroadcastService, MsalService, MsalGuardConfiguration, MSAL_GUARD_CONFIG } from '@azure/msal-angular';
import { AuthenticationResult, InteractionStatus, InteractionType, PopupRequest, RedirectRequest } from '@azure/msal-browser';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit, OnDestroy {
  private readonly _destroying$ = new Subject<void>();
  title = 'Planet - Azure B2C';
  isIframe = false;
  loginDisplay = false;

  constructor(@Inject(MSAL_GUARD_CONFIG) private guardConfig: MsalGuardConfiguration,
    private authService: MsalService,
    private broadcastService: MsalBroadcastService) { }

  ngOnInit() {
    this.isIframe = window !== window.parent && !window.opener;

    this.broadcastService.inProgress$.pipe(
      filter((status: InteractionStatus) => status === InteractionStatus.None),
      takeUntil(this._destroying$)
    ).subscribe(() => { this.setLoginDisplay(); });
  }

  login() {
    if (this.guardConfig.authRequest) {
      this.authService.loginPopup({ ...this.guardConfig.authRequest } as PopupRequest)
        .subscribe((response: AuthenticationResult) => {
          this.authService.instance.setActiveAccount(response.account);
        });
    } else {
      this.authService.loginPopup()
        .subscribe((response: AuthenticationResult) => {
          this.authService.instance.setActiveAccount(response.account);
        });
    }
  }

  setLoginDisplay() {
    this.loginDisplay = this.authService.instance.getAllAccounts().length > 0;
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}
