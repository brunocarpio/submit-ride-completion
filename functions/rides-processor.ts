import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { z } from "zod";

const CompletedRideSchema = z.object({
  id: z.number().positive(),
  fromLoc: z.string(),
  toLoc: z.string(),
  fare: z.number(),
});

export const handler: APIGatewayProxyHandlerV2 = async function (event) {
  //console.log(`Event: ${JSON.stringify(event, null, 2)}`);
  //console.log(`Context: ${JSON.stringify(context, null, 2)}`);
  console.log(`Body: ${JSON.stringify(event.body, null, 2)}`);
  const body = CompletedRideSchema.parse(event.body);
  console.log(`Processing Ride: ${body.id}`);

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Success",
    }),
  };
};
