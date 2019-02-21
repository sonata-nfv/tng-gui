import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { SettingsService } from '../settings.service';
import { CommonService } from '../../shared/services/common/common.service';

@Component({
    selector: 'app-vim-create',
    templateUrl: './vim-create.component.html',
    styleUrls: [ './vim-create.component.scss' ],
    encapsulation: ViewEncapsulation.None
})
export class VimCreateComponent implements OnInit {
    loading: boolean;
    vimForm: FormGroup;
    openstackForm: FormGroup;
    kubernetesForm: FormGroup;
    vimTypes = [ 'Openstack', 'Kubernetes' ];
    vimType: string;
    disabledButton = true;
    externalRouters: Array<string>;
    externalNetworks: Array<string>;

    constructor(
        private settingsService: SettingsService,
        private commonService: CommonService,
        private router: Router,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        this.vimForm = new FormGroup({
            name: new FormControl('', Validators.required),
            city: new FormControl(),
            country: new FormControl(),
            endpoint: new FormControl('', Validators.required)
        });
        this.openstackForm = new FormGroup({
            username: new FormControl('', Validators.required),
            password: new FormControl('', Validators.required),
            tenant: new FormControl('', Validators.required),
            domain: new FormControl(),
            networkEndpoint: new FormControl('', Validators.required), // Use "Mock" if empty
            privateNetwork: new FormControl('', Validators.required),
            privateNetworkMask: new FormControl('', Validators.required),
            externalNetworkID: new FormControl(), // '', Validators.required
            externalRouterID: new FormControl() // '', Validators.required
        });
        this.kubernetesForm = new FormGroup({
            config: new FormControl('', Validators.required)
        });

        this.vimForm.valueChanges.subscribe(value =>
            this._onFormChanges(value)
        );
        this.kubernetesForm.valueChanges.subscribe(value =>
            this._onFormChanges(value)
        );
        this.openstackForm.valueChanges.subscribe(value =>
            this._onFormChanges(value)
        );
    }

    private _onFormChanges(values?) {
        if (this.vimType === 'Openstack') {
            this.disabledButton =
                this.vimForm.valid && this.openstackForm.valid ? false : true;
        } else {
            this.disabledButton =
                this.vimForm.valid && this.kubernetesForm.valid ? false : true;
        }
    }

    receiveType(type) {
        this.vimType = type;
        this._onFormChanges();
    }

    private _getVimData() {
        const vim = {
            name: this.vimForm.get('name').value,
            city: this.vimForm.get('city').value,
            country: this.vimForm.get('country').value,
            endpoint: this.vimForm.get('endpoint').value
        };

        if (this.vimType === 'Openstack') {
            vim[ 'username' ] = this.openstackForm.get('username').value;
            vim[ 'password' ] = this.openstackForm.get('password').value;
            vim[ 'tenant' ] = this.openstackForm.get('tenant').value;
            vim[ 'domain' ] = this.openstackForm.get('domain').value;
            // TODO Use "Mock" if empty: which mock?
            vim[ 'networkEndpoint' ] = this.openstackForm.get('networkEndpoint').value;
            vim[ 'privateNetwork' ] = this.openstackForm.get('privateNetwork').value;
            vim[ 'privateNetworkMask' ] = this.openstackForm.get('privateNetworkMask').value;
            vim[ 'externalNetworkID' ] = this.openstackForm.get('externalNetworkID').value;
            vim[ 'externalRouterID' ] = this.openstackForm.get('externalRouterID').value;
        } else {
            vim[ 'config' ] = this.kubernetesForm.get('config').value;
        }

        return vim;
    }

    createVim() {
        this.loading = true;
        const vim = this._getVimData();
        this.settingsService
            .postVim(this.vimType, vim)
            .then(message => {
                this.loading = false;
                this.commonService.openSnackBar(message, '');
                this.close();
            })
            .catch(() => {
                this.loading = false;
                this.commonService.openSnackBar('There was an error in the VIM creation', '');
            });
    }

    close() {
        this.router.navigate([ '../' ], { relativeTo: this.route });
    }
}