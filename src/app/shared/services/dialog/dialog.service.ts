import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';

import { DialogComponent } from '../../components/dialog/dialog.component';

@Injectable()
export class DialogDataService {
	constructor(public dialog: MatDialog) { }

	openDialog(title: string, content: string, action: string, onAction: any, onCancel?: any, secondaryAction?: string) {
		// Open only if no other dialog is opened
		if (!this.dialog.openDialogs.length) {
			const dialogRef = this.dialog.open(DialogComponent, {
				data: {
					title: title,
					content: content,
					action: action.toUpperCase(),
					secondaryAction: secondaryAction ? secondaryAction.toUpperCase() : null
				}
			});

			dialogRef.afterClosed().subscribe(result => {
				if (result === 'action') {
					onAction();
				} else if (result !== 'action' && onCancel) {
					onCancel();
				}
			});
		}
	}
}
