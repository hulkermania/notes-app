import * as sst from "@serverless-stack/resources";
import StorageStack from "./StorageStack";
import ApiStack from "./ApiStack";
import AuthStack from "./AuthStack";
import FrontendStack from "./FrontendStack";

export default function main(app: sst.App): void {
  // 두번째 인자에 본인 이름이나 이니셜로 생성해주자
  // ex) storage-sykim
  const storageStack = new StorageStack(app, 'storage-jonghak');

  // 두번째 인자에 본인 이름이나 이니셜로 생성해주자
  // ex) api-sykim
  const apiStack = new ApiStack(app, 'api-jonghak', {
    table: storageStack.table,
  });

  // 두번째 인자에 본인 이름이나 이니셜로 생성해주자
  // ex) auth-sykim
  const authStack = new AuthStack(app, 'auth-jonghak', {
    api: apiStack.api,
    bucket: storageStack.bucket,
  });

      // React 관련 스택 추가
  new FrontendStack(app, "frontend-jonghak", {
    api: apiStack.api,
    auth: authStack.auth,
    bucket: storageStack.bucket,
  });
}
