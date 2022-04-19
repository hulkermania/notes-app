import * as iam from 'aws-cdk-lib/aws-iam';
import * as sst from '@serverless-stack/resources';

export default class AuthStack extends sst.Stack {
  auth;

  constructor(scope: sst.App, id: string, props?: any) {
    super(scope, id, props);

    const { api, bucket } = props;

    // Cognito User Pool and Identity Pool 생성
    this.auth = new sst.Auth(this, 'auth-jonghak', {
      cognito: {
        userPool: {
          // 유저는 이메일과 패스워드로 인증하도록 설정
          signInAliases: { email: true },
        },
      },
    });

    this.auth.attachPermissionsForAuthUsers([
      // API 접근 허용
      api,
      // 특정 S3 버킷의 폴더에 접근을 허용해준다.
      new iam.PolicyStatement({
        actions: ['s3:*'],
        effect: iam.Effect.ALLOW,
        resources: [
          bucket.bucketArn + '/private/${cognito-identity.amazonaws.com:sub}/*',
        ],
      }),
    ]);

    // 생성된 ID값들을 노출시켜준다.
    this.addOutputs({
      Region: scope.region,
      UserPoolId: this.auth.cognitoUserPool!.userPoolId,
      IdentityPoolId: this.auth.cognitoCfnIdentityPool.ref,
      UserPoolClientId: this.auth.cognitoUserPoolClient!.userPoolClientId,
    });
  }
}