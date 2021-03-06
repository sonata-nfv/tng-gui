import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainPageComponent } from './main-page/main-page.component';
import { DescriptorGeneratorComponent } from './descriptor-generator/descriptor-generator.component';
import { DescriptorDisplayerComponent } from './descriptor-displayer/descriptor-displayer.component';

const routes: Routes = [
	{
		path: '',
		children: [
			{
				path: '',
				component: MainPageComponent,
			}, {
				path: 'descriptor-generator',
				component: DescriptorGeneratorComponent,
			}, {
				path: 'descriptor-displayer',
				component: DescriptorDisplayerComponent
			}
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class SdkRoutingModule { }
