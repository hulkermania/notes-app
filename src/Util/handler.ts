import * as sst from "@serverless-stack/resources";
import { HttpMethods } from "aws-cdk-lib/aws-s3";

export default class StorageStack extends sst.Stack {
  // 외부에서 접근할 수 있도록 선언
  table;
  bucket;
  
  constructor(scope: sst.App, id: string, props?: sst.StackProps) {
    super(scope, id, props);

    // DynamoDB 테이블 생성 (두번째 의자에 본인 이니셜로 ID를 넣어주자)
    this.table = new sst.Table(this, "notes-jonghak", {
      dynamodbTable: {
        //여기서 tableName을 본인 이니셜을 포함해 설정한다.
        tableName: `notes-jonghak`,
      },
      fields: {
        userId: sst.TableFieldType.STRING,
        noteId: sst.TableFieldType.STRING,
      },
      primaryIndex: { partitionKey: "userId", sortKey: "noteId"}
    });
    // S3Bucket 생성
    this.bucket = new sst.Bucket(this, "Uploads", {
      s3Bucket: {
        // 클라이언트에서 S3 버킷으로 접근가능하도록 CORS 설정
        cors: [
          {
            maxAge: 3000,
            allowedOrigins: ["*"],
            allowedHeaders: ["*"],
            allowedMethods: [
              HttpMethods.GET,
              HttpMethods.POST,
              HttpMethods.PUT,
              HttpMethods.DELETE,
              HttpMethods.HEAD,
            ],
          },
        ],
      },
    });
  }
}