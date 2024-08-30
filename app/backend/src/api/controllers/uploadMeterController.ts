import { Request, Response } from 'express';
import { IUploadBody } from '../../interfaces/IUploadBody';
import { validateDataMeter } from '../../middlewares/validations/schema';
import UploadMeterService from '../services/uploadMeterService';

class UploadMeterController {
  constructor(private dataMeterService: UploadMeterService ) {}

  public createDataMeter = async (req: Request, res: Response): Promise<object> => {
    const dataBillsBody: IUploadBody = validateDataMeter(req.body);

    const createdDataBills = await this.dataMeterService.createDataMeter(dataBillsBody);

    return res.status(201).json(createdDataBills);
  };
}

export default UploadMeterController;
