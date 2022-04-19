import handler from "./Util/handler";
import dynamoDb from "./Util/dynamodb";

export const main = handler(async (event) => {
  const params = {
    TableName: process.env.TABLE_NAME!,
    // 'KeyCoditionExporession' dynamoDB에서 query에 사용되는 키값을 정의
    // - 'userId = :userId' 이것은 userId 키와 일치하는 값만 조회하게 된다
    // partition key (userId와 일치하는 모든 목록을 조회한다)
    keyConditionExpression: "userId = :userId",
    // 'ExpressionAttributeValues' 위에 KeyConditionExpresstion에 매칭되는 값을 정의
    // - ':userId': 'userId' 의 값을 정의한다.
    ExpressionAttributeValues: {
      ":userId": event.requestContext.authorizer.iam.cognitoIdentity.identityId,
    },
  };

  const result = await dynamoDb.query(params);

  // 조회된 목록을 반환
  return result.Items;
});