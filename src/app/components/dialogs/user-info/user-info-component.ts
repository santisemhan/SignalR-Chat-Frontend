// Angular
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

// Models
import { UserConnection } from '../../../models/persistence/userConnection.model';


@Component({
    selector: 'dialog-user-info',
    templateUrl: 'user-info.component.html',
    styleUrls: ['./user-info.component.scss']
})
export class DialogUserInfo {

    // Form
    public userDataForm: FormGroup;

    public lastUploadImage64: string;

    readonly allowedFormats: string[] = ['image/jpeg', 'image/png', 'image/gif']

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
            // TODO: Warning in UI
            alert("Invalid fields");
            return;
        }

        const data = new UserConnection()
        data.name = this.userDataForm.controls['name'].value
        data.imageURL = this.userDataForm.controls['imageURL'].value

        this.dialogRef.close(data);
    }

    /**
     * @description
     *	Importa la foto subida por el usuario para luego mostrarla.
     */
    public onProfilePicChanged(file: File): void {

        // TODO: handle onDrop image

        if (this.allowedFormats.some(af => af === file.type)) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                this.lastUploadImage64 = reader.result as string;
                this.userDataForm.controls['imageURL'].setValue(this.lastUploadImage64);
            };
        } else {
            // TODO: Warning in UI
            alert("No allowed format")
        }
    }
}