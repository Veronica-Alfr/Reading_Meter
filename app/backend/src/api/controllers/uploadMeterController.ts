import { Request, Response } from 'express';
import { IUploadBody } from '../../interfaces/IUploadBody';
import { validateDataMeter } from '../../middlewares/validations/schema';
import UploadMeterService from '../services/uploadMeterService';

class UploadMeterController {
  constructor(private dataMeterService: UploadMeterService) {}

  public createDataMeter = async (req: Request, res: Response): Promise<object> => {
    const dataMeterBody: IUploadBody = validateDataMeter(req.body);

    if (!dataMeterBody) {
      const err = new Error('The data provided in the request body is invalid.');
      err.name = 'BadRequest';
      throw err;
    }

    const measures = await this.dataMeterService.createDataMeterAndReturnMeasure(dataMeterBody);

    return res.status(200).json(measures);
  };
}

export default UploadMeterController;
