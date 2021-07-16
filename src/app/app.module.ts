import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';

import { MsalGuard, MsalInterceptor, MsalModule } from '@azure/msal-angular';
import { InteractionType, PublicClientApplication } from '@azure/msal-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

const isIE = window.navigator.userAgent.indexOf('MSIE ') > -1 || window.navigator.userAgent.indexOf('Trident/') > -1;

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ProfileComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatButtonModule,
    MatListModule,
    MatToolbarModule,
    MsalModule.forRoot(new PublicClientApplication({
      auth: {
        clientId: '329fa0f9-cfed-4d66-8350-204505b23421',
        authority: 'https://login.microsoftonline.com/common',
        redirectUri: 'http://localhost:4200/'
      },
      cache: {
        cacheLocation: 'localStorage',
        storeAuthStateInCookie: isIE, // Set to true for Internet Explorer 11
      }
    }), {
      interactionType: InteractionType.Redirect,
      authRequest: { scopes: ['user.read'] }
    },
    {
      interactionType: InteractionType.Redirect,
      protectedResourceMap: new Map([
          ['https://graph.microsoft.com/v1.0/me', ['user.read']]
      ])
    })
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true
    },
    MsalGuard],
  bootstrap: [AppComponent]
})

export class AppModule { }
