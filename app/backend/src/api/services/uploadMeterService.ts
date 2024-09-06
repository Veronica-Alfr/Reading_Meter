/* eslint-disable class-methods-use-this */
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import genAI from '../IA/genAi';
import { IUploadBody } from '../../interfaces/IUploadBody';

const prisma = new PrismaClient();

class UploadMeterService {
  public returnMeasure = async ({ image, customerCode, measureDatetime, measureType }: IUploadBody) => {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const response = await model.generateContent([
      `Observe the uploaded image. If it is a water or gas meter, identify the reading number. 
      If it is legible, return the value as an integer. If the image is not legible, return 
      the following message: ‘Unreadable image, please upload a new one!’. If the number contains 
      multiple zeros, return only one zero. If any number on the meter is difficult to see because 
      it is rotating and therefore incomplete, do not return it, but return up to where the numbers 
      are visually complete on the meter. Do not use any characters other than numbers as a response.`,
      { inlineData: { data: image, mimeType: 'image/jpeg' } },
    ]);

    const numberMeter = response.response?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!numberMeter) {
      const err = new Error('Error finding response. Undefined value.');
      err.name = 'NotFound';
      throw err;
    }

    this.createDataMeter({ image, customerCode, measureDatetime, measureType });

    const datasImgMeasure = {
      imageUrl: `data:image/png;base64,${image}`,
      measureValue: Number.parseInt(numberMeter, 10),
      measureUuid: uuidv4(),
    };

    return datasImgMeasure;
  };

  public verifyMeterExist = async (measureDatetime: Date, measureType: string) => {
    const dataMeter = await prisma.dataMeter.findMany();
    console.log('Fora do for:', measureDatetime.getMonth() + 1);
    // Biblioteca vai de 0 a 11 para o mês, existe um erro com o mês 2 (fev) ? Apenas ele está retornando o seu próx (3 - março)
    // A "requisição" está 1 passo atrás? Refresh no docker está 1 passo a trás por não retornar ao ponto de partida?

    dataMeter.forEach((data) => {
      const monthDB = data.measureDatetime.getMonth() + 1;
      const monthMeterBody = measureDatetime.getMonth() + 1;

      console.log(monthDB, monthMeterBody);

      const yearDB = data.measureDatetime.getFullYear();
      const yearMeterBody = measureDatetime.getFullYear();

      if (monthDB === monthMeterBody && yearDB === yearMeterBody && data.measureType === measureType) {
        const err = new Error('Meter already exist!');
        err.name = 'hasReadingError';
        throw err;
      }
    });
  };

  public createDataMeter = async ({ image, customerCode, measureDatetime, measureType }: IUploadBody) => {
    console.log('measure data => ', measureDatetime);
    this.verifyMeterExist(measureDatetime, measureType);

    const createdDataMeter = await prisma.dataMeter.create({
      data: {
        image,
        customerCode,
        measureDatetime: new Date(measureDatetime),
        measureType,
      },
    });

    if (!createdDataMeter) {
      const err = new Error('Error creating DataMeter!');
      throw err;
    }

    return createdDataMeter;
  };
}

export default UploadMeterService;
