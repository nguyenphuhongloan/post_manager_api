import { Queue } from "bullmq";
import { BodyOption, EmailOption } from "../email/dto/email-option.dto";
import { Service } from "typedi";

export const connectionBullMQ = {
    connection: {
        host: "localhost",
        port: 6379
    }
};
export const emailQueueName = "emailQueue";
export const mailQueue = new Queue(emailQueueName, connectionBullMQ)

@Service()
export class MailQueueService {
    emailQueue: Queue<EmailOption<BodyOption>> = new Queue<EmailOption<BodyOption>>(emailQueueName, connectionBullMQ);
}