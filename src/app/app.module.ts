import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
//ngprime
import {CalendarModule} from 'primeng/calendar';
import {MessageService} from 'primeng/components/common/messageservice';
import {DialogModule} from 'primeng/dialog';

//firestorage
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
//fireDatabase
import { AngularFireDatabaseModule } from 'angularfire2/database';

import { environment } from '../environments/environment';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireDatabaseModule,
    FormsModule,
    CalendarModule,
    BrowserAnimationsModule,
    DialogModule
  ],
  providers: [MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
