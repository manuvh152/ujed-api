import { validImageExtensions, validVideoExtensions } from "../constants/constants";

export const fileFilter = ( req: Express.Request, file: Express.Multer.File, callback: Function ) => {

  if( !file ) return callback( new Error('File is empty'), false );

  const fileExtension = file.mimetype.split('/')[1];

  if( validImageExtensions.includes(fileExtension) ){
    return callback(null, true)
  }

  if( validVideoExtensions.includes(fileExtension) ){
    return callback(null, true)
  }

  callback(null, false)

}