
export const pdfFilter = ( req: Express.Request, file: Express.Multer.File, callback: Function ) => {

  if( !file ) return callback( new Error('File is empty'), false );

  const pdfExtensions = ['pdf'];

  const fileExtension = file.mimetype.split('/')[1];

  if( pdfExtensions.includes(fileExtension) ){
    return callback(null, true)
  }

  callback(null, false)

}