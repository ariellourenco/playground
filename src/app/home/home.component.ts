import { Component, OnInit } from '@angular/core';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { InteractionStatus } from '@azure/msal-browser';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  loginDisplay = false;

  constructor(private authService: MsalService, private broadcastService: MsalBroadcastService) { }

  ngOnInit(): void {
    // In order to render certain UI only for authenticated users, components have to subscribe to
    // the MsalBroadcastService to see if users have been signed in and interaction has completed.
    this.broadcastService.inProgress$
      .pipe(filter((status: InteractionStatus) => status == InteractionStatus.None))
      .subscribe(() => { this.setLoginDisplay(); })
  }

  setLoginDisplay()
  {
    this.loginDisplay = this.authService.instance.getAllAccounts().length > 0;
  }
}
