export abstract class ErrorMessagesConstants {

    static readonly messages: {[key: string]: string} = {
        'email': 'No es una dirección de correo electrónico.',
        'required': 'Este campo es requerido.',
        "numeric": "Solo debe tener caracteres numéricos.",
        'maxlength': 'La longitud debe ser menor o igual que {{requiredLength}} caracteres. Ingresó {{actualLength}} caracter(es).',
        "minlength": "La longitud debe ser mayor o igual que {{requiredLength}} caracteres. Ingresó {{actualLength}} caracter(es).",
        "min": "El valor debe ser mayor o igual que {{min}}.",
        "max": "El valor debe ser menor o igual que {{max}}.",
        "fileformat": "El archivo no tiene un formato válido.",
        "filesize": "El archivo tiene un tamaño que excede el máximo permitido.",
    };

}