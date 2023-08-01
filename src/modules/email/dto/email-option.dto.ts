import { Expose } from "class-transformer";

export class EmailOption<BodyOption> {
    @Expose()
    email!: string;

    @Expose()
    body!: BodyOption;

    @Expose()
    template!: emailTemplate;

    subject?: string;

    constructor(email: string, body: BodyOption, template: emailTemplate)  {
        this.email = email;
        this.body = body;
        this.template = template;
        this.subject = subject[this.template]
    }
}

export enum emailTemplate {
    register = "register.html"
}

const subject: Record<emailTemplate, string> = {
    [emailTemplate.register]: 'Verify Register'
}

export type BodyOption = RegisterOption;

export interface RegisterOption {
    name: string;
    otp: string;
    hashPassword?: string;
}