import express, { NextFunction, Request, Response } from "express";
import { config } from "./config/configENV";
import AppDataSource from "./database/connection";
import userRouters from './modules/users/user.router';
import postRouters from './modules/post-manager/post/post.router';
import commentRouters from './modules/comment-manager/comment/comment.router';
import { handleError } from "./helpers/error";
import serverAdapter from "./modules/queue/queue.service";
import { Container } from "typedi";
import { EmailService } from "./modules/email/email.service";
import { UploadService } from "./modules/upload/upload.service";

const app = express();
const port = config.PORT;

async function bootstrap() {
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());

    app.get('/', (req: Request, res: Response) => {
        res.send('Hello World!');
    });

    await AppDataSource.initialize()

    const emailService = Container.get(EmailService);
    emailService.connect();
    
    const cloudinaryService = Container.get(UploadService);
    cloudinaryService.connect();

    app.use("/api/post", postRouters);
    app.use("/api/user", userRouters);
    app.use("/api/comment", commentRouters);
    app.use('/admin/queues', serverAdapter.getRouter());

    app.use((err: Error, req: Request, res: Response, next: NextFunction): void => {
        handleError(err, res);
    })

    app.listen(port, () => {
        return console.log(`Express is listening at http://localhost:${port}`)
    });
}

bootstrap();