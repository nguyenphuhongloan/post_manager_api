import multer from "multer";
import { Err } from "../../helpers/error";
import { v2 as cloudinary } from 'cloudinary';
import stream from "stream";
import { Inject, Service } from "typedi";
import { Config, configToken } from "../../config/configENV";

export default multer({
    storage: multer.memoryStorage(),
    fileFilter: (req, file, cb) => {
        const index = file.originalname.lastIndexOf(".");
        const filetype = file.originalname.slice(index);
        const typeAllow = ['image/jpeg', 'image/png', 'image/jpg'];
        const typeFileAllow = ['.jpeg', '.png', '.jpg']
        if (typeAllow.includes(file.mimetype) && typeFileAllow.includes(filetype)) {
            cb(null, true);
        } else {
            cb(Err.InvalidFileType);
        }
    }
});

@Service()
export class UploadService {
    @Inject(configToken)
    private readonly config!: Config;
    
    connect = () => {
        cloudinary.config({
            cloud_name: this.config.CLOUD_NAME,
            api_key: this.config.API_KEY,
            api_secret: this.config.API_SECRET
        });
    };

    uploadImage = async (file: Express.Multer.File, folder: FolderUploadName) => {
        const bufferStream = new stream.PassThrough()
        bufferStream.end(file?.buffer);
        const uploadRes: string = await new Promise((resolve, reject) => {
            const upload = cloudinary.uploader.upload_stream({
                folder: folder,
            }, (error, result) => {
                if(error)
                    reject(error);
                resolve(result!.url);
            });
            bufferStream.pipe(upload);
        });
        return uploadRes;
    }
}

export enum FolderUploadName {
    Avatar = "avatar"
}