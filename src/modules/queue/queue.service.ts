import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter"
import { ExpressAdapter } from "@bull-board/express";
import { MailQueueService } from "./mail-queue.service";
import Container from "typedi";

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/admin/queues');

export const mailQueueService = Container.get(MailQueueService);
const emailAdapter = new BullMQAdapter(mailQueueService.emailQueue, { allowRetries: true })
createBullBoard({
    queues: [emailAdapter],
    serverAdapter: serverAdapter,
});

export default serverAdapter;