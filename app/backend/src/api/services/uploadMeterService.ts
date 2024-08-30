import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import multer from 'multer';
import genAI from '../IA/genAi';
import { IUploadBody } from '../../interfaces/IUploadBody';
// import mime from "mime";

// const upload = multer({ dest: 'uploads/' });

const prisma = new PrismaClient();

class UploadMeterService {
  public createDataMeter = async ({ image, customerCode, measureDatetime, measureType }: IUploadBody): Promise<object> => {
    const createdDataBills = await prisma.dataBill.create({
      data: {
        image: '',
        customerCode: '',
        measureDatetime: new Date(''),
        measureType: '',
      },
    });

    if (!createdDataBills) {
      const err = new Error('Error creating DataBills');
      err.name = 'Internal Server Error';
      throw err;
    }

    // const mimeType = mime.lookup(image);
    // if (!mimeType) {
    //     const err = new Error('Invalid image type');
    //     err.name = 'BadRequest';
    //     throw err;
    // }

    const currentDate = new Date();
    const formattedDate = currentDate.toISOString();

    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
          cb(null, '/app/backend/src/api/uploads/');
        },
        filename: (req, file, cb) => {
          cb(null, `upload-${formattedDate}-${file.originalname}`);
        },
    });
      
    const upload = multer({ storage }).single('image') ;

    const filePath = '/app/backend/src/api/uploads/upload-image.jpeg';
    fs.writeFileSync(filePath, image);
    
    const base64Image = fs.readFileSync(filePath).toString('base64');

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const response = await model.generateContent([
      `Observe the uploaded image. If it is a water or gas meter, identify the reading number. 
        If it is legible, return the value as an integer. If the image is not legible, return 
        the following message: ‘Unreadable image, please upload a new one!’`,
      { inlineData: { data: base64Image, mimeType: 'image/jpeg' } },
    ]);

    return response;

    // return createdDataBills;
  };
}

export default UploadMeterService;
