import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID, APP_INITIALIZER } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from "@angular/common/http";

import { CoreModule } from './core/core.module';
import { SharedModule } from "./shared/shared.module";
import { AppComponent } from './app.component';
import { RoutesModule } from "./routes/routes.module";
import { LayoutModule } from "./layout/layout.module";
import { StartupService } from "./core/services/startup.service";
import { MenuService } from "./core/menu/menu.service";
import { TranslatorService } from "./core/translator/translator.service";
import { SettingsService } from "./core/settings/settings.service";

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export function startupServiceFactory(startupService: StartupService): Function {
    return () => { return startupService.load() };
}

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        SharedModule.forRoot(),
        CoreModule,
        LayoutModule,
        RoutesModule,
        // i18n
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        })
    ],
    providers: [
        // code see: https://github.com/unicode-cldr/cldr-core/blob/master/availableLocales.json
        { provide: LOCALE_ID, useValue: 'zh-Hans' },
        StartupService,
        {
            provide: APP_INITIALIZER,
            useFactory: startupServiceFactory,
            deps: [StartupService, MenuService, TranslatorService, SettingsService],
            multi: true
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }