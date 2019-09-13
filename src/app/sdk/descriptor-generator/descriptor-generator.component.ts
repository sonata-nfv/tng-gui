import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
// import { ControlsValidatorDirective } from '../../shared/utils/controls-validator';
import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';
import { SdkService } from '../sdk.service';
import { ConfigService } from '../../shared/services/config/config.service';
import { Project } from '../Project';

@Component({
	selector: 'app-descriptor-generator',
	templateUrl: './descriptor-generator.component.html',
	styleUrls: ['./descriptor-generator.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class DescriptorGeneratorComponent implements OnInit {

	serviceForm: FormGroup;
	disabledButton = true;
	section = 'sdk';
	project = new Project();

	constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient, private sdkService: SdkService,
				private config: ConfigService) { }

	ngOnInit() {
		this.initForm();
	}

	initForm() {
		this.serviceForm = new FormGroup({
			name: new FormControl(''),
			author: new FormControl(''),
			vendor: new FormControl(''),
			description: new FormControl(''),
			numberOfVNFs: new FormControl('', [Validators.required])
		});
		this.serviceForm.valueChanges.subscribe(() => this.onFormChanges());
	}

	private onFormChanges() {
		this.disabledButton = !this.serviceForm.valid;
	}

	createService() {
		const endpoint = this.config.baseSDK + ':5098/api/v1/projects';

		// only generate Tango descriptors as the SP doesn't accept packages with Tango and OSM
		const body = new HttpParams().set('only_tango', 'true');

		// get info from form
		// const name = this.serviceForm.get('name').value;
		// const author = this.serviceForm.get('author').value;
		// const vendor = this.serviceForm.get('vendor').value;
		// const description = this.serviceForm.get('description').value;
		// const numVnfs = this.serviceForm.get('numberOfVNFs').value;

		// set values that are not empty
		body.set('name', this.project.name);
		body.set('author', this.project.author);
		body.set('vendor', this.project.vendor);
		body.set('description', this.project.description);
		body.set('vnfs', String(this.project.numVnfs));

		this.http.post(endpoint,
			body.toString(),
			{
				headers: new HttpHeaders()
					.set('Content-Type', 'application/x-www-form-urlencoded')
					.set('Access-Control-Allow-Origin', this.config.baseSDK + ':5098')
			}
		).subscribe(response => {
			this.sdkService.newProject(this.project.name, this.project.author, this.project.vendor, this.project.description,
				this.project.numVnfs, response['uuid'], response['files']);
			this.router.navigate(['sdk/descriptor-displayer']);
		});
	}

	close() {
		this.router.navigate(['../'], { relativeTo: this.route });
	}
}
