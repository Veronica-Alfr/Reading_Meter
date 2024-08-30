import { Router } from 'express';
import UploadMeterService from '../api/services/uploadMeterService';
import UploadMeterController from '../api/controllers/uploadMeterController';

const UploadRouter = Router();

const uploadService = new UploadMeterService();
const uploadController = new UploadMeterController(uploadService);

UploadRouter.post('/', (req, res) => uploadController.createDataMeter(req, res));

export default UploadRouter;
