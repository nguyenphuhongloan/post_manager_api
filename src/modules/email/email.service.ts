import { Queue, Worker } from "bullmq";
import { Inject, Service, Token } from "typedi";
import { Config, configToken } from "../../config/configENV";
import { mailQueueService } from "../queue/queue.service";
import { BodyOption, EmailOption } from "./dto/email-option.dto";
import { connectionBullMQ, emailQueueName } from "../queue/mail-queue.service";
import nodemailer from "nodemailer";
import { google } from "googleapis";
import fs from "fs/promises";
import handlebars from "handlebars";
import path from "path"

@Service()
export class EmailService {
    @Inject(configToken)
    private readonly config!: Config;

    private transport!: nodemailer.Transporter;

    emailQueue: Queue;

    constructor() {
        this.emailQueue = mailQueueService.emailQueue;
        this.initWorker();
    }

    connect = async () => {
        const oauth2Client = new google.auth.OAuth2(this.config.CLIENT_ID, this.config.CLIENT_SECRET, this.config.REDIRECT_URL);
        oauth2Client.setCredentials({ refresh_token: this.config.REFRESH_TOKEN_MAIL });

        const myAccessToken = await new Promise((resolve, reject) => {
            oauth2Client.getAccessToken((err, token) => {
                if (err) {
                    reject(err);
                }
                resolve(token);
            });
        });

        this.transport = nodemailer.createTransport({
            service: this.config.EMAIL_SERVICE,
            auth: {
                type: "OAuth2",
                user: this.config.EMAIL,
                clientId: this.config.CLIENT_ID,
                clientSecret: this.config.CLIENT_SECRET,
                refreshToken: this.config.REFRESH_TOKEN_MAIL,
                accessToken: myAccessToken as string
            }
        });
        
        console.log("Connected Email Services")
    }

    initWorker = () => {
        new Worker<EmailOption<BodyOption>>(emailQueueName, async job => {
            await this.sendEmail(job.data);
        }, connectionBullMQ);
    }

    addSendEmailQueue = async (queueName: string, data: EmailOption<BodyOption>) => {
        return await this.emailQueue.add(queueName, data);
    }
    
    sendEmail = async (emailOption: EmailOption<BodyOption>) => {
        const htmlString = await fs.readFile(path.join(__dirname, `./templates/`, `${emailOption.template}`));
        const compiledTemplate = handlebars.compile(htmlString.toString('utf8'));
        const html = compiledTemplate(emailOption.body)
        await this.transport.sendMail({
            from: this.config.EMAIL,
            to: emailOption.email,
            subject: emailOption.subject,
            html: html
        });
    }
   
}

export const emailServiceToken = new Token<EmailService>();