import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { z } from "zod";
import { SNS } from "aws-sdk";

const sns = new SNS();

const CompletedRideSchema = z.object({
  id: z.number().positive(),
  fromLoc: z.string(),
  toLoc: z.string(),
  fare: z.number(),
});

export const handler: APIGatewayProxyHandlerV2 = async function (event) {
  console.log(`Body: ${JSON.stringify(event.body, null, 2)}`);
  const body = CompletedRideSchema.parse(event.body);
  console.log(`Processing Ride: ${body.id}`);

  try {
    const result = await sns
      .publish({
        Message: JSON.stringify(body),
        TopicArn: process.env.SNS_TOPIC_ARN,
      })
      .promise();
    console.log(`Message sent successfully: ${result.MessageId}`);
  } catch (error) {
    console.log(`Error sending message: ${error}`);
    return {
      statusCode: 500,
      body: JSON.stringify({
        messsage: "Error sending message",
      }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Completed Successfully",
    }),
  };
};
