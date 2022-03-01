// Angular
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

// Models
import { UserConnection } from '../../../models/persistence/userConnection.model';


@Component({
    selector: 'dialog-user-info',
    templateUrl: 'user-info.component.html',
})
export class DialogUserInfo {

    // Form
    public userDataForm: FormGroup;

    constructor(public dialogRef: MatDialogRef<DialogUserInfo>) {
        /**
        * @description
        *	Parametro UI para que el usuario no pueda cerrar el dialog
        *   tocando fuera del container.
        */
        dialogRef.disableClose = true;
    }

    ngOnInit() {
        this.initUserDataForm()
    }


    /**
     * @description
     *	Inicializa el formulario para llenar los datos del usuario.
     */
    public initUserDataForm(): void {
        this.userDataForm = new FormGroup({
            name: new FormControl('', Validators.required),
            imageURL: new FormControl('', Validators.required)
        })
    }

    /**
     * @description
     *	Verifica que el formulario este completo correctamente y
     *  envia la data correspondiente al componente padre.
     */
    public onSendData(): void {
        const controls = this.userDataForm.controls;
        if (this.userDataForm.invalid) {
            Object.keys(controls).forEach(controlName => {
                controls[controlName].markAsTouched();
            }
            );
            return;
        }

        const data = new UserConnection()
        data.name = this.userDataForm.controls['name'].value
        data.imageURL = this.userDataForm.controls['imageURL'].value

        this.dialogRef.close(data);
    }
}