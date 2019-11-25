import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Config } from './config';

@Injectable()
export class ConfigService extends Config {
	base = window.location.origin + '/api/v3/';
	baseSP = window.location.origin + '/api/v3/';
	baseVNV = window.location.origin + '/api/v3/';
	roles = 'users/roles';
	register = 'users/';
	login = 'users/sessions/';
	services = 'services';
	requests = 'requests';
	serviceRecords = 'records/services';
	platformUptime = 'records/services/uptime';
	functionRecords = 'records/functions';
	licenses = 'slas/licenses';
	buyLicense = 'slas/licenses/buy';
	licenseStatus = 'slas/licenses/status';
	packages = 'packages';
	slaTemplates = 'slas/templates';
	slaAgreements = 'slas/agreements';
	slaViolations = 'slas/violations';
	guarantees = 'slas/configurations/guaranteesList';
	flavors = 'slas/configurations/deploymentflavours';
	functions = 'functions';
	slicesTemplates = 'slices';
	slicesInstances = 'slice-instances';
	testPlans = 'tests/plans';
	testPlansTests = 'tests/plans/tests';
	testPlansPolicies = 'tests/plans/policies';
	testPlansServices = 'tests/plans/services';
	testDescriptors = 'tests/descriptors';
	testExecute = 'tests/plans';
	testExecutions = 'tests/results';
	placementPolicies = 'policies/placement';
	runtimePolicies = 'policies';
	runtimePolicyActivation = 'policies/activate/';
	runtimePolicyDeactivation = 'policies/deactivate/';
	runtimePoliciesUI = 'policies/ui';
	runtimePoliciesBind = 'policies/bind/';
	runtimePoliciesClone = 'policies/clone/';
	runtimePoliciesDefault = 'policies/default/';
	runtimePoliciesActions = 'policies/actions';
	runtimePoliciesRecords = 'policies/records';
	runtimePoliciesMonitoringMetrics = 'policies/monitoring_metrics/';
	vimSettings = 'settings/vims';
	vimOpenstackSettings = 'settings/vims/heat';
	vimK8sSettings = 'settings/vims/k8s';
	wimSettings = 'settings/wims';
	tapiSettings = 'settings/wims/tapi';
	platformSettings = 'settings/platforms';
	graphs = 'monitoring/graphs';
	monitoringData = 'monitoring/data/services';
	monitoringTargets = 'monitoring/data/prometheus/targets';
	analyticResults = 'analytics/results/list';
	analyticServices = 'analytics/list';
	analyticMonitoringMetrics = 'analytics/tests/vnv/';
	analyticProcessExecution = 'analytics/analytic_service';

	private configFile = './config.json';

	constructor(private http: HttpClient) {
		super();
	}

	init(): Promise<Config> {
		if (window.location.origin.includes('localhost')) {
			this.base = 'http://pre-int-vnv-bcn.5gtango.eu:32002/api/v3/';
			this.baseSP = 'http://pre-int-sp-ath.5gtango.eu:32002/api/v3/';
			this.baseVNV = 'http://pre-int-vnv-bcn.5gtango.eu:32002/api/v3/';
		}

		return new Promise<Config>((resolve, reject) => {
			this.http.get(this.configFile).subscribe(
				response => {
					Object.assign(this, response as Config);
					resolve(this);
				},
				(error: HttpErrorResponse) => {
					reject(error.error);
				}
			);
		});
	}
}
