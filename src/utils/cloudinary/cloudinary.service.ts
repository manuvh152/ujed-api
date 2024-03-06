import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';

@Injectable()
export class CloudinaryService {

  async uploadFile(
    file: Express.Multer.File,
    folderName: string
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      v2.uploader.upload_stream(
        {
          resource_type: 'auto',
          folder: folderName,
          timeout: 600000,
          quality: 'auto'
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      ).end(file.buffer)
    })
  }

  async uploadFiles(
    files: Express.Multer.File[],
    folderName: string
  ) {
    const urls = await Promise.all(files.map(async (file): Promise<string> => {
      const { secure_url } = await this.uploadFile(file, folderName);
      return secure_url;
    }));
    return urls;
  }

  async deleteFile(
    id: string
  ) {
    return new Promise((resolve, reject) => {
      v2.uploader.destroy(
        id,
        (error, result) => {
          if(error) return reject(error);
          resolve(result);
        }
      );
    })
  }

  async deleteFiles(
    ids: string[]
  ) {
    await Promise.all(ids.map(async (id) => {
      await this.deleteFile(id);
    }));
    return;
  }

}
