import * as uuid from "uuid"
import handler from "./Util/handler";
import dynamoDb from "./Util/dynamodb";

export const main = handler(async (event) => {
  // JSON으로 데이터를 넘겨 'event.body' 에서 파싱이 필요하다.
  const data = JSON.parse(event.body);

  const params = {
    TableName: process.env.TABLE_NAME!,
    Item: {
      userId: event.requestContext.authorizer.iam.cognitoIdentity.identityId,
      noteId: uuid.v1(),
      content: data.content,
      attachment: data.attachment,
      createAt: Date.now(),
    },
  };

  await dynamoDb.put(params);

  return params.Item;
})