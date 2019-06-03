import { AfterViewInit, Component, OnDestroy } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import Quagga from 'quagga';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: [ './app.component.scss' ]
})
export class AppComponent implements AfterViewInit, OnDestroy {
	code$: Observable<string>;

	constructor() {}

	ngAfterViewInit() {
		Quagga.init(
			{
				inputStream: {
					name: 'Live',
					type: 'LiveStream',
					target: document.querySelector('#scanner-container')
				},
				decoder: {
					readers: [
						'code_128_reader',
						'ean_reader',
						'ean_8_reader',
						'code_39_reader',
						'code_39_vin_reader',
						'codabar_reader',
						'upc_reader',
						'upc_e_reader',
						'i2of5_reader',
						'2of5_reader',
						'code_93_reader'
					]
				}
			},
			function(err) {
				if (err) {
					return;
				}
				Quagga.start();
			}
		);
	}

	ngOnInit() {
		const quagga$ = () =>
			Observable.create((observer) => {
				Quagga.onDetected((result) => observer.next(result));
			});

		this.code$ = quagga$().pipe(map((code: any) => code.codeResult.code));
	}

	ngOnDestroy(): void {
		Quagga.stop();
	}
}
