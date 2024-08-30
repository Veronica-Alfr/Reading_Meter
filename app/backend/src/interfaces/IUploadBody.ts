export interface IUploadBody {
  image: string,
  customerCode: string,
  measureDatetime: Date,
  measureType: string
}

export interface IUploadResponse {
  imageUrl: string,
  measureValue:number,
  measureUuid: string
}
