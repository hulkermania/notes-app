import * as sst from "@serverless-stack/resources";
import { ApiAuthorizationType } from "@serverless-stack/resources";

export default class ApiStack extends sst.Stack {
  // 다른 스택에서 접근할 수 있도록 서언
  api;

  constructor(scope: sst.App, id: string, props?: any) {
    super(scope, id, props);

    const { table } = props;

    // API 생성 (두번째 인자에 본인 이니셜을 포함해 ID를 넣어주자)
    this.api = new sst.Api(this, "api-jonghak", {
      // AWS_IAM 인증하도록 설정
      defaultAuthorizationType: ApiAuthorizationType.AWS_IAM,
      defaultFunctionProps: {
        environment: {
          TABLE_NAME: table.tableName,
        },
      },
      cors: true, // -->> CORS 설정 추가
      routes: {
        "POST /notes": "src/create.main", // 메모 생성 API
        "GET /notes/{id}": "src/get.main", // 메모 조회 API
        "GET /notes": "src/list.main", // 메모 목록 조회 API
        "PUT /notes/{id}": "src/update.main", // 메모 수정 API
        "DELETE /notes/{id}": "src/delete.main", // 메모 삭제 API
      },
    });

    // API가 DyanamoDB 테이블에 접근할 수 있도록 권한 설정
    this.api.attachPermissions([table]);

    // API의 EndPoint Url을 노출
    this.addOutputs({
      ApiEndpoint: this.api.url,
    });
  }
}